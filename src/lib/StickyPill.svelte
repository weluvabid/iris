<script lang="ts">
  import { onMount, type Snippet } from 'svelte';
  import * as Badge from './components/ui/badge/index.js';

  type Props = {
    label: string;
    compactOnScroll?: boolean;
    children?: Snippet;
  };

  let { label, compactOnScroll = true, children }: Props = $props();
  let badgeSentinel: HTMLDivElement;
  let badgePinned = $state(false);

  onMount(() => {
    if (!compactOnScroll || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry) badgePinned = !entry.isIntersecting;
      },
      { rootMargin: '-84px 0px 0px 0px', threshold: 0 },
    );

    observer.observe(badgeSentinel);
    return () => observer.disconnect();
  });
</script>

<div bind:this={badgeSentinel} class="h-px" aria-hidden="true"></div>
<div class="sticky top-[5.25rem] z-30 mx-auto mb-8 flex w-fit justify-center py-2">
  <Badge.Badge
    variant="outline"
    class={`border-border/80 bg-card/95 text-muted-foreground rounded-full font-medium tracking-[0.14em] shadow-sm backdrop-blur-xl transition-[padding,font-size] duration-200 ${badgePinned ? 'h-7 px-3 text-[10px] sm:text-[11px]' : 'h-auto px-4 py-2 text-[11px] sm:text-xs'}`}
  >
    <span class="status-indicator" aria-hidden="true">
      <span class="status-dot"></span>
    </span>
    {#if children}{@render children()}{:else}{label}{/if}
  </Badge.Badge>
</div>
