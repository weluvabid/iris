<script lang="ts">
  import {
    Button,
    DebouncedInput,
    getInitialTheme,
    SiteFooter,
    SiteHeader,
    Tooltip,
  } from '@weluvabid/iris';
  import * as Components from '@weluvabid/iris/components';
  import { Button as DirectButton } from '@weluvabid/iris/components/ui/button';
  import { createFilters } from '@weluvabid/iris/data-table';
  import { useDebounceCallback } from '@weluvabid/iris/hooks';
  import * as Lucide from '@weluvabid/iris/lucide';
  import * as SimpleIcons from '@weluvabid/iris/simple-icons';
  import {
    ActionButton,
    NavIndicator,
    NumberTicker,
    ScrambleText,
    ThemeToggler,
    spotlight,
  } from '@weluvabid/iris/motion';

  const publicApi = [
    DebouncedInput,
    SiteFooter,
    SiteHeader,
    Tooltip,
    Components,
    DirectButton,
    createFilters,
    useDebounceCallback,
    Lucide,
    SimpleIcons,
    getInitialTheme,
    ActionButton,
    NavIndicator,
    NumberTicker,
    ScrambleText,
    ThemeToggler,
    spotlight,
  ];
</script>

<main data-api-count={publicApi.length}>
  <SiteHeader>
    <a href="/" aria-label="Home">Brand</a>
    <nav aria-label="Primary navigation"><a href="/docs">Docs</a></nav>
  </SiteHeader>
  <Button.Root>Root entry point</Button.Root>
  <SiteFooter>
    <span>Copyright</span>
    <nav aria-label="Footer navigation"><a href="/privacy">Privacy</a></nav>
  </SiteFooter>
  <ActionButton idleLabel="Run" onaction={() => Promise.resolve()} />
  <NavIndicator items={[{ label: 'Home', href: '/' }]} activeHref="/" />
  <NumberTicker value={42} />
  <ScrambleText text="IRIS MOTION" />
  <ThemeToggler theme="light" />
</main>
