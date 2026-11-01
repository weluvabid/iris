<script lang="ts">
  import BrandLink from './components/shell/BrandLink.svelte';
  import IconLink from './components/shell/IconLink.svelte';
  import * as Tooltip from './components/ui/tooltip/index.js';
  import type { SiteFooterLink } from './types.js';

  type Props = {
    brand: string;
    homeHref?: string;
    logoSrc?: string;
    links?: SiteFooterLink[];
  };

  let { brand, homeHref = '/', logoSrc, links = [] }: Props = $props();
</script>

<footer
  class="border-border/80 text-muted-foreground flex flex-wrap items-center justify-between gap-4 border-t py-6 text-sm"
>
  <BrandLink {brand} href={homeHref} {logoSrc} compact />
  <Tooltip.Provider delayDuration={300}>
    <nav
      class="flex max-w-full flex-wrap items-center justify-end gap-1"
      aria-label="Project resources"
    >
      {#each links as link (link.href)}
        {#if link.icon}
          <IconLink
            icon={link.icon}
            href={link.href}
            label={link.ariaLabel ??
              (link.external ? `${link.label} (opens in a new tab)` : link.label)}
            tooltip={link.title ?? link.label}
            external={link.external}
            size={19}
          />
        {:else}
          <a
            class="text-muted-foreground transition-colors duration-150 motion-reduce:transition-none hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring inline-flex min-h-11 items-center justify-center rounded-full px-2 active:scale-95"
            href={link.href}
            target={link.external ? '_blank' : undefined}
            rel={link.external ? 'noopener noreferrer' : undefined}
            aria-label={link.ariaLabel ??
              (link.external ? `${link.label} (opens in a new tab)` : link.label)}
          >
            <span class="text-xs font-medium">{link.label}</span>
          </a>
        {/if}
      {/each}
    </nav>
  </Tooltip.Provider>
</footer>
