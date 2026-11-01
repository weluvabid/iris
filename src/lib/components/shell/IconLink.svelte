<script lang="ts">
  import type { Component } from 'svelte';
  import * as Tooltip from '../ui/tooltip/index.js';

  type Props = {
    icon: Component;
    href: string;
    label: string;
    tooltip?: string;
    external?: boolean;
    size?: number;
    class?: string;
  };

  let {
    icon: Icon,
    href,
    label,
    tooltip = label,
    external = false,
    size = 20,
    class: className = '',
  }: Props = $props();
</script>

<Tooltip.Root>
  <Tooltip.Trigger>
    {#snippet child({ props })}
      <a
        {...props}
        class={`text-muted-foreground transition-colors duration-150 motion-reduce:transition-none hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring inline-flex size-11 shrink-0 items-center justify-center rounded-full active:scale-95 ${className}`}
        {href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        aria-label={label}
      >
        <Icon {size} aria-hidden="true" />
      </a>
    {/snippet}
  </Tooltip.Trigger>
  <Tooltip.Content>{tooltip}</Tooltip.Content>
</Tooltip.Root>
