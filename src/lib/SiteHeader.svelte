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
  class="border-border/80 bg-background/90 supports-[backdrop-filter]:bg-background/80 sticky top-3 z-40 mt-3 flex items-center justify-between rounded-full border px-4 py-2.5 shadow-lg shadow-black/10 backdrop-blur-xl transition-colors sm:px-5 dark:shadow-black/35"
>
  <a
    class="text-foreground focus-visible:outline-ring rounded-sm font-semibold tracking-tight focus-visible:outline-2 focus-visible:outline-offset-4"
    href={homeHref}
    aria-label={`${brand} home`}
  >
    <span class="flex items-center gap-2">
      {#if logoSrc}
        <img src={logoSrc} alt={logoAlt} width="22" height="22" class="size-[22px] dark:invert" />
      {/if}
      {brand}
    </span>
  </a>
  <nav class="flex items-center gap-1" aria-label="Site navigation">
    {#each links as link (link.href)}
      <a
        class="text-muted-foreground surface-transition hover:bg-muted hover:text-foreground focus-visible:outline-ring inline-flex size-11 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-95"
        href={link.href}
        target={link.external ? '_blank' : undefined}
        rel={link.external ? 'noopener noreferrer' : undefined}
        aria-label={link.ariaLabel ??
          (link.external ? `${link.label} (opens in a new tab)` : link.label)}
        title={link.title ?? link.label}
      >
        {#if link.icon}
          {@const Icon = link.icon}
          <Icon size={20} aria-hidden="true" />
        {:else}
          <span class="px-2 text-xs font-medium">{link.label}</span>
        {/if}
      </a>
    {/each}
    <Tooltip.Provider delayDuration={300}>
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
        <a
          class="text-muted-foreground surface-transition hover:bg-muted hover:text-foreground focus-visible:outline-ring inline-flex size-11 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-95"
          href={githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${brand} on GitHub (opens in a new tab)`}
          title="View source on GitHub"
        >
          <SiGithub size={20} aria-hidden="true" />
        </a>
      {/if}
    </Tooltip.Provider>
  </nav>
</header>
