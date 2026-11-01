<script lang="ts">
  import { SiGithub as GithubIcon } from '@icons-pack/svelte-simple-icons';
  import type { SiteHeaderLink } from '$lib';
  import IconLink from './IconLink.svelte';
  import ThemeToggle from './ThemeToggle.svelte';
  import * as Tooltip from '../ui/tooltip/index.js';

  type Props = {
    links: SiteHeaderLink[];
    githubUrl?: string;
    brand: string;
    darkMode: boolean;
    onToggleTheme: () => void;
  };

  let { links, githubUrl, brand, darkMode, onToggleTheme }: Props = $props();
</script>

<Tooltip.Provider delayDuration={300}>
  <nav
    class="flex min-w-0 max-w-[72%] shrink-0 items-center gap-0.5 overflow-x-auto overscroll-x-contain sm:gap-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    aria-label="Site navigation"
  >
    {#each links as link (link.href)}
      {#if link.icon}
        <IconLink
          title=""
          icon={link.icon}
          href={link.href}
          label={link.ariaLabel ??
            (link.external ? `${link.label} (opens in a new tab)` : link.label)}
          tooltip={link.title ?? link.label}
          external={link.external}
          size={20}
        />
      {:else}
        <a
          class="text-muted-foreground transition-colors duration-150 motion-reduce:transition-none hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring inline-flex min-h-11 shrink-0 items-center justify-center rounded-full px-2 active:scale-95"
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
    <ThemeToggle {darkMode} onToggle={onToggleTheme} />
    {#if githubUrl}
      <IconLink title="" icon={GithubIcon} href={githubUrl} label="Source code" external />
    {/if}
  </nav>
</Tooltip.Provider>
