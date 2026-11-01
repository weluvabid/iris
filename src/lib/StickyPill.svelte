<script lang="ts">
  import { onMount } from 'svelte';

  type Props = {
    label?: string;
    showIndicator?: boolean;
    compactOnScroll?: boolean;
    class?: string;
  };

  let {
    label,
    showIndicator = true,
    compactOnScroll = false,
    class: className = '',
  }: Props = $props();

  let sentinel: HTMLSpanElement;
  let pinned = $state(false);

  onMount(() => {
    if (!compactOnScroll || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry) pinned = !entry.isIntersecting;
      },
      { rootMargin: '-84px 0px 0px 0px', threshold: 0 },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  });
</script>

{#if compactOnScroll}<span
    class="iris-sticky-pill__sentinel"
    bind:this={sentinel}
    aria-hidden="true"
  ></span>{/if}
<div class="iris-sticky-pill {className}" data-pinned={pinned ? 'true' : 'false'}>
  <div class="iris-sticky-pill__content">
    {#if showIndicator}<span class="iris-sticky-pill__dot" aria-hidden="true"></span>{/if}
    {#if label}<span>{label}</span>{:else}<slot />{/if}
  </div>
</div>
