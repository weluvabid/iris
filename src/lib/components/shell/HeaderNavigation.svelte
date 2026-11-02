<script lang="ts">
  import { SiGithub as GithubIcon } from '@icons-pack/svelte-simple-icons';
  import type { SiteHeaderLink } from '../../types.js';
  import IconLink from './IconLink.svelte';
  import ThemeToggle from './ThemeToggle.svelte';

  type Props = {
    links: SiteHeaderLink[];
    githubUrl?: string;
    darkMode: boolean;
    onToggleTheme: () => void;
  };

  let { links, githubUrl, darkMode, onToggleTheme }: Props = $props();
</script>

<nav class="flex shrink-0 items-center gap-3" aria-label="Site navigation">
  {#each links as link (link.href)}
    {#if link.icon}
      <IconLink
        icon={link.icon}
        href={link.href}
        label={link.ariaLabel ??
          (link.external ? `${link.label} (opens in a new tab)` : link.label)}
        tooltip={link.label}
        title={link.title}
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
    <IconLink icon={GithubIcon} href={githubUrl} label="Source code" external />
  {/if}
</nav>
