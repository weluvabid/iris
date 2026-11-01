import { describe, expect, it } from 'vitest';
import { readFile, readdir } from 'node:fs/promises';

const readSource = (path: string) => readFile(new URL(path, import.meta.url), 'utf8');

describe('Iris shell contract', () => {
  it('preserves the sticky Pulse header geometry', async () => {
    const header = await readSource('../src/lib/SiteHeader.svelte');
    const theme = await readSource('../src/styles/theme.css');

    expect(header).toMatch(/class="iris-header[^"]*\bsticky\b[^"]*\btop-3\b/);
    expect(header).toMatch(/\brounded-full\b/);
    expect(header).toMatch(/\bpx-4\b/);
    expect(header).toMatch(/\bpy-2\.5\b/);
    expect(theme).toContain('position: sticky');
    expect(theme).toContain('top: 0.75rem');
  });

  it('keeps the gradient on the perimeter, not the header surface or wordmark', async () => {
    const theme = await readSource('../src/styles/theme.css');
    const brand = await readSource('../src/lib/components/shell/BrandLink.svelte');

    expect(theme).toContain('.iris-header::before');
    expect(theme).toContain('.iris-header::after');
    expect(theme).toContain('mask-composite: exclude');
    expect(theme).toContain('background-color: var(--background)');
    expect(brand).toContain('text-foreground');
    expect(brand).not.toContain('iris-brand');
  });

  it('uses accessible tooltips and neutral hover surfaces for icon actions', async () => {
    const header = await readSource('../src/lib/components/shell/HeaderNavigation.svelte');
    const iconLink = await readSource('../src/lib/components/shell/IconLink.svelte');
    const footer = await readSource('../src/lib/SiteFooter.svelte');

    expect(header).toContain('delayDuration={300}');
    expect(footer).toContain('delayDuration={300}');
    expect(iconLink).toContain('hover:bg-muted');
    expect(iconLink).toContain('focus-visible:outline-2');
    expect(iconLink).toContain('size-11');
  });

  it('keeps the footer layout and accessible resource navigation', async () => {
    const footer = await readSource('../src/lib/SiteFooter.svelte');

    expect(footer).toContain('flex flex-wrap items-center justify-between gap-4');
    expect(footer).toContain('border-t py-6 text-sm');
    expect(footer).toContain('aria-label="Project resources"');
  });

  it('isolates sticky-pill observer lifecycle outside the Svelte component', async () => {
    const pill = await readSource('../src/lib/StickyPill.svelte');
    const observer = await readSource('../src/lib/sticky-pill.ts');

    expect(pill).toContain('observeStickySentinel');
    expect(pill).not.toContain('new IntersectionObserver');
    expect(observer).toContain("rootMargin: '-84px 0px 0px 0px'");
    expect(observer).toContain('observer.disconnect()');
  });

  it('keeps HTML and CSS out of the repository root', async () => {
    const rootFiles = await readdir(new URL('../', import.meta.url));

    expect(rootFiles.some((file) => /\.(html|css)$/i.test(file))).toBe(false);
  });

  it('keeps the demo content outside the published component source', async () => {
    const app = await readSource('../demo/src/App.svelte');
    const article = await readSource('../demo/src/components/ArticlePreview.svelte');

    expect(app).toContain('<ArticlePreview />');
    expect(article).toContain('articleSections');
  });
});
