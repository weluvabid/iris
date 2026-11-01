export type StickyPillObserverOptions = {
  rootMargin?: string;
  threshold?: number;
};

const DEFAULT_OPTIONS: Readonly<StickyPillObserverOptions> = Object.freeze({
  rootMargin: '-84px 0px 0px 0px',
  threshold: 0,
});

export function observeStickySentinel(
  sentinel: Element,
  onPinnedChange: (pinned: boolean) => void,
  options: StickyPillObserverOptions = DEFAULT_OPTIONS,
): () => void {
  if (typeof IntersectionObserver === 'undefined') {
    return () => undefined;
  }

  const observer = new IntersectionObserver(([entry]) => {
    if (entry) {
      onPinnedChange(!entry.isIntersecting);
    }
  }, options);

  observer.observe(sentinel);
  return () => observer.disconnect();
}
