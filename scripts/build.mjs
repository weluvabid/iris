import { readdir, readFile } from 'node:fs/promises';
import { compile } from 'svelte/compiler';

const componentDirectory = new URL('../src/lib/', import.meta.url);
const files = await readdir(componentDirectory);
const components = files.filter((file) => file.endsWith('.svelte'));

if (components.length !== 3) {
  throw new Error(`Expected 3 Svelte components; found ${components.length}`);
}

for (const file of components) {
  const filename = new URL(file, componentDirectory);
  const source = await readFile(filename, 'utf8');
  const result = compile(source, { filename: filename.pathname, generate: 'client' });

  for (const warning of result.warnings) {
    console.warn(`${warning.code}: ${warning.message}`);
  }
}

console.log(`Validated ${components.length} Svelte components.`);
