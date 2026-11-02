<script lang="ts">
  import type { Component } from 'svelte';

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
</script>

<a
  class={`text-muted-foreground transition-colors duration-150 motion-reduce:transition-none hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring inline-flex size-11 shrink-0 items-center justify-center rounded-full active:scale-95 ${className}`}
  {href}
  title={title ?? tooltip}
  aria-label={label}
  aria-description={tooltip !== label ? tooltip : undefined}
  target={external ? '_blank' : undefined}
  rel={external ? 'noopener noreferrer' : undefined}
>
  <Icon {size} aria-hidden="true" />
</a>
