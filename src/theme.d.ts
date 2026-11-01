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
  lightColor?: string;
  darkColor?: string;
};

export declare function getInitialTheme(
  options?: Pick<ThemeOptions, 'storageKey' | 'storage'> & { media?: { matches: boolean } },
): IrisTheme;
export declare function applyTheme(theme: IrisTheme, options?: ThemeOptions): IrisTheme;
export declare function toggleTheme(currentTheme: IrisTheme, options?: ThemeOptions): IrisTheme;
export declare function createThemeScript(storageKey?: string): string;
