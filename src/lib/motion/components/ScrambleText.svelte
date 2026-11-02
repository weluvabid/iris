<script lang="ts">
  import { onDestroy } from 'svelte';
  import { prefersReducedMotion } from '../utils/motion-preference.js';

  let {
    text,
    trigger = 'hover',
    duration = 420,
    class: className,
  }: {
    text: string;
    trigger?: 'hover' | 'focus' | 'both';
    duration?: number;
    class?: string;
  } = $props();

  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let display = $state(text);
  let timer: ReturnType<typeof setInterval> | undefined;
  let startedAt = 0;

  // The source text is a prop and may change while this component is mounted.
  $effect(() => {
    const currentText = text;
    if (timer) clearInterval(timer);
    timer = undefined;
    display = currentText;
  });

  function stop() {
    if (timer) clearInterval(timer);
    timer = undefined;
    display = text;
  }

  function scramble() {
    stop();
    if (prefersReducedMotion() || typeof window === 'undefined') return;

    const source = text;
    const totalDuration = Math.max(120, duration);
    startedAt = performance.now();

    timer = setInterval(() => {
      const progress = Math.min(1, (performance.now() - startedAt) / totalDuration);
      const resolved = Math.floor(progress * source.length);

      display = [...source]
        .map((character, index) => {
          if (index < resolved || character === ' ') return character;
          return alphabet[Math.floor(Math.random() * alphabet.length)];
        })
        .join('');

      if (progress >= 1) stop();
    }, 32);
  }

  onDestroy(() => {
    if (timer) clearInterval(timer);
  });
</script>

<button
  type="button"
  class="appearance-none border-0 bg-transparent p-0 [font:inherit] text-start text-inherit [cursor:inherit] {className ??
    ''}"
  aria-label={text}
  onpointerenter={trigger === 'hover' || trigger === 'both'
    ? (event: PointerEvent) => event.pointerType === 'mouse' && scramble()
    : undefined}
  onpointerleave={trigger === 'hover' || trigger === 'both' ? stop : undefined}
  onfocus={trigger === 'focus' || trigger === 'both' ? scramble : undefined}
  onblur={trigger === 'focus' || trigger === 'both' ? stop : undefined}
>
  {display}
</button>
