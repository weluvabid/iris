import { afterEach, describe, expect, it, vi } from 'vitest';
import { access, readFile } from 'node:fs/promises';
import {
  applyTheme,
  createThemeScript,
  getInitialTheme,
  resolveInitialTheme,
  toggleThemeValue,
} from '../src/theme.js';

const readTheme = () => readFile(new URL('../src/styles/theme.css', import.meta.url), 'utf8');

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('Iris theme contract', () => {
  it('defines light and dark semantic tokens', async () => {
    const css = await readTheme();

    expect(css).toContain('--background: #fafaf8');
    expect(css).toContain('--primary: #242424');
    expect(css).toContain('--background: #090906');
    expect(css).toContain('--primary: #e8e7e3');
    expect(css).toContain('@theme inline');
    //expect(css).toContain("@source '../lib'");
    expect(css).toContain("'Atkinson Hyperlegible'");
  });

  it('does not make external font requests from the package or demo', async () => {
    const css = await readTheme();
    const demoCss = await readFile(new URL('../demo/src/app.css', import.meta.url), 'utf8');

    expect(css).not.toContain('fonts.googleapis.com');
    expect(css).not.toContain('fonts.gstatic.com');
    expect(demoCss).not.toContain('fonts.googleapis.com');
    expect(css).toContain("url('./fonts/atkinson-hyperlegible-regular.otf')");
    await access(new URL('../src/styles/fonts/atkinson-hyperlegible-regular.otf', import.meta.url));
    await access(new URL('../src/styles/fonts/atkinson-hyperlegible-bold.otf', import.meta.url));
    await access(new URL('../src/styles/fonts/LICENSE.txt', import.meta.url));
  });

  it('keeps presentation styling in Tailwind and retains only design-system CSS', async () => {
    const css = await readTheme();

    expect(css).toContain('--animate-iris-page-appear:');
    expect(css).toContain('@keyframes iris-page-appear');
    expect(css).toContain('::selection');
    expect(css).toContain(
      '@apply bg-[var(--selection-background)] text-[var(--selection-foreground)]',
    );
    expect(css).not.toContain('.iris-header');
    expect(css).not.toContain('.iris-page-enter');
    expect(css).not.toContain('iris-gradient-');
    expect(css).not.toContain('iris-status-breathe');
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

describe('Iris theme runtime', () => {
  it('uses a valid stored preference before the system preference', () => {
    const storage = { getItem: vi.fn(() => 'light') };

    expect(getInitialTheme({ storage, media: { matches: true } })).toBe('light');
    expect(storage.getItem).toHaveBeenCalledWith('iris-theme');
  });

  it('falls back to the system preference when storage is unavailable or invalid', () => {
    const unavailableStorage = {
      getItem: () => {
        throw new Error('Storage is blocked');
      },
    };

    expect(getInitialTheme({ storage: unavailableStorage, media: { matches: true } })).toBe('dark');
    expect(
      getInitialTheme({ storage: { getItem: () => 'invalid' }, media: { matches: false } }),
    ).toBe('light');
  });

  it('applies the theme, updates the browser color and persists the preference', () => {
    const meta = { setAttribute: vi.fn() };
    const root = {
      classList: { toggle: vi.fn() },
      style: { colorScheme: '' },
      ownerDocument: { querySelector: vi.fn(() => meta) },
    } as unknown as HTMLElement;
    const storage = { setItem: vi.fn() };

    vi.stubGlobal(
      'getComputedStyle',
      vi.fn(() => ({ getPropertyValue: () => '#090906' })) as unknown as typeof getComputedStyle,
    );

    expect(applyTheme('dark', { root, storage })).toBe('dark');
    expect(root.classList.toggle).toHaveBeenCalledWith('dark', true);
    expect(root.style.colorScheme).toBe('dark');
    expect(storage.setItem).toHaveBeenCalledWith('iris-theme', 'dark');
    expect(meta.setAttribute).toHaveBeenCalledWith('content', '#090906');
  });

  it('keeps theme application working when persistence fails', () => {
    const root = {
      classList: { toggle: vi.fn() },
      style: { colorScheme: '' },
      ownerDocument: { querySelector: vi.fn(() => null) },
    } as unknown as HTMLElement;
    const storage = {
      setItem: () => {
        throw new Error('Storage is blocked');
      },
    };

    expect(() => applyTheme('light', { root, storage })).not.toThrow();
    expect(root.classList.toggle).toHaveBeenCalledWith('dark', false);
    expect(root.style.colorScheme).toBe('light');
  });

  it('rejects invalid themes before mutating browser state', () => {
    const root = {
      classList: { toggle: vi.fn() },
      style: { colorScheme: '' },
    } as unknown as HTMLElement;

    expect(() => applyTheme('system' as never, { root })).toThrow(TypeError);
    expect(root.classList.toggle).not.toHaveBeenCalled();
  });
});
