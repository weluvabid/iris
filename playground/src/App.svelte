<script lang="ts">
  import { BookOpenText, CircleQuestionMark } from '@lucide/svelte';
  import { SiGithub } from '@icons-pack/svelte-simple-icons';
  import { SiteFooter, SiteHeader, StickyPill } from '../../src/lib/index.js';

  let darkMode = $state(document.documentElement.classList.contains('dark'));

  function applyTheme(value: boolean): void {
    darkMode = value;
    document.documentElement.classList.toggle('dark', value);
    document.documentElement.style.colorScheme = value ? 'dark' : 'light';
    const background = getComputedStyle(document.documentElement)
      .getPropertyValue('--background')
      .trim();

    if (background) {
      document
        .querySelector<HTMLMetaElement>('meta[name="theme-color"]')
        ?.setAttribute('content', background);
    }

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

  const sections = [
    {
      number: '01',
      title: 'Lorem ipsum dolor sit amet',
      paragraphs: [
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere, justo sed interdum consequat, neque arcu feugiat erat, vitae volutpat lectus erat at lorem. Donec vitae lectus sed neque tincidunt tincidunt. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed at lacus vitae justo posuere fermentum.',
        'Praesent commodo, massa at feugiat malesuada, neque lorem tincidunt erat, non feugiat ipsum neque vitae justo. Aenean sed sem id magna viverra tristique. Duis vel sapien at augue blandit interdum. Nam consequat, sapien vel consequat tempor, lectus nibh tincidunt nibh, vitae hendrerit magna risus non erat.',
      ],
    },
    {
      number: '02',
      title: 'Consectetur adipiscing elit',
      paragraphs: [
        'Suspendisse potenti. Nulla facilisi. Cras vitae sem non justo luctus gravida. Aliquam erat volutpat. Morbi euismod, augue quis blandit posuere, neque nibh consequat sapien, sed tincidunt nisl lectus sit amet erat. Curabitur quis dolor vitae neque dignissim tincidunt.',
        'Etiam interdum, purus sit amet tincidunt tincidunt, ipsum nisl interdum augue, a consequat velit erat vitae justo. Integer non lectus vitae magna tristique feugiat. Donec sed velit sed nulla tincidunt posuere. Phasellus id justo vitae magna blandit posuere vitae sed lectus.',
      ],
    },
    {
      number: '03',
      title: 'Integer posuere erat a ante',
      paragraphs: [
        'Maecenas faucibus mollis interdum. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Cras mattis consectetur purus sit amet fermentum. Donec ullamcorper nulla non metus auctor fringilla. Aenean laoreet, tortor in tincidunt feugiat, justo erat commodo nibh, vitae posuere nisl augue non sapien.',
        'Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Sed posuere consectetur est at lobortis. Nulla vitae elit libero, a pharetra augue. Etiam porta sem malesuada magna mollis euismod. Donec id elit non mi porta gravida at eget metus.',
      ],
    },
    {
      number: '04',
      title: 'Vestibulum id ligula porta felis',
      paragraphs: [
        'Curabitur blandit tempus porttitor. Nullam quis risus eget urna mollis ornare vel eu leo. Donec sed odio dui. Aenean lacinia bibendum nulla sed consectetur. Cras justo odio, dapibus ac facilisis in, egestas eget quam.',
        'Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Donec sed odio dui. Nulla vitae elit libero, a pharetra augue.',
      ],
    },
    {
      number: '05',
      title: 'Aenean eu leo quam',
      paragraphs: [
        'Pellentesque ornare sem lacinia quam venenatis vestibulum. Etiam porta sem malesuada magna mollis euismod. Donec ullamcorper nulla non metus auctor fringilla. Vestibulum id ligula porta felis euismod semper. Maecenas sed diam eget risus varius blandit sit amet non magna.',
        'Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Nulla vitae elit libero, a pharetra augue. Sed posuere consectetur est at lobortis. Donec id elit non mi porta gravida at eget metus. Cras mattis consectetur purus sit amet fermentum.',
      ],
    },
    {
      number: '06',
      title: 'Donec ullamcorper nulla',
      paragraphs: [
        'Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Donec sed odio dui. Aenean lacinia bibendum nulla sed consectetur. Vestibulum id ligula porta felis euismod semper. Cras mattis consectetur purus sit amet fermentum.',
        'Nullam id dolor id nibh ultricies vehicula ut id elit. Etiam porta sem malesuada magna mollis euismod. Maecenas faucibus mollis interdum. Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Donec sed odio dui.',
      ],
    },
    {
      number: '07',
      title: 'Nullam quis risus eget urna',
      paragraphs: [
        'Sed posuere consectetur est at lobortis. Donec ullamcorper nulla non metus auctor fringilla. Vestibulum id ligula porta felis euismod semper. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum.',
        'Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Curabitur blandit tempus porttitor.',
      ],
    },
    {
      number: '08',
      title: 'Finis, sed non terminus',
      paragraphs: [
        'Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Aenean lacinia bibendum nulla sed consectetur. Donec id elit non mi porta gravida at eget metus. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        'Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Nulla vitae elit libero, a pharetra augue. Donec ullamcorper nulla non metus auctor fringilla. Sed posuere consectetur est at lobortis. Integer posuere erat a ante venenatis dapibus posuere velit aliquet.',
      ],
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

  <main class="min-h-0 flex-1 py-8 sm:py-10">
    <StickyPill label="OPEN SOURCE TOOLKIT" />

    <article class="mx-auto w-full max-w-3xl pb-20">
      <header class="mb-12 border-b border-border/70 pb-8 sm:mb-16 sm:pb-10">
        <p class="mb-3 text-xs font-medium tracking-[0.16em] text-primary uppercase">
          A long-form preview
        </p>
        <h1 class="text-3xl leading-tight font-semibold tracking-tight text-foreground sm:text-4xl">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </h1>
        <p class="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
          This placeholder article gives the shell enough content to exercise normal document
          scrolling, sticky positioning, compact-on-scroll behaviour, and the footer at the end of a
          long page.
        </p>
      </header>

      <div class="space-y-12 sm:space-y-14">
        {#each sections as section}
          <section
            aria-labelledby={`section-${section.number}`}
            class="grid gap-3 sm:grid-cols-[3rem_minmax(0,1fr)] sm:gap-6"
          >
            <p class="pt-1 font-mono text-xs text-primary/80">{section.number}</p>
            <div>
              <h2
                id={`section-${section.number}`}
                class="mb-4 text-xl font-semibold tracking-tight text-foreground sm:text-2xl"
              >
                {section.title}
              </h2>
              <div
                class="space-y-5 text-[15px] leading-7 text-muted-foreground sm:text-base sm:leading-8"
              >
                {#each section.paragraphs as paragraph}
                  <p>{paragraph}</p>
                {/each}
              </div>
            </div>
          </section>
        {/each}
      </div>

      <div class="mt-16 border-t border-border/70 pt-6 text-sm text-muted-foreground">
        Lorem ipsum ends here. The footer should follow naturally after the final section.
      </div>
    </article>
  </main>

  <SiteFooter brand="iris" homeHref="/" links={footerLinks} />
</div>
