import { access, readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';

const root = new URL('../', import.meta.url);
const manifest = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));

const requiredFiles = [
  'dist/index.js',
  'dist/index.d.ts',
  'dist/icons/lucide.js',
  'dist/icons/lucide.d.ts',
  'dist/icons/simple-icons.js',
  'dist/icons/simple-icons.d.ts',
  'dist/data-table.js',
  'dist/data-table.d.ts',
  'dist/hooks.js',
  'dist/hooks.d.ts',
  'dist/components/data-table/components/data-table-filter.svelte',
  'dist/components/data-table/components/index.js',
  'dist/hooks/use-data-table-filters.svelte.js',
  'dist/components/ui/debounced-input/index.js',
  'dist/SiteHeader.svelte',
  'dist/SiteFooter.svelte',
  'src/styles/theme.css',
  'src/styles/fonts/atkinson-hyperlegible-regular.otf',
  'src/styles/fonts/atkinson-hyperlegible-bold.otf',
  'src/styles/fonts/LICENSE.txt',
  'src/theme.js',
  'src/theme.d.ts',
];

for (const file of requiredFiles) {
  await access(new URL(file, root));
}

for (const exportPath of [
  '.',
  './components',
  './lucide',
  './simple-icons',
  './data-table',
  './hooks',
  './components/ui/*',
  './theme',
  './theme.css',
  './package.json',
]) {
  if (!manifest.exports[exportPath]) {
    throw new Error(`Missing package export: ${exportPath}`);
  }
}

const packed = spawnSync('npm', ['pack', '--dry-run', '--json', '--ignore-scripts'], {
  cwd: root,
  encoding: 'utf8',
});

if (packed.error) {
  throw packed.error;
}

if (packed.status !== 0) {
  throw new Error(packed.stderr || 'npm pack --dry-run failed.');
}

const [result] = JSON.parse(packed.stdout);
const files = new Set(result.files.map(({ path }) => path));

for (const file of requiredFiles) {
  if (!files.has(file)) {
    throw new Error(`Required package file is missing from npm pack: ${file}`);
  }
}

const forbidden = [...files].filter(
  (file) =>
    file.startsWith('demo/') ||
    file.startsWith('tests/') ||
    file.startsWith('scripts/') ||
    file.startsWith('src/lib/'),
);

if (forbidden.length > 0) {
  throw new Error(`Repository-only files leaked into the package: ${forbidden.join(', ')}`);
}

process.stdout.write(`Verified ${files.size} files in the npm package.\n`);
