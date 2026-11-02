export { default as ActionButton } from './components/ActionButton.svelte';
export { default as NavIndicator } from './components/NavIndicator.svelte';
export type { NavIndicatorItem } from './components/NavIndicator.svelte';
export { default as ThemeToggler } from './components/ThemeToggler.svelte';
export { default as NumberTicker } from './components/NumberTicker.svelte';
export { default as ScrambleText } from './components/ScrambleText.svelte';

export { spotlight } from './actions/spotlight.js';
export type { SpotlightOptions } from './actions/spotlight.js';

export { fade } from './transitions/fade.js';
export type { IrisFadeOptions } from './transitions/fade.js';
export { reveal } from './transitions/reveal.js';
export type { IrisRevealOptions } from './transitions/reveal.js';
export { swap } from './transitions/swap.js';

export { prefersReducedMotion, onMotionPreferenceChange } from './utils/motion-preference.js';
export { hasFineHoverPointer } from './utils/pointer-capability.js';
