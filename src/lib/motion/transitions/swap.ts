import { type TransitionConfig, fade } from 'svelte/transition';

/** Cross-fade suitable for keyed content swaps. */
export function swap(node: Element, duration = 120): TransitionConfig {
  return fade(node, { duration });
}
