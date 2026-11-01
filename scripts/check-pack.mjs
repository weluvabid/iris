import { access, readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';

const packageRoot = new URL('../', import.meta.url);
const manifest = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
const requiredFiles = [
  'src/lib/index.js',
  'src/lib/index.d.ts',
  'src/lib/SiteHeader.svelte',
  'src/lib/SiteFooter.svelte',
  'src/lib/StickyPill.svelte',
  'src/lib/components/shell/BrandLink.svelte',
  'src/lib/components/shell/HeaderNavigation.svelte',
  'src/lib/components/shell/IconLink.svelte',
  'src/lib/components/shell/ThemeToggle.svelte',
  'src/lib/components/ui/badge/index.ts',
  'src/lib/components/ui/tooltip/index.ts',
  'src/lib/sticky-pill.ts',
  'src/styles/theme.css',
  'src/styles/fonts/atkinson-hyperlegible-regular.otf',
  'src/styles/fonts/atkinson-hyperlegible-bold.otf',
  'src/styles/fonts/LICENSE.txt',
  'src/theme.js',
  'src/theme.d.ts',
];

for (const file of requiredFiles) {
  await access(new URL(file, packageRoot));
}

for (const exportPath of ['.', './components', './theme', './theme.css', './package.json']) {
  if (!manifest.exports[exportPath]) {
    throw new Error(`Missing package export: ${exportPath}`);
  }
}

if (manifest.files.some((file) => file.startsWith('demo') || file.endsWith('.html'))) {
  throw new Error('Demo HTML must not be included in the published package.');
}

const packed = spawnSync('npm', ['pack', '--dry-run', '--json', '--ignore-scripts'], {
  cwd: packageRoot,
  encoding: 'utf8',
});

if (packed.error) {
  throw packed.error;
}

if (packed.status !== 0) {
  throw new Error(packed.stderr || 'npm pack --dry-run failed.');
}

const [packResult] = JSON.parse(packed.stdout);
const packedFiles = new Set(packResult.files.map(({ path }) => path));

for (const file of requiredFiles) {
  if (!packedFiles.has(file)) {
    throw new Error(`Required package file is missing from npm pack: ${file}`);
  }
}

const forbiddenFiles = [...packedFiles].filter(
  (file) => file.startsWith('demo/') || file.startsWith('tests/') || file.startsWith('scripts/'),
);

if (forbiddenFiles.length > 0) {
  throw new Error(`Repository-only files leaked into the package: ${forbiddenFiles.join(', ')}`);
}

process.stdout.write(`Verified ${packedFiles.size} files in the npm package.\n`);
