import { readdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { compile, preprocess } from 'svelte/compiler';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const componentDirectory = new URL('../src/lib/', import.meta.url);
const componentFiles = [];

const preprocessor = vitePreprocess({
  script: true,
});

async function collectSvelteFiles(directory) {
  const entries = await readdir(directory, {
    withFileTypes: true,
  });

  for (const entry of entries) {
    const path = new URL(`${entry.name}${entry.isDirectory() ? '/' : ''}`, directory);

    if (entry.isDirectory()) {
      await collectSvelteFiles(path);
    } else if (entry.isFile() && entry.name.endsWith('.svelte')) {
      componentFiles.push(path);
    }
  }
}

await collectSvelteFiles(componentDirectory);

componentFiles.sort((a, b) => a.pathname.localeCompare(b.pathname));

if (componentFiles.length === 0) {
  throw new Error('No Svelte components found in src/lib.');
}

for (const filename of componentFiles) {
  const filenamePath = fileURLToPath(filename);
  const source = await readFile(filename, 'utf8');

  const processed = await preprocess(source, preprocessor, {
    filename: filenamePath,
  });

  const result = compile(processed.code, {
    filename: filenamePath,
    generate: 'client',
  });

  for (const warning of result.warnings) {
    if (warning.code.startsWith('a11y_')) {
      throw new Error(`${filenamePath}: ${warning.code}: ${warning.message}`);
    }

    process.stderr.write(`${filenamePath}: ${warning.code}: ${warning.message}\n`);
  }
}

process.stdout.write(
  `Successfully validated ${componentFiles.length} Svelte components in src/lib.\n`,
);
