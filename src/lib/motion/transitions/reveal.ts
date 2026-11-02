import { prefersReducedMotion } from '../utils/motion-preference.js';
import { type TransitionConfig, fly } from 'svelte/transition';

export type IrisRevealOptions = {
  duration?: number;
  delay?: number;
  y?: number;
};

/** Small, opacity-led reveal; intended for local UI changes, not whole-page choreography. */
export function reveal(node: Element, options: IrisRevealOptions = {}): TransitionConfig {
  return fly(node, {
    duration: prefersReducedMotion() ? 0 : (options.duration ?? 180),
    delay: options.delay ?? 0,
    y: options.y ?? 6,
    opacity: 0,
  });
}
