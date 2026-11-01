import { access, readFile } from 'node:fs/promises';

const manifest = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
const required = [
  'src/lib/index.js',
  'src/lib/index.d.ts',
  'src/lib/SiteHeader.svelte',
  'src/lib/SiteFooter.svelte',
  'src/lib/StickyPill.svelte',
  'src/lib/components/ui/badge/badge.svelte',
  'src/lib/components/ui/tooltip/tooltip-content.svelte',
];

for (const file of required) await access(new URL(`../${file}`, import.meta.url));
if (manifest.files.includes('iris.css'))
  throw new Error('The removed iris.css must not be published.');
if (!manifest.exports['.'] || !manifest.exports['./components']) {
  throw new Error('The component entry points are missing.');
}
console.log(`Package manifest and ${required.length} required files verified.`);
