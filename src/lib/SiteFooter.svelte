<script lang="ts">
  type IrisFooterLink = {
    label: string;
    href: string;
    external?: boolean;
  };

  type Props = {
    brand?: string;
    homeHref?: string;
    logoSrc?: string;
    links?: IrisFooterLink[];
    copyright?: string;
    class?: string;
  };

  let {
    brand,
    homeHref = '/',
    logoSrc,
    links = [],
    copyright,
    class: className = '',
  }: Props = $props();
</script>

<footer class="iris-footer {className}">
  {#if brand || logoSrc}
    <a class="iris-footer__brand" href={homeHref}>
      {#if logoSrc}<img src={logoSrc} alt="" width="20" height="20" />{/if}
      {#if brand}<span>{brand}</span>{/if}
    </a>
  {:else if copyright}
    <span>{copyright}</span>
  {/if}

  {#if copyright && (brand || logoSrc)}
    <span>{copyright}</span>
  {/if}

  {#if links.length > 0}
    <nav class="iris-footer__nav" aria-label="Project resources">
      {#each links as link (link.href)}
        <a
          class="iris-footer__link"
          href={link.href}
          aria-label={link.external ? `${link.label} (opens in a new tab)` : link.label}
          title={link.label}
          target={link.external ? '_blank' : undefined}
          rel={link.external ? 'noopener noreferrer' : undefined}
        >
          {link.label}
        </a>
      {/each}
    </nav>
  {/if}
</footer>
