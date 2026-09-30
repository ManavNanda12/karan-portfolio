import { Injectable, NgZone, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export const EASE = 'cubic-bezier(.2,.7,.1,1)';

type FrameFn = (scrollY: number, vh: number) => void;

/**
 * Central place for motion preferences, the intro gate and a single
 * rAF-throttled scroll/resize loop that runs outside Angular.
 */
@Injectable({ providedIn: 'root' })
export class MotionService {
  private readonly zone = inject(NgZone);
  readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  // prefers-reduced-motion is intentionally ignored so the animations always run.
  // readonly reduced = this.isBrowser && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  readonly reduced = false;
  readonly finePointer = this.isBrowser && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  get on(): boolean { return this.isBrowser && !this.reduced; }

  /** Flips to true once the preloader has lifted. */
  readonly introDone = signal(!this.on);
  private readyResolve!: () => void;
  readonly ready = new Promise<void>(r => (this.readyResolve = r));

  private frames = new Set<FrameFn>();
  private ticking = false;
  private io?: IntersectionObserver;
  private ioCallbacks = new WeakMap<Element, (() => void)[]>();

  constructor() {
    if (!this.on) this.readyResolve?.();
    if (!this.isBrowser) return;
    this.zone.runOutsideAngular(() => {
      const kick = () => {
        if (this.ticking) return;
        this.ticking = true;
        requestAnimationFrame(() => {
          this.ticking = false;
          const y = window.scrollY, vh = window.innerHeight;
          this.frames.forEach(fn => fn(y, vh));
        });
      };
      window.addEventListener('scroll', kick, { passive: true });
      window.addEventListener('resize', kick);
    });
  }

  finishIntro() {
    this.introDone.set(true);
    this.readyResolve();
    this.tick();
  }

  /** Register a callback for every scroll/resize frame. Returns an unsubscribe fn. */
  onFrame(fn: FrameFn): () => void {
    this.frames.add(fn);
    if (this.isBrowser) requestAnimationFrame(() => fn(window.scrollY, window.innerHeight));
    return () => this.frames.delete(fn);
  }

  tick() {
    if (!this.isBrowser) return;
    const y = window.scrollY, vh = window.innerHeight;
    this.frames.forEach(fn => fn(y, vh));
  }

  /** Fire `cb` once when `el` first enters the viewport (after the intro). */
  whenVisible(el: Element, cb: () => void) {
    if (!this.isBrowser) return;
    if (!this.io) {
      this.io = new IntersectionObserver(entries => entries.forEach(e => {
        if (!e.isIntersecting) return;
        this.io!.unobserve(e.target);
        this.ioCallbacks.get(e.target)?.forEach(cb => cb());
        this.ioCallbacks.delete(e.target);
      }), { threshold: 0, rootMargin: '0px 0px -10% 0px' });
    }
    this.ioCallbacks.set(el, [...(this.ioCallbacks.get(el) ?? []), cb]);
    this.ready.then(() => this.io!.observe(el));
  }

  unobserve(el: Element) {
    this.io?.unobserve(el);
    this.ioCallbacks.delete(el);
  }

  scrollTo(id: string) {
    if (!this.isBrowser) return;
    if (id === 'top') { window.scrollTo({ top: 0, behavior: this.reduced ? 'auto' : 'smooth' }); return; }
    document.getElementById(id)?.scrollIntoView({ behavior: this.reduced ? 'auto' : 'smooth' });
  }
}
