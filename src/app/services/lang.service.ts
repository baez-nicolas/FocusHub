import { effect, Injectable, signal } from '@angular/core';

export type Lang = 'en' | 'es';

@Injectable({ providedIn: 'root' })
export class LangService {
  readonly lang = signal<Lang>('en');

  constructor() {
    const saved = localStorage.getItem('lang') as Lang | null;
    if (saved === 'en' || saved === 'es') this.lang.set(saved);

    effect(() => {
      localStorage.setItem('lang', this.lang());
    });
  }

  toggle(): void {
    this.lang.set(this.lang() === 'en' ? 'es' : 'en');
  }
}
