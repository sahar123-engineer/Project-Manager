import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private key = 'pm-theme';

  private initialized = false;

  constructor() {
    // Avoid accessing window/document/localStorage during SSR in constructor.
    // Defer initialization to first runtime call.
  }

  private ensureInit() {
    if (this.initialized) return;
    this.initialized = true;
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      try {
        const stored = localStorage.getItem(this.key);
        if (stored === 'dark') {
          document.documentElement.classList.add('dark');
        }
      } catch (e) {
        // ignore storage errors
      }
    }
  }

  isDark(): boolean {
    this.ensureInit();
    if (typeof window === 'undefined') return false;
    return typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
  }

  toggle(): void {
    this.ensureInit();
    if (typeof window === 'undefined') return;
    const isDark = this.isDark();
    try {
      if (isDark) {
        if (typeof document !== 'undefined') document.documentElement.classList.remove('dark');
        localStorage.setItem(this.key, 'light');
      } else {
        if (typeof document !== 'undefined') document.documentElement.classList.add('dark');
        localStorage.setItem(this.key, 'dark');
      }
    } catch (e) {
      // ignore storage errors
    }
  }
}
