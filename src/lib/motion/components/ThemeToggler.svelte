<script lang="ts">
  import { Button } from '../../components/ui/button/index.js';
  import type { IrisTheme } from '../../theme.js';
  import { applyTheme, toggleThemeValue } from '../../theme.js';

  let {
    theme = 'light',
    onthemechange,
    label = 'Toggle color theme',
    class: className,
  }: {
    theme?: IrisTheme;
    onthemechange?: (theme: IrisTheme) => void;
    label?: string;
    class?: string;
  } = $props();

  let currentTheme = $derived(theme);

  function toggle() {
    const next = toggleThemeValue(currentTheme);

    currentTheme = next;
    applyTheme(next);
    onthemechange?.(next);
  }
</script>

<Button
  variant="ghost"
  size="icon"
  class={className ?? 'min-h-11 min-w-11'}
  type="button"
  aria-label={label}
  aria-pressed={currentTheme === 'dark'}
  onclick={toggle}
>
  {#if currentTheme === 'dark'}
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.7"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="size-4 transition-transform duration-200 motion-reduce:transition-none"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4"></circle>
      <path
        d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"
      ></path>
    </svg>
  {:else}
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.7"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="size-4 transition-transform duration-200 motion-reduce:transition-none"
      aria-hidden="true"
    >
      <path d="M20.9 13A9 9 0 0 1 11 3.1 9 9 0 1 0 20.9 13Z"></path>
    </svg>
  {/if}
</Button>
