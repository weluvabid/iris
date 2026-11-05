<script lang="ts">
  import { BookOpenText } from '@lucide/svelte';
  import { SiGithub } from '@icons-pack/svelte-simple-icons';
  import SiteFooter from '$lib/SiteFooter.svelte';
  import SiteHeader from '$lib/SiteHeader.svelte';
  import type { SiteFooterLink } from '$lib/types.js';
  import BrandLink from '$lib/components/shell/BrandLink.svelte';
  import HeaderNavigation from '$lib/components/shell/HeaderNavigation.svelte';
  import IconLink from '$lib/components/shell/IconLink.svelte';
  import ArticlePreview from './components/ArticlePreview.svelte';
  import { createDemoThemeState, createThemeToggleHandler } from './lib/theme-controller.js';

  const themeState = $state(createDemoThemeState());
  const onToggleTheme = createThemeToggleHandler(themeState);

  const footerLinks: SiteFooterLink[] = [
    {
      label: 'Source code',
      href: 'https://github.com/weluvabid/iris',
      external: true,
      icon: SiGithub,
    },
    {
      label: 'Documentation',
      href: 'https://github.com/weluvabid/iris#readme',
      external: true,
      icon: BookOpenText,
    },
  ];
</script>

<div
  class="[&>*:nth-child(-n+3)]:animate-iris-page-appear [&>*:nth-child(2)]:[animation-delay:100ms] [&>*:nth-child(3)]:[animation-delay:180ms] motion-reduce:[&>*:nth-child(-n+3)]:animate-none mx-auto flex min-h-[100svh] w-full max-w-6xl flex-col px-4 sm:px-6"
>
  <SiteHeader>
    <BrandLink brand="iris" href={import.meta.env.BASE_URL} />
    <HeaderNavigation
      links={[]}
      githubUrl="https://github.com/weluvabid/iris"
      darkMode={themeState.theme === 'dark'}
      {onToggleTheme}
    />
  </SiteHeader>

  <main class="min-h-0 flex-1 py-8 sm:py-10">
    <ArticlePreview />
  </main>

  <SiteFooter>
    <BrandLink brand="iris" href={import.meta.env.BASE_URL} compact />
    <nav
      class="flex max-w-full flex-wrap items-center justify-end gap-1"
      aria-label="Project resources"
    >
      {#each footerLinks as link (link.href)}
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
  </SiteFooter>
</div>
