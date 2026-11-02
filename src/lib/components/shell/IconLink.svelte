<script lang="ts">
  import { onMount, type Component } from 'svelte';
  import { mergeProps } from 'bits-ui';
  import * as Tooltip from '$lib/components/ui/tooltip/index.js';

  type Props = {
    icon: Component;
    href: string;
    label: string;
    tooltip?: string;
    title?: string;
    external?: boolean;
    size?: number;
    class?: string;
  };

  let {
    icon: Icon,
    href,
    label,
    tooltip = label,
    title,
    external = false,
    size = 20,
    class: className = '',
  }: Props = $props();

  let open = $state(false);
  // Prevent a stationary pointer from reopening a tooltip after window/tab blur.
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
        <a
          {...mergeProps(
            {
              class: `text-muted-foreground transition-colors duration-150 motion-reduce:transition-none hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring inline-flex size-11 shrink-0 items-center justify-center rounded-full active:scale-95 ${className}`,
              href,
              'aria-label': label,
              target: external ? '_blank' : undefined,
              rel: external ? 'noopener noreferrer' : undefined,
              onpointerenter: handlePointerEnter,
              onpointerleave: handlePointerLeave,
            },
            props,
          )}
        >
          <Icon {size} aria-hidden="true" />
        </a>
      {/snippet}
    </Tooltip.Trigger>
    <Tooltip.Content>{title ?? tooltip}</Tooltip.Content>
  </Tooltip.Root>
</Tooltip.Provider>
