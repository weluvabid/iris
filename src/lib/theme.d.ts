export type IrisTheme = 'light' | 'dark';

export type ThemeStorage = {
  getItem?(key: string): string | null;
  setItem?(key: string, value: string): void;
};

export type ThemeOptions = {
  storageKey?: string;
  persist?: boolean;
  storage?: ThemeStorage;
  root?: HTMLElement;
  metaThemeColor?: boolean;
  media?: { matches: boolean };
};

export declare function isTheme(value: unknown): value is IrisTheme;
export declare function resolveInitialTheme(storedTheme: unknown, prefersDark: boolean): IrisTheme;
export declare function toggleThemeValue(currentTheme: IrisTheme): IrisTheme;
export declare function getInitialTheme(
  options?: Pick<ThemeOptions, 'storageKey' | 'storage' | 'media'>,
): IrisTheme;
export declare function applyTheme(theme: IrisTheme, options?: ThemeOptions): IrisTheme;
export declare function toggleTheme(currentTheme: IrisTheme, options?: ThemeOptions): IrisTheme;
export declare function createThemeScript(storageKey?: string): string;
