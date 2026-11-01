import { readdir, readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { compile } from 'svelte/compiler';

const componentDirectory = new URL('../src/lib/', import.meta.url);
const components = [];

async function collect(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = new URL(`${entry.name}${entry.isDirectory() ? '/' : ''}`, directory);
    if (entry.isDirectory()) await collect(path);
    else if (entry.name.endsWith('.svelte')) components.push(path);
  }
}

await collect(componentDirectory);
if (components.length < 8)
  throw new Error(`Expected shell and shadcn components; found ${components.length}`);

for (const filename of components) {
  const source = await readFile(filename, 'utf8');
  const result = compile(source, { filename: filename.pathname, generate: 'client' });
  for (const warning of result.warnings) {
    if (warning.code === 'a11y_no_static_element_interactions') {
      throw new Error(`${warning.code}: ${warning.message}`);
    }
    console.warn(`${warning.code}: ${warning.message}`);
  }
}

const build = spawnSync('pnpm', ['exec', 'vite', 'build'], { stdio: 'inherit' });
if (build.status !== 0) process.exit(build.status ?? 1);
console.log(
  `Validated and compiled ${components.length} Svelte components; playground build passed.`,
);
