/**
 * Returns whether the current environment requests reduced motion.
 * Safe to call during SSR; server-side defaults to true (no motion).
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return true;
  }

  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Subscribe to changes in the user's motion preference. */
export function onMotionPreferenceChange(callback: (reduce: boolean) => void): () => void {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    callback(true);

    return () => {};
  }

  const query = window.matchMedia('(prefers-reduced-motion: reduce)');
  const handler = (event: MediaQueryListEvent) => callback(event.matches);

  callback(query.matches);
  query.addEventListener('change', handler);

  return () => query.removeEventListener('change', handler);
}
