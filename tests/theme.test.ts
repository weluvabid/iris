import { describe, expect, it } from 'vitest';
import { access, readFile } from 'node:fs/promises';
import { createThemeScript, resolveInitialTheme, toggleThemeValue } from '../src/theme.js';

const readTheme = () => readFile(new URL('../src/styles/theme.css', import.meta.url), 'utf8');

describe('Iris theme contract', () => {
  it('defines light and dark semantic tokens', async () => {
    const css = await readTheme();

    expect(css).toContain('--background: #fafaf8');
    expect(css).toContain('--primary: #d96c16');
    expect(css).toContain('--background: #090906');
    expect(css).toContain('--primary: #fc8b24');
    expect(css).toContain('@theme inline');
    expect(css).toContain("@source '../lib'");
    expect(css).toContain("'Atkinson Hyperlegible'");
  });

  it('does not make external font requests from the package or demo', async () => {
    const css = await readTheme();
    const demoCss = await readFile(new URL('../demo/src/app.css', import.meta.url), 'utf8');

    expect(css).not.toContain('@import');
    expect(demoCss).not.toContain('fonts.googleapis.com');
    expect(css).toContain("url('./fonts/atkinson-hyperlegible-regular.otf')");
    await access(new URL('../src/styles/fonts/atkinson-hyperlegible-regular.otf', import.meta.url));
    await access(new URL('../src/styles/fonts/atkinson-hyperlegible-bold.otf', import.meta.url));
    await access(new URL('../src/styles/fonts/LICENSE.txt', import.meta.url));
  });

  it('keeps status animation accessible to reduced-motion users', async () => {
    const css = await readTheme();
    const pill = await readFile(new URL('../src/lib/StickyPill.svelte', import.meta.url), 'utf8');

    expect(css).toContain('@keyframes iris-status-breathe');
    expect(pill).toContain('motion-reduce:animate-none');
  });

  it('keeps the header opaque and confines the gradient to its perimeter', async () => {
    const css = await readTheme();

    expect(css).toContain('.iris-header::before');
    expect(css).toContain('.iris-header::after');
    expect(css).toContain('mask-composite: exclude');
    expect(css).toContain('background: hsl(var(--background) / 0.94)');
    expect(css).toContain('--iris-header-glow-opacity: 0.11');
    expect(css).toContain('--iris-header-glow-opacity: 0.2');
  });

  it('resolves explicit preferences before the system preference', () => {
    expect(resolveInitialTheme('dark', false)).toBe('dark');
    expect(resolveInitialTheme('invalid', true)).toBe('dark');
    expect(resolveInitialTheme(null, false)).toBe('light');
  });

  it('toggles theme values without browser side effects', () => {
    expect(toggleThemeValue('light')).toBe('dark');
    expect(toggleThemeValue('dark')).toBe('light');
  });

  it('escapes executable script terminators in custom storage keys', () => {
    const script = createThemeScript('</script><script>alert(1)</script>');

    expect(script).not.toContain('</script>');
    expect(() => createThemeScript('')).toThrow(TypeError);
  });
});
