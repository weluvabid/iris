<script lang="ts">
  import type { Snippet } from 'svelte';

  type IrisNavLink = {
    label: string;
    href: string;
    external?: boolean;
    current?: boolean;
  };

  type Props = {
    brand: string;
    homeHref?: string;
    logoSrc?: string;
    logoAlt?: string;
    navLinks?: IrisNavLink[];
    githubUrl?: string;
    theme?: 'light' | 'dark';
    onToggleTheme?: () => void;
    actions?: Snippet;
    class?: string;
  };

  let {
    brand,
    homeHref = '/',
    logoSrc,
    logoAlt = '',
    navLinks = [],
    githubUrl,
    theme = 'light',
    onToggleTheme,
    actions,
    class: className = '',
  }: Props = $props();
</script>

<header class="iris-header {className}">
  <a class="iris-header__brand" href={homeHref} aria-label={`${brand} home`}>
    {#if logoSrc}
      <img src={logoSrc} alt={logoAlt} width="22" height="22" />
    {/if}
    <span>{brand}</span>
  </a>

  <div class="iris-header__actions">
    {#if navLinks.length > 0}
      <nav class="iris-header__nav" aria-label="Site navigation">
        {#each navLinks as link (link.href)}
          <a
            class="iris-header__link"
            href={link.href}
            aria-current={link.current ? 'page' : undefined}
            target={link.external ? '_blank' : undefined}
            rel={link.external ? 'noopener noreferrer' : undefined}
          >
            {link.label}
          </a>
        {/each}
      </nav>
    {/if}

    {#if onToggleTheme}
      <button
        class="iris-header__action"
        type="button"
        onclick={onToggleTheme}
        aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {#if theme === 'dark'}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="4" /><path
              d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"
            />
          </svg>
        {:else}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            aria-hidden="true"
          >
            <path d="M20.5 15.5A8.5 8.5 0 0 1 8.5 3.5 8.5 8.5 0 1 0 20.5 15.5Z" />
          </svg>
        {/if}
      </button>
    {/if}

    {#if githubUrl}
      <a
        class="iris-header__action"
        href={githubUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${brand} on GitHub (opens in a new tab)`}
        title="View source on GitHub"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path
            d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.55.1.76-.24.76-.54v-2.1c-3.1.67-3.76-1.32-3.76-1.32-.5-1.28-1.23-1.62-1.23-1.62-1.01-.69.08-.68.08-.68 1.12.08 1.71 1.15 1.71 1.15 1 .1.76 2.2 3.34 1.56.1-.72.39-1.21.7-1.49-2.48-.28-5.09-1.24-5.09-5.53 0-1.22.44-2.22 1.15-3-.12-.28-.5-1.42.11-2.96 0 0 .94-.3 3.05 1.15a10.6 10.6 0 0 1 5.55 0c2.12-1.45 3.05-1.15 3.05-1.15.61 1.54.23 2.68.12 2.96.71.78 1.14 1.78 1.14 3 0 4.3-2.61 5.25-5.1 5.52.4.35.75 1.03.75 2.08v3.08c0 .3.2.65.77.54A11.1 11.1 0 0 0 12 .9Z"
          />
        </svg>
      </a>
    {/if}

    {#if actions}
      {@render actions()}
    {/if}
  </div>
</header>
