import { prefersReducedMotion } from '../utils/motion-preference.js';
import { type TransitionConfig, fade as svelteFade } from 'svelte/transition';

export type IrisFadeOptions = {
  duration?: number;
  delay?: number;
};

/** A restrained opacity transition. Reduced motion is handled by CSS globally. */
export function fade(node: Element, options: IrisFadeOptions = {}): TransitionConfig {
  return svelteFade(node, {
    duration: prefersReducedMotion() ? 0 : (options.duration ?? 160),
    delay: options.delay ?? 0,
  });
}
