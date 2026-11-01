import type { Component } from 'svelte';

export type SiteLink = {
  label: string;
  href: string;
  external?: boolean;
  title?: string;
  ariaLabel?: string;
  icon?: Component;
};

export type SiteHeaderLink = SiteLink;
export type SiteFooterLink = SiteLink;
