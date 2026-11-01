<script lang="ts">
  import { BookOpenText, CircleQuestionMark } from '@lucide/svelte';
  import { SiGithub } from '@icons-pack/svelte-simple-icons';
  import { SiteFooter, SiteHeader, StickyPill } from '../../src/lib/index.js';
  import type { SiteFooterLink } from '../../src/lib/types.js';
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

<div class="iris-page-enter mx-auto flex min-h-[100svh] w-full max-w-6xl flex-col px-4 sm:px-6">
  <SiteHeader
    brand="iris"
    homeHref="/"
    githubUrl="https://github.com/weluvabid/iris"
    darkMode={themeState.theme === 'dark'}
    {onToggleTheme}
  />

  <main class="min-h-0 flex-1 py-8 sm:py-10">
    <StickyPill label="OPEN SOURCE TOOLKIT" />
    <ArticlePreview />
  </main>

  <SiteFooter brand="iris" homeHref="/" links={footerLinks} />
</div>
