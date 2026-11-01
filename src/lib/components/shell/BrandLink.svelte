<script lang="ts">
  type Props = {
    brand: string;
    href: string;
    logoSrc?: string;
    logoAlt?: string;
    compact?: boolean;
  };

  let { brand, href, logoSrc, logoAlt = '', compact = false }: Props = $props();
</script>

<a
  class="text-foreground inline-flex min-w-0 items-center gap-2 rounded-sm font-semibold tracking-tight focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
  {href}
  aria-label={`${brand} home`}
>
  {#if logoSrc}
    <img
      src={logoSrc}
      alt={logoAlt}
      width={compact ? 20 : 22}
      height={compact ? 20 : 22}
      class={compact ? 'size-5 dark:invert' : 'size-[22px] dark:invert'}
    />
  {/if}
  <span>{brand}</span>
</a>
