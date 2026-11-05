import { Injectable, signal, inject, DOCUMENT } from '@angular/core';

export type ThemeName = 'alpaca' | 'external';

const STORAGE_KEY = 'exos-active-theme';
const LINK_ID = 'exos-theme-stylesheet';
const DEFAULT_THEME: ThemeName = 'alpaca';

const THEME_HREFS: Record<ThemeName, string> = {
  alpaca: 'theme-alpaca.css',
  external: 'theme-external.css',
};

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly doc = inject(DOCUMENT);
  readonly active = signal<ThemeName>(DEFAULT_THEME);
  readonly available: ThemeName[] = ['alpaca', 'external'];

  init(): void {
    const stored = this.readStored();
    this.apply(stored ?? DEFAULT_THEME);
  }

  setTheme(name: ThemeName): void {
    if (name === this.active() && this.doc.getElementById(LINK_ID)) return;
    this.apply(name);
    try { localStorage.setItem(STORAGE_KEY, name); } catch {}
  }

  toggle(): void {
    this.setTheme(this.active() === 'alpaca' ? 'external' : 'alpaca');
  }

  private apply(name: ThemeName): void {
    const head = this.doc.head;
    let link = this.doc.getElementById(LINK_ID) as HTMLLinkElement | null;
    if (!link) {
      link = this.doc.createElement('link');
      link.id = LINK_ID;
      link.rel = 'stylesheet';
      head.appendChild(link);
    }
    link.href = THEME_HREFS[name];
    this.active.set(name);
  }

  private readStored(): ThemeName | null {
    try {
      const v = localStorage.getItem(STORAGE_KEY);
      return v === 'alpaca' || v === 'external' ? v : null;
    } catch {
      return null;
    }
  }
}
