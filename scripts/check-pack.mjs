import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const directory = await mkdtemp(join(tmpdir(), 'iris-pack-'));

try {
  const pack = spawnSync('npm', ['pack', '--pack-destination', directory], {
    encoding: 'utf8',
    stdio: 'pipe',
  });

  if (pack.status !== 0) throw new Error(pack.stderr || pack.stdout);

  const output = pack.stdout.match(/[^\s]+\.tgz/);
  if (!output) throw new Error(`Could not locate packed archive. ${pack.stdout}`);

  const listing = spawnSync('tar', ['-tzf', join(directory, output[0])], {
    encoding: 'utf8',
  });
  if (listing.status !== 0) throw new Error(listing.stderr);

  const files = new Set(listing.stdout.trim().split('\n'));
  const required = [
    'package/package.json',
    'package/iris.css',
    'package/src/lib/SiteHeader.svelte',
    'package/src/lib/SiteFooter.svelte',
    'package/src/lib/StickyPill.svelte',
    'package/src/theme.js',
    'package/src/theme.d.ts',
    'package/src/lib/index.d.ts',
    'package/README.md',
    'package/LICENSE',
  ];

  const missing = required.filter((file) => !files.has(file));
  if (missing.length > 0) throw new Error(`Package is missing: ${missing.join(', ')}`);

  const manifest = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
  if (manifest.exports['.'] !== './iris.css')
    throw new Error('The root CSS export must remain stable.');

  console.log(`Package contents verified (${files.size} files).`);
} finally {
  await rm(directory, { recursive: true, force: true });
}
