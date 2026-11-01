<script lang="ts">
  import { Moon, Sun } from '@lucide/svelte';
  import type { Component } from 'svelte';
  import { SiGithub } from '@icons-pack/svelte-simple-icons';
  import * as Tooltip from './components/ui/tooltip/index.js';

  export type SiteHeaderLink = {
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
    logoAlt?: string;
    links?: SiteHeaderLink[];
    githubUrl?: string;
    darkMode: boolean;
    onToggleTheme: () => void;
  };

  let {
    brand,
    homeHref = '/',
    logoSrc,
    logoAlt = '',
    links = [],
    githubUrl,
    darkMode,
    onToggleTheme,
  }: Props = $props();
</script>

<header
  class="iris-header sticky top-3 z-40 mt-3 flex min-w-0 items-center justify-between gap-2 rounded-full px-4 py-2.5 shadow-lg shadow-black/10 transition-colors sm:gap-3 sm:px-5 dark:shadow-black/35"
>
  <a
    class="text-foreground focus-visible:outline-ring min-w-0 shrink truncate rounded-sm font-semibold tracking-tight focus-visible:outline-2 focus-visible:outline-offset-4"
    href={homeHref}
    aria-label={`${brand} home`}
  >
    <span class="flex items-center gap-2">
      {#if logoSrc}
        <img src={logoSrc} alt={logoAlt} width="22" height="22" class="size-[22px] dark:invert" />
      {/if}
      <span class="iris-brand">{brand}</span>
    </span>
  </a>
  <Tooltip.Provider delayDuration={300}>
    <nav
      class="flex min-w-0 max-w-[72%] shrink-0 items-center gap-0.5 overflow-x-auto overscroll-x-contain sm:gap-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      aria-label="Site navigation"
    >
      {#each links as link (link.href)}
        {#if link.icon}
          {@const Icon = link.icon}
          <Tooltip.Root>
            <Tooltip.Trigger>
              {#snippet child({ props })}
                <a
                  {...props}
                  class="text-muted-foreground surface-transition hover:bg-muted hover:text-foreground focus-visible:outline-ring inline-flex size-11 shrink-0 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-95"
                  href={link.href}
                  target={link.external ? '_blank' : undefined}
                  rel={link.external ? 'noopener noreferrer' : undefined}
                  aria-label={link.ariaLabel ??
                    (link.external ? `${link.label} (opens in a new tab)` : link.label)}
                >
                  <Icon size={20} aria-hidden="true" />
                </a>
              {/snippet}
            </Tooltip.Trigger>
            <Tooltip.Content>{link.title ?? link.label}</Tooltip.Content>
          </Tooltip.Root>
        {:else}
          <a
            class="text-muted-foreground surface-transition hover:bg-muted hover:text-foreground focus-visible:outline-ring inline-flex min-h-11 shrink-0 items-center justify-center rounded-full px-2 focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-95"
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
      <Tooltip.Root>
        <Tooltip.Trigger
          class="text-muted-foreground surface-transition hover:bg-muted hover:text-foreground focus-visible:outline-ring inline-flex size-11 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-95"
          onclick={onToggleTheme}
          aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {#if darkMode}<Sun size={20} aria-hidden="true" />{:else}<Moon
              size={20}
              aria-hidden="true"
            />{/if}
        </Tooltip.Trigger>
        <Tooltip.Content
          >{darkMode ? 'Switch to light mode' : 'Switch to dark mode'}</Tooltip.Content
        >
      </Tooltip.Root>
      {#if githubUrl}
        <Tooltip.Root>
          <Tooltip.Trigger>
            {#snippet child({ props })}
              <a
                {...props}
                class="text-muted-foreground surface-transition hover:bg-muted hover:text-foreground focus-visible:outline-ring inline-flex size-11 shrink-0 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-95"
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${brand} on GitHub (opens in a new tab)`}
              >
                <SiGithub size={20} aria-hidden="true" />
              </a>
            {/snippet}
          </Tooltip.Trigger>
          <Tooltip.Content>View source on GitHub</Tooltip.Content>
        </Tooltip.Root>
      {/if}
    </nav>
  </Tooltip.Provider>
</header>
