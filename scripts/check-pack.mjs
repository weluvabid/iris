import { access, readFile, readdir } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';

const packageRoot = new URL('../', import.meta.url);
const manifest = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
const requiredFiles = [
  'src/lib/index.js',
  'src/lib/index.d.ts',
  'src/lib/icons/lucide.js',
  'src/lib/icons/lucide.d.ts',
  'src/lib/icons/simple-icons.js',
  'src/lib/icons/simple-icons.d.ts',
  'src/lib/data-table.js',
  'src/lib/data-table.d.ts',
  'src/lib/components/data-table/components/data-table-filter.svelte',
  'src/lib/components/data-table/components/index.js',
  'src/lib/hooks/use-data-table-filters.svelte.ts',
  'src/lib/hooks.js',
  'src/lib/hooks.d.ts',
  'src/lib/components/ui/debounced-input/index.js',
  'src/lib/SiteHeader.svelte',
  'src/lib/SiteFooter.svelte',
  'src/lib/components/shell/BrandLink.svelte',
  'src/lib/components/shell/HeaderNavigation.svelte',
  'src/lib/components/shell/IconLink.svelte',
  'src/lib/components/shell/ThemeToggle.svelte',
  'src/lib/components/ui/badge/index.ts',
  'src/lib/components/ui/tooltip/index.ts',
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

const uiDirectory = new URL('../src/lib/components/ui/', import.meta.url);
const uiEntries = await readdir(uiDirectory, { withFileTypes: true });
const uiComponents = uiEntries.filter((entry) => entry.isDirectory());

for (const component of uiComponents) {
  await access(new URL(`../src/lib/components/ui/${component.name}/index.js`, import.meta.url));
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
