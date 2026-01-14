import { effect, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  isDark = signal<boolean>(false);

  constructor() {
    const saved = localStorage.getItem('theme');
    if (saved) {
      this.isDark.set(saved === 'dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.isDark.set(prefersDark);
    }

    effect(() => {
      const theme = this.isDark() ? 'dark' : 'light';
      localStorage.setItem('theme', theme);
      document.documentElement.classList.toggle('dark', this.isDark());
    });
  }

  toggle(): void {
    this.isDark.set(!this.isDark());
  }
}
