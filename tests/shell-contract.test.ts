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

  it('uses monochrome borders and accessible custom tooltips for shell actions', async () => {
    const theme = await readSource('../src/styles/theme.css');
    const brand = await readSource('../src/lib/components/shell/BrandLink.svelte');
    const iconLink = await readSource('../src/lib/components/shell/IconLink.svelte');
    const themeToggle = await readSource('../src/lib/components/shell/ThemeToggle.svelte');

    expect(theme).toContain(
      'border: 1px solid color-mix(in srgb, var(--foreground) 22%, transparent)',
    );
    expect(theme).not.toContain('iris-gradient-');
    expect(brand).toContain('text-foreground');
    expect(iconLink).toContain('hover:bg-muted');
    expect(iconLink).toContain('Tooltip.Root');
    expect(iconLink).toContain('Tooltip.Content');
    expect(iconLink).not.toContain('title={title}');
    expect(themeToggle).toContain('Tooltip.Root');
    expect(themeToggle).toContain('Tooltip.Content');
    for (const source of [themeToggle, iconLink]) {
      expect(source).toContain('window.addEventListener(\'blur\', handleWindowBlur)');
      expect(source).toContain('document.addEventListener(\'visibilitychange\', handleVisibilityChange)');
      expect(source).toContain('pointerReentryRequired = pointerInside');
      expect(source).toContain('if (nextOpen && pointerReentryRequired) return;');
      expect(source).not.toContain('focusTooltipSuppressed');
      expect(source).not.toContain('onfocus: handleFocus');
    }
  });

  it('removes the decorative sticky pill and its observer', async () => {
    const app = await readSource('../demo/src/App.svelte');
    const index = await readSource('../src/lib/index.js');

    expect(app).not.toContain('StickyPill');
    expect(app).not.toContain('OPEN SOURCE TOOLKIT');
    expect(index).not.toContain('StickyPill');
  });

  it('keeps the footer layout and accessible resource navigation', async () => {
    const footer = await readSource('../src/lib/SiteFooter.svelte');

    expect(footer).toContain('flex flex-wrap items-center justify-between gap-4');
    expect(footer).toContain('border-t py-6 text-sm');
    expect(footer).toContain('aria-label="Project resources"');
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
