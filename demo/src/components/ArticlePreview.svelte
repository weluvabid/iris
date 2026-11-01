<script lang="ts">
  import { articleSections } from '../content/article.js';
</script>

<article class="mx-auto w-full max-w-3xl pb-20">
  <header class="mb-12 border-b border-border/70 pb-8 sm:mb-16 sm:pb-10">
    <p class="mb-3 text-xs font-medium tracking-[0.16em] text-primary uppercase">
      A long-form preview
    </p>
    <h1 class="text-3xl leading-tight font-semibold tracking-tight text-foreground sm:text-4xl">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    </h1>
    <p class="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
      This placeholder article gives the shell enough content to exercise normal document scrolling,
      sticky positioning, compact-on-scroll behaviour, and the footer at the end of a long page.
    </p>
  </header>

  <div class="space-y-12 sm:space-y-14">
    {#each articleSections as section (section.number)}
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
            {#each section.paragraphs as paragraph (paragraph)}
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
