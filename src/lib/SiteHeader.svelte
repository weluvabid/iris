<script lang="ts">
  import BrandLink from './components/shell/BrandLink.svelte';
  import HeaderNavigation from './components/shell/HeaderNavigation.svelte';
  import type { SiteHeaderLink } from './types.js';

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
  class="iris-header sticky top-3 z-40 mt-3 flex min-w-0 items-center justify-between gap-2 rounded-full px-4 py-2.5 shadow-lg shadow-black/10 transition-colors motion-reduce:transition-none sm:gap-3 sm:px-5 dark:shadow-black/35"
>
  <BrandLink {brand} href={homeHref} {logoSrc} {logoAlt} />
  <HeaderNavigation {links} {githubUrl} {brand} {darkMode} {onToggleTheme} />
</header>
