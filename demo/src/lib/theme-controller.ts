import {
  applyTheme,
  getInitialTheme,
  toggleThemeValue,
  type IrisTheme,
} from '../../../src/theme.js';

export type DemoThemeState = {
  theme: IrisTheme;
};

export function createDemoThemeState(): DemoThemeState {
  return { theme: getInitialTheme() };
}

export function createThemeToggleHandler(state: DemoThemeState): () => void {
  return () => {
    state.theme = toggleThemeValue(state.theme);
    applyTheme(state.theme);
  };
}
