<script lang="ts">
  import { onMount } from 'svelte';
  import { mergeProps } from 'bits-ui';
  import { Moon, Sun } from '@lucide/svelte';
  import * as Tooltip from '$lib/components/ui/tooltip/index.js';

  type Props = {
    darkMode: boolean;
    onToggle: () => void;
  };

  let { darkMode, onToggle }: Props = $props();
  let label = $derived(darkMode ? 'Switch to light mode' : 'Switch to dark mode');
  let open = $state(false);
  let pointerReentryRequired = $state(false);
  let pointerInside = $state(false);

  function handleOpenChange(nextOpen: boolean) {
    if (nextOpen && pointerReentryRequired) return;
    open = nextOpen;
  }

  function handleWindowBlur() {
    pointerReentryRequired = pointerInside;
    open = false;
  }

  function handleVisibilityChange() {
    if (document.visibilityState !== 'visible') handleWindowBlur();
  }

  function handlePointerEnter() {
    pointerInside = true;
  }

  function handlePointerLeave() {
    pointerInside = false;
    pointerReentryRequired = false;
  }

  function handleFocus(event: FocusEvent) {
    const target = event.currentTarget;
    if (target instanceof HTMLElement && target.matches(':focus-visible')) {
      pointerReentryRequired = false;
    }
  }

  onMount(() => {
    window.addEventListener('blur', handleWindowBlur);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('blur', handleWindowBlur);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  });
</script>

<Tooltip.Provider delayDuration={300}>
  <Tooltip.Root bind:open onOpenChange={handleOpenChange}>
    <Tooltip.Trigger>
      {#snippet child({ props })}
        <button
          {...mergeProps(
            {
              type: 'button',
              class:
                'text-muted-foreground transition-colors duration-150 motion-reduce:transition-none hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring inline-flex size-11 shrink-0 items-center justify-center rounded-full active:scale-95',
              onclick: onToggle,
              'aria-label': label,
              onpointerenter: handlePointerEnter,
              onpointerleave: handlePointerLeave,
              onfocus: handleFocus,
            },
            props,
          )}
        >
          {#if darkMode}
            <Sun size={20} aria-hidden="true" />
          {:else}
            <Moon size={20} aria-hidden="true" />
          {/if}
        </button>
      {/snippet}
    </Tooltip.Trigger>
    <Tooltip.Content>{label}</Tooltip.Content>
  </Tooltip.Root>
</Tooltip.Provider>
