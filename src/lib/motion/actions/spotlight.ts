import { hasFineHoverPointer } from '../utils/pointer-capability.js';
import { onMotionPreferenceChange, prefersReducedMotion } from '../utils/motion-preference.js';

export type SpotlightOptions = {
  /** CSS custom property prefix. Defaults to `--iris-spotlight`. */
  variable?: string;
};

/**
 * Adds pointer coordinates to an element for a CSS-driven, fine-pointer-only
 * spotlight. The action never captures pointers or schedules animation frames.
 */
export function spotlight(node: HTMLElement, options: SpotlightOptions = {}) {
  let variable = options.variable ?? '--iris-spotlight';
  let enabled = hasFineHoverPointer() && !prefersReducedMotion();

  const update = (event: PointerEvent) => {
    if (!enabled || event.pointerType !== 'mouse') {
      return;
    }

    const bounds = node.getBoundingClientRect();

    if (bounds.width === 0 || bounds.height === 0) {
      return;
    }

    const x = ((event.clientX - bounds.left) / bounds.width) * 100;
    const y = ((event.clientY - bounds.top) / bounds.height) * 100;

    node.style.setProperty(`${variable}-x`, `${Math.max(0, Math.min(100, x))}%`);
    node.style.setProperty(`${variable}-y`, `${Math.max(0, Math.min(100, y))}%`);
  };

  const reset = () => {
    node.style.removeProperty(`${variable}-x`);
    node.style.removeProperty(`${variable}-y`);
  };

  const disposeMotionPreference = onMotionPreferenceChange((reduce) => {
    enabled = hasFineHoverPointer() && !reduce;

    if (!enabled) {
      reset();
    }
  });

  node.addEventListener('pointermove', update, { passive: true });
  node.addEventListener('pointerleave', reset);

  return {
    update(next: SpotlightOptions = {}) {
      if (next.variable && next.variable !== variable) {
        reset();
        variable = next.variable;
      }

      enabled = hasFineHoverPointer() && !prefersReducedMotion();
    },
    destroy() {
      node.removeEventListener('pointermove', update);
      node.removeEventListener('pointerleave', reset);
      disposeMotionPreference();
      reset();
    },
  };
}
