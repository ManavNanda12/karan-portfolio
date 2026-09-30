import { DOCUMENT, Injectable, inject, signal } from '@angular/core';

export type Theme = 'light' | 'dark';
const KEY = 'ksj-theme';

/**
 * Light / dark theme. The initial value is applied by an inline script in
 * index.html (no flash); this service keeps it in sync, persists the choice
 * and animates the switch as a circle growing from the toggle button.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly doc = inject(DOCUMENT);
  readonly theme = signal<Theme>((this.doc.documentElement.dataset['theme'] as Theme) || 'light');

  toggle(origin?: MouseEvent) {
    const next: Theme = this.theme() === 'dark' ? 'light' : 'dark';
    const apply = () => {
      this.doc.documentElement.dataset['theme'] = next;
      this.theme.set(next);
      try { localStorage.setItem(KEY, next); } catch { /* storage blocked */ }
      this.doc.querySelector('meta[name="theme-color"]')?.setAttribute('content', next === 'dark' ? '#0F1729' : '#F6F2EA');
    };

    const vt = (this.doc as Document & { startViewTransition?: (cb: () => void) => { ready: Promise<void> } })
      .startViewTransition?.bind(this.doc);
    if (!vt) { apply(); return; }

    const x = origin?.clientX ?? innerWidth - 60, y = origin?.clientY ?? 40;
    const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    vt(apply).ready.then(() => {
      this.doc.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
        { duration: 700, easing: 'cubic-bezier(.76,0,.24,1)', pseudoElement: '::view-transition-new(root)' },
      );
    });
  }
}
