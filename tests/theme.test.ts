import { describe, expect, it } from 'vitest';
import { readFile } from 'node:fs/promises';

const theme = () => readFile(new URL('../src/theme.css', import.meta.url), 'utf8');

describe('Iris theme contract', () => {
  it('defines light and dark semantic tokens', async () => {
    const css = await theme();

    expect(css).toContain('--background: #fafaf8');
    expect(css).toContain('--primary: #d96c16');
    expect(css).toContain('--background: #090906');
    expect(css).toContain('--primary: #fc8b24');
    expect(css).toContain("'Atkinson Hyperlegible'");
  });

  it('keeps external font imports before Tailwind and out of the package theme', async () => {
    const css = await theme();
    const playground = await readFile(
      new URL('../playground/src/app.css', import.meta.url),
      'utf8',
    );

    expect(css).not.toContain('@import');
    expect(
      playground
        .trimStart()
        .startsWith(
          "@import url('https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:wght@400;700&display=swap');",
        ),
    ).toBe(true);
  });

  it('keeps the status animation accessible to reduced-motion users', async () => {
    const css = await theme();

    expect(css).toContain('@media (prefers-reduced-motion: reduce)');
    expect(css).toContain('.status-dot');
    expect(css).toContain('animation: none');
  });

  it('keeps the header opaque and confines the gradient to its perimeter', async () => {
    const css = await theme();
    const header = await readFile(new URL('../src/lib/SiteHeader.svelte', import.meta.url), 'utf8');

    expect(css).toContain('.iris-header::before');
    expect(css).toContain('.iris-header::after');
    expect(css).toContain('mask-composite: exclude');
    expect(css).toContain('background-color: var(--background)');
    expect(css).toContain('--iris-header-glow-opacity: 0.11');
    expect(css).toContain('--iris-header-glow-opacity: 0.2');
    expect(header).toContain('class="iris-header sticky');
    expect(header).not.toContain('bg-background/90');
    expect(header).toContain('class="iris-brand"');
  });
});
