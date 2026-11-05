<script lang="ts">
  import type { Snippet } from 'svelte';

  type Props = {
    children: Snippet;
  };

  let { children }: Props = $props();
</script>

<header
  class="sticky top-3 z-50 isolate mt-3 flex min-w-0 items-center justify-between gap-2 rounded-full border border-foreground/22 bg-background/72 px-4 py-2.5 shadow-lg shadow-black/10 backdrop-blur-[10px] transition-none sm:gap-3 sm:px-5 dark:shadow-black/35"
>
  {@render children()}
</header>
