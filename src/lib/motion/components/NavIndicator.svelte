<script lang="ts" module>
  export type NavIndicatorItem = {
    label: string;
    href: string;
  };
</script>

<script lang="ts">
  import { onMount, tick } from 'svelte';

  let {
    items,
    activeHref,
    ariaLabel = 'Primary navigation',
    class: className,
  }: {
    items: NavIndicatorItem[];
    activeHref: string;
    ariaLabel?: string;
    class?: string;
  } = $props();

  let navElement: HTMLElement;
  let links = $state<HTMLAnchorElement[]>([]);
  let indicator = $state({ x: 0, width: 0, visible: false });
  let observer: ResizeObserver | undefined;
  const activeIndex = $derived(items.findIndex((item) => item.href === activeHref));

  async function measure(index = activeIndex) {
    await tick();

    if (!navElement) {
      return;
    }

    const activeLink = index >= 0 ? links[index] : undefined;

    if (!activeLink) {
      indicator = { ...indicator, visible: false };

      return;
    }

    const navBounds = navElement.getBoundingClientRect();
    const linkBounds = activeLink.getBoundingClientRect();

    indicator = {
      x: linkBounds.left - navBounds.left + navElement.scrollLeft,
      width: linkBounds.width,
      visible: true,
    };
  }

  $effect(() => {
    const index = activeIndex;

    void measure(index).catch((error: unknown) =>
      console.warn('Iris navigation measurement failed.', error),
    );
  });

  onMount(() => {
    if (typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(() => {
        measure().catch((error: unknown) =>
          console.warn('Iris navigation measurement failed.', error),
        );
      });

      observer.observe(navElement);

      for (const link of links) {
        observer.observe(link);
      }
    }

    return () => observer?.disconnect();
  });
</script>

<nav
  bind:this={navElement}
  aria-label={ariaLabel}
  class={`relative flex min-h-11 items-center gap-1 overflow-x-auto border-b border-border ${className ?? ''}`}
>
  {#each items as item, index (item.href)}
    <a
      bind:this={links[index]}
      href={item.href}
      aria-current={activeHref === item.href ? 'page' : undefined}
      class="relative z-10 inline-flex min-h-11 shrink-0 items-center px-3 text-sm text-muted-foreground transition-colors duration-150 hover:text-foreground focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring aria-[current=page]:font-medium aria-[current=page]:text-foreground motion-reduce:transition-none"
    >
      {item.label}
    </a>
  {/each}
  <span
    aria-hidden="true"
    class="pointer-events-none absolute bottom-0 h-0.5 rounded-full bg-foreground transition-[transform,width,opacity] duration-200 ease-out motion-reduce:transition-none"
    style={`width:${indicator.width}px;transform:translateX(${indicator.x}px);opacity:${indicator.visible ? 1 : 0}`}
  ></span>
</nav>
