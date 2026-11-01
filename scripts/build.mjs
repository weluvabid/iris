import { readdir, readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { compile } from 'svelte/compiler';

const componentDirectory = new URL('../src/lib/', import.meta.url);
const componentFiles = [];

async function collectSvelteFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });

  for (const entry of entries) {
    const path = new URL(`${entry.name}${entry.isDirectory() ? '/' : ''}`, directory);

    if (entry.isDirectory()) {
      await collectSvelteFiles(path);
    } else if (entry.name.endsWith('.svelte')) {
      componentFiles.push(path);
    }
  }
}

await collectSvelteFiles(componentDirectory);

if (componentFiles.length < 8) {
  throw new Error(`Expected shell and UI components; found ${componentFiles.length}.`);
}

for (const filename of componentFiles) {
  const source = await readFile(filename, 'utf8');
  const result = compile(source, { filename: filename.pathname, generate: 'client' });

  for (const warning of result.warnings) {
    if (warning.code.startsWith('a11y_')) {
      throw new Error(`${warning.code}: ${warning.message}`);
    }

    process.stderr.write(`${warning.code}: ${warning.message}\n`);
  }
}

const build = spawnSync('pnpm', ['exec', 'vite', 'build'], { stdio: 'inherit' });

if (build.error) {
  throw build.error;
}

if (build.status !== 0) {
  process.exit(build.status ?? 1);
}

process.stdout.write(`Compiled ${componentFiles.length} Svelte components and built the demo.\n`);
