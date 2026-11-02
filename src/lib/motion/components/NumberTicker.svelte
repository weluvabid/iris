<script lang="ts">
  import { onDestroy } from 'svelte';
  import { prefersReducedMotion } from '../utils/motion-preference.js';

  let {
    value,
    duration = 500,
    decimals = 0,
    locale,
    class: className,
  }: {
    value: number;
    duration?: number;
    decimals?: number;
    locale?: string;
    class?: string;
  } = $props();

  let displayed = $state(value);
  let frame = 0;
  let previous = value;

  const safeDecimals = $derived(Math.min(20, Math.max(0, Math.trunc(decimals) || 0)));
  const formatter = $derived(
    new Intl.NumberFormat(locale, {
      minimumFractionDigits: safeDecimals,
      maximumFractionDigits: safeDecimals,
    }),
  );

  $effect(() => {
    const target = value;

    if (!Number.isFinite(target)) {
      displayed = target;
      previous = target;

      return;
    }

    if (typeof window === 'undefined' || prefersReducedMotion() || duration <= 0) {
      displayed = target;
      previous = target;

      return;
    }

    if (frame) {
      cancelAnimationFrame(frame);
    }

    const startValue = Number.isFinite(previous) ? previous : target;
    const startTime = performance.now();
    const span = Math.max(0, duration);

    const tick = (now: number) => {
      const progress = Math.min(1, (now - startTime) / span);
      const eased = 1 - Math.pow(1 - progress, 3);

      displayed = startValue + (target - startValue) * eased;

      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        displayed = target;
        previous = target;
        frame = 0;
      }
    };

    frame = requestAnimationFrame(tick);

    return () => {
      if (frame) {
        cancelAnimationFrame(frame);
      }

      frame = 0;
    };
  });

  onDestroy(() => {
    if (frame) {
      cancelAnimationFrame(frame);
    }
  });
</script>

<span class={className} aria-label={formatter.format(value)}>{formatter.format(displayed)}</span>
