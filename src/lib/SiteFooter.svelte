<script lang="ts">
  import type { Snippet } from 'svelte';

  type Props = {
    children: Snippet;
  };

  let { children }: Props = $props();
</script>

<footer
  class="border-border/80 text-muted-foreground flex flex-wrap items-center justify-between gap-4 border-t py-6 text-sm"
>
  {@render children()}
</footer>
