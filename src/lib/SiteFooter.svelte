<script lang="ts">
  import type { Component } from 'svelte';
  import * as Tooltip from './components/ui/tooltip/index.js';

  export type SiteFooterLink = {
    label: string;
    href: string;
    external?: boolean;
    title?: string;
    ariaLabel?: string;
    icon?: Component;
  };

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
  <a
    class="text-foreground inline-flex items-center gap-2 font-semibold"
    href={homeHref}
    aria-label={`${brand} home`}
  >
    {#if logoSrc}
      <img src={logoSrc} alt="" width="20" height="20" class="size-5 dark:invert" />
    {:else}
      <span class="iris-brand">{brand}</span>
    {/if}
  </a>
  <Tooltip.Provider delayDuration={300}>
    <nav
      class="flex max-w-full flex-wrap items-center justify-end gap-1"
      aria-label="Project resources"
    >
      {#each links as link (link.href)}
        {#if link.icon}
          {@const Icon = link.icon}
          <Tooltip.Root>
            <Tooltip.Trigger>
              {#snippet child({ props })}
                <a
                  {...props}
                  class="text-muted-foreground surface-transition hover:bg-muted hover:text-foreground focus-visible:outline-ring inline-flex size-11 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-95"
                  href={link.href}
                  target={link.external ? '_blank' : undefined}
                  rel={link.external ? 'noopener noreferrer' : undefined}
                  aria-label={link.ariaLabel ??
                    (link.external ? `${link.label} (opens in a new tab)` : link.label)}
                >
                  <Icon size={19} aria-hidden="true" />
                </a>
              {/snippet}
            </Tooltip.Trigger>
            <Tooltip.Content>{link.title ?? link.label}</Tooltip.Content>
          </Tooltip.Root>
        {:else}
          <a
            class="text-muted-foreground surface-transition hover:bg-muted hover:text-foreground focus-visible:outline-ring inline-flex min-h-11 items-center justify-center rounded-full px-2 focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-95"
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
