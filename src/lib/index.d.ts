import type { Component, Snippet } from 'svelte';

export type IrisNavLink = {
  label: string;
  href: string;
  external?: boolean;
  current?: boolean;
};

export type IrisFooterLink = {
  label: string;
  href: string;
  external?: boolean;
};

export type SiteHeaderProps = {
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

export type SiteFooterProps = {
  brand?: string;
  homeHref?: string;
  logoSrc?: string;
  links?: IrisFooterLink[];
  copyright?: string;
  class?: string;
};

export type StickyPillProps = {
  label?: string;
  showIndicator?: boolean;
  compactOnScroll?: boolean;
  class?: string;
};

export declare const SiteHeader: Component<SiteHeaderProps>;
export declare const SiteFooter: Component<SiteFooterProps>;
export declare const StickyPill: Component<StickyPillProps>;
