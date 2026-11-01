/** @typedef {'light' | 'dark'} IrisTheme */
/**
 * @typedef {object} ThemeOptions
 * @property {string} [storageKey]
 * @property {boolean} [persist]
 * @property {{ getItem?: (key: string) => string | null, setItem?: (key: string, value: string) => void }} [storage]
 * @property {HTMLElement} [root]
 * @property {boolean} [metaThemeColor]
 * @property {{ matches: boolean }} [media]
 */

const DEFAULT_STORAGE_KEY = 'iris-theme';
const THEME_META_SELECTOR = 'meta[name="theme-color"]';

/** @param {unknown} value @returns {value is IrisTheme} */
export function isTheme(value) {
  return value === 'light' || value === 'dark';
}

/** @param {unknown} storedTheme @param {boolean} prefersDark @returns {IrisTheme} */
export function resolveInitialTheme(storedTheme, prefersDark) {
  return isTheme(storedTheme) ? storedTheme : prefersDark ? 'dark' : 'light';
}

/** @param {IrisTheme} currentTheme @returns {IrisTheme} */
export function toggleThemeValue(currentTheme) {
  return currentTheme === 'dark' ? 'light' : 'dark';
}

/** @param {Pick<ThemeOptions, 'storageKey' | 'storage' | 'media'>} [options] @returns {IrisTheme} */
export function getInitialTheme(options = {}) {
  const storageKey = options.storageKey ?? DEFAULT_STORAGE_KEY;
  let storedTheme = null;

  try {
    storedTheme = options.storage?.getItem
      ? options.storage.getItem(storageKey)
      : (globalThis.localStorage?.getItem(storageKey) ?? null);
  } catch {
    storedTheme = null;
  }

  const prefersDark =
    options.media?.matches ??
    (typeof globalThis.matchMedia === 'function' &&
      globalThis.matchMedia('(prefers-color-scheme: dark)').matches);

  return resolveInitialTheme(storedTheme, prefersDark);
}

/** @param {IrisTheme} theme @param {ThemeOptions} [options] @returns {IrisTheme} */
export function applyTheme(theme, options = {}) {
  if (!isTheme(theme)) {
    throw new TypeError(`Invalid Iris theme: ${String(theme)}`);
  }

  const root = options.root ?? globalThis.document?.documentElement;

  if (!root) {
    return theme;
  }

  root.classList.toggle('dark', theme === 'dark');
  root.style.colorScheme = theme;

  const background = globalThis.getComputedStyle?.(root).getPropertyValue('--background').trim();
  const meta = root.ownerDocument?.querySelector(THEME_META_SELECTOR);

  if (options.metaThemeColor !== false && meta && background) {
    meta.setAttribute('content', background);
  }

  if (options.persist !== false) {
    try {
      const storage = options.storage ?? globalThis.localStorage;

      storage?.setItem(options.storageKey ?? DEFAULT_STORAGE_KEY, theme);
    } catch {
      // Theme application must not depend on storage availability.
    }
  }

  return theme;
}

/** @param {IrisTheme} currentTheme @param {ThemeOptions} [options] @returns {IrisTheme} */
export function toggleTheme(currentTheme, options = {}) {
  return applyTheme(toggleThemeValue(currentTheme), options);
}

/** @param {string} [storageKey] @returns {string} */
export function createThemeScript(storageKey = DEFAULT_STORAGE_KEY) {
  if (typeof storageKey !== 'string' || storageKey.length === 0 || storageKey.length > 128) {
    throw new TypeError('Theme storage key must be a non-empty string of at most 128 characters.');
  }

  const key = JSON.stringify(storageKey).replaceAll('<', '\\u003c');

  return `(()=>{let t=null;try{t=localStorage.getItem(${key})}catch{}if(t!=='light'&&t!=='dark'){t=typeof matchMedia==='function'&&matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}const r=document.documentElement;r.classList.toggle('dark',t==='dark');r.style.colorScheme=t;})();`;
}
