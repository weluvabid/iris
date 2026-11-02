import { cp, mkdir, mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const temp = await mkdtemp(join(tmpdir(), 'iris-consumer-'));
const fixture = join(root, 'tests/consumer');

function run(command, args, cwd, label) {
  const result = spawnSync(command, args, {
    cwd,
    encoding: 'utf8',
    maxBuffer: 16 * 1024 * 1024,
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  if (result.stdout) {
    process.stdout.write(result.stdout);
  }

  if (result.stderr) {
    process.stderr.write(result.stderr);
  }

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    throw new Error(`${label} failed with exit code ${result.status ?? 'unknown'}.`);
  }
}

try {
  const packed = spawnSync(
    'npm',
    ['pack', '--json', '--pack-destination', temp, '--ignore-scripts'],
    {
      cwd: root,
      encoding: 'utf8',
      maxBuffer: 16 * 1024 * 1024,
    },
  );

  if (packed.error) {
    throw packed.error;
  }

  if (packed.status !== 0) {
    throw new Error(packed.stderr || 'npm pack failed.');
  }

  const [{ filename }] = JSON.parse(packed.stdout);
  const tarball = join(temp, filename);
  const consumer = join(temp, 'consumer');

  await mkdir(consumer, { recursive: true });
  await cp(fixture, consumer, { recursive: true });

  const manifestPath = join(consumer, 'package.json');
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));

  manifest.dependencies = {
    '@weluvabid/iris': `file:${tarball}`,
  };
  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

  const packageManifest = JSON.parse(await readFile(join(root, 'package.json'), 'utf8'));
  const exported = Object.keys(packageManifest.exports);
  const uiDirectories = await readdir(join(root, 'dist/components/ui'), {
    withFileTypes: true,
  });

  await writeFile(join(consumer, 'pnpm-workspace.yaml'), 'allowBuilds:\n  esbuild: true\n');

  run('pnpm', ['install', '--no-frozen-lockfile'], consumer, 'Consumer install');

  const installedRoot = join(consumer, 'node_modules/@weluvabid/iris');

  // Check every declared non-pattern export resolves to a real installed target.
  for (const [subpath, conditions] of Object.entries(packageManifest.exports)) {
    if (subpath.includes('*')) {
      continue;
    }

    const target =
      typeof conditions === 'string'
        ? conditions
        : (conditions.types ?? conditions.svelte ?? conditions.import ?? conditions.default);

    if (typeof target !== 'string') {
      throw new Error(`Unsupported export mapping for ${subpath}.`);
    }

    try {
      await readFile(join(installedRoot, target.replace(/^\.\//, '')));
    } catch {
      throw new Error(`Export ${subpath} points to missing installed file ${target}.`);
    }
  }

  // Every wildcard component export must have its package target.
  for (const entry of uiDirectories.filter((item) => item.isDirectory())) {
    for (const extension of ['js', 'd.ts']) {
      const target = join(installedRoot, 'dist/components/ui', entry.name, `index.${extension}`);

      try {
        await readFile(target);
      } catch {
        throw new Error(`Component subpath export is missing: ${entry.name}/index.${extension}.`);
      }
    }
  }

  // Fail early if the package still leaks unresolved SvelteKit aliases.
  const sourceFiles = [];

  async function collect(directory) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const path = join(directory, entry.name);

      if (entry.isDirectory()) {
        await collect(path);
      } else if (/\.(?:js|ts|svelte|d\.ts)$/.test(entry.name)) {
        sourceFiles.push(path);
      }
    }
  }
  await collect(join(installedRoot, 'dist'));

  for (const path of sourceFiles) {
    const source = await readFile(path, 'utf8');

    if (/(?:from\s*|import\s*\()\s*['"]\$lib(?:\/|['"])/.test(source)) {
      throw new Error(
        `Unresolved $lib alias in published file: ${path.slice(installedRoot.length + 1)}.`,
      );
    }
  }

  run(
    'pnpm',
    ['exec', 'svelte-check', '--tsconfig', './tsconfig.json'],
    consumer,
    'Consumer type check',
  );
  run('pnpm', ['exec', 'vite', 'build'], consumer, 'Consumer production build');

  const assetsDirectory = join(consumer, 'dist/assets');
  const assets = await readdir(assetsDirectory);
  const cssFiles = assets.filter((file) => file.endsWith('.css'));
  const css = (
    await Promise.all(cssFiles.map((file) => readFile(join(assetsDirectory, file), 'utf8')))
  ).join('\n');

  if (!css.includes('.inline-flex')) {
    throw new Error(
      'Tailwind did not generate Iris component utilities from the installed package.',
    );
  }

  if (!assets.some((file) => file.startsWith('atkinson-hyperlegible-'))) {
    throw new Error('The Iris theme fonts were not included in the consumer build.');
  }

  process.stdout.write(
    `Consumer smoke test passed: ${exported.length} public export mappings and ${uiDirectories.filter((item) => item.isDirectory()).length} component subpaths inspected.\n`,
  );
} finally {
  await rm(temp, { recursive: true, force: true });
}
