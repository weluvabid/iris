<script lang="ts">
  import { BookOpenText, CircleQuestionMark } from '@lucide/svelte';
  import { SiGithub } from '@icons-pack/svelte-simple-icons';
  import { SiteFooter, SiteHeader, StickyPill } from '../../src/lib/index.js';

  let darkMode = $state(document.documentElement.classList.contains('dark'));

  function applyTheme(value: boolean): void {
    darkMode = value;
    document.documentElement.classList.toggle('dark', value);
    document.documentElement.style.colorScheme = value ? 'dark' : 'light';
    document.documentElement.style.backgroundColor = value ? '#0b0b0b' : '#ffffff';
    document
      .querySelector<HTMLMetaElement>('meta[name="theme-color"]')
      ?.setAttribute('content', value ? '#0b0b0b' : '#ffffff');

    try {
      localStorage.setItem('iris-theme', value ? 'dark' : 'light');
    } catch {
      // Storage can be unavailable in restricted browser contexts.
    }
  }

  function toggleTheme(): void {
    applyTheme(!darkMode);
  }

  const footerLinks = [
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
    {
      label: 'Issues',
      href: 'https://github.com/weluvabid/iris/issues',
      external: true,
      icon: CircleQuestionMark,
    },
  ];
</script>

<div class="mx-auto flex min-h-[100svh] w-full max-w-6xl flex-col px-4 sm:px-6">
  <SiteHeader
    brand="iris"
    homeHref="/"
    githubUrl="https://github.com/weluvabid/iris"
    {darkMode}
    onToggleTheme={toggleTheme}
  />

  <main class="flex min-h-0 flex-1 flex-col py-8 sm:py-10">
    <StickyPill label="OPEN SOURCE TOOLKIT" />
  </main>

  <SiteFooter brand="iris" homeHref="/" links={footerLinks} />
</div>
