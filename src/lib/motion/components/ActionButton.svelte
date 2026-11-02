<script lang="ts">
  import { onDestroy } from 'svelte';
  import type { ButtonVariant, ButtonSize } from '../../components/ui/button/button.svelte';
  import { Button } from '../../components/ui/button/index.js';
  import { cn } from '../../utils.js';

  type ActionState = 'idle' | 'loading' | 'success' | 'error';

  let {
    idleLabel = 'Run action',
    loadingLabel = 'Working…',
    successLabel = 'Done',
    errorLabel = 'Try again',
    onaction,
    variant = 'outline',
    size = 'default',
    resetAfter = 1800,
    disabled = false,
    class: className,
  }: {
    idleLabel?: string;
    loadingLabel?: string;
    successLabel?: string;
    errorLabel?: string;
    onaction: () => void | Promise<void>;
    variant?: ButtonVariant;
    size?: ButtonSize;
    resetAfter?: number;
    disabled?: boolean;
    class?: string;
  } = $props();

  let state = $state<ActionState>('idle');
  let timer: ReturnType<typeof setTimeout> | undefined;
  let generation = 0;

  const labels: Record<ActionState, string> = {
    idle: idleLabel,
    loading: loadingLabel,
    success: successLabel,
    error: errorLabel,
  };

  async function run() {
    if (state === 'loading' || disabled) return;

    const currentGeneration = ++generation;
    if (timer) clearTimeout(timer);
    state = 'loading';

    try {
      await onaction();
      if (currentGeneration !== generation) return;
      state = 'success';
    } catch {
      if (currentGeneration !== generation) return;
      state = 'error';
    }

    if (resetAfter > 0) {
      timer = setTimeout(() => {
        if (currentGeneration === generation) state = 'idle';
      }, resetAfter);
    }
  }

  onDestroy(() => {
    generation += 1;
    if (timer) clearTimeout(timer);
  });
</script>

<Button
  {variant}
  {size}
  disabled={disabled || state === 'loading'}
  class={cn('min-h-11 min-w-11 active:scale-[0.98] motion-reduce:transform-none', className)}
  aria-live="polite"
  aria-busy={state === 'loading'}
  onclick={run}
>
  <span
    class="inline-flex items-center justify-center gap-2 transition-opacity duration-150 motion-reduce:transition-none"
    data-state={state}
  >
    {#if state === 'loading'}
      <span
        class="size-3.5 animate-spin rounded-full border-2 border-current border-r-transparent motion-reduce:animate-none"
        aria-hidden="true"
      ></span>
    {:else if state === 'success'}
      <span aria-hidden="true">✓</span>
    {:else if state === 'error'}
      <span aria-hidden="true">!</span>
    {/if}
    {labels[state]}
  </span>
</Button>
