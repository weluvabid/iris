<script lang="ts">
  import { Moon, Sun } from '@lucide/svelte';
  import * as Tooltip from '../ui/tooltip/index.js';

  type Props = {
    darkMode: boolean;
    onToggle: () => void;
  };

  let { darkMode, onToggle }: Props = $props();
  let label = $derived(darkMode ? 'Switch to light mode' : 'Switch to dark mode');
</script>

<Tooltip.Root>
  <Tooltip.Trigger
    class="text-muted-foreground transition-colors duration-150 motion-reduce:transition-none hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring inline-flex size-11 shrink-0 items-center justify-center rounded-full active:scale-95"
    onclick={onToggle}
    aria-label={label}
  >
    {#if darkMode}
      <Sun size={20} aria-hidden="true" />
    {:else}
      <Moon size={20} aria-hidden="true" />
    {/if}
  </Tooltip.Trigger>
  <Tooltip.Content>{label}</Tooltip.Content>
</Tooltip.Root>
