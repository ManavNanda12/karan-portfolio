import { Directive, ElementRef, NgZone, OnDestroy, OnInit, inject, input } from '@angular/core';
import { EASE, MotionService } from './motion.service';

/** Lets numeric inputs be set as plain attributes (`tilt="4"`) or bare (`magnetic`). */
const num = (fallback: number) => (v: unknown) => (v === '' || v == null ? fallback : Number(v));

/**
 * Scroll-triggered entrance.
 *  reveal=""      fade + rise
 *  reveal="mask"  slide up from behind an overflow:hidden parent (.mask-line)
 *  reveal="clip"  curtain wipe from the bottom with a slight zoom-out (for photos)
 */
@Directive({ selector: '[reveal]' })
export class RevealDirective implements OnInit, OnDestroy {
  readonly reveal = input<'' | 'mask' | 'clip'>('');
  readonly revealDelay = input(0);

  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly motion = inject(MotionService);
  private target?: Element;

  private get frames(): [Keyframe, Keyframe] {
    switch (this.reveal()) {
      case 'mask': return [{ transform: 'translateY(105%)' }, { transform: 'translateY(0)' }];
      case 'clip': return [
        { clipPath: 'inset(100% 0 0 0)', transform: 'scale(1.12)' },
        { clipPath: 'inset(0% 0 0 0)', transform: 'scale(1)' },
      ];
      default: return [{ opacity: 0, transform: 'translateY(28px)' }, { opacity: 1, transform: 'translateY(0)' }];
    }
  }

  ngOnInit() {
    if (!this.motion.on) { this.el.classList.add('is-revealed'); return; }
    const [from, to] = this.frames;
    Object.assign(this.el.style, from);
    // A masked/clipped element is invisible to IntersectionObserver (it clips by
    // ancestor overflow), so watch its container instead.
    this.target = this.reveal() ? this.el.parentElement ?? this.el : this.el;
    this.motion.whenVisible(this.target, () => {
      Object.assign(this.el.style, to);
      this.el.classList.add('is-revealed');
      const kind = this.reveal();
      this.el.animate([from, to], {
        duration: kind === 'mask' ? 1100 : kind === 'clip' ? 1400 : 950,
        delay: this.revealDelay(),
        easing: EASE,
        fill: 'backwards',
      });
    });
  }

  ngOnDestroy() { if (this.target) this.motion.unobserve(this.target); }
}

/** Pulls the element toward the cursor while hovered, springs back on leave. */
@Directive({ selector: '[magnetic]' })
export class MagneticDirective implements OnInit, OnDestroy {
  readonly magnetic = input(0.35, { transform: num(0.35) });

  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly motion = inject(MotionService);
  private readonly zone = inject(NgZone);
  private cleanup: (() => void)[] = [];

  ngOnInit() {
    if (!this.motion.on || !this.motion.finePointer) return;
    const k = this.magnetic();
    this.zone.runOutsideAngular(() => {
      const move = (e: PointerEvent) => {
        const r = this.el.getBoundingClientRect();
        const x = e.clientX - (r.left + r.width / 2), y = e.clientY - (r.top + r.height / 2);
        this.el.style.transition = 'transform .25s cubic-bezier(.2,.7,.1,1)';
        this.el.style.transform = `translate(${x * k}px, ${y * k}px)`;
      };
      const leave = () => {
        this.el.style.transition = 'transform .7s cubic-bezier(.2,1.6,.3,1)';
        this.el.style.transform = '';
      };
      this.el.addEventListener('pointermove', move);
      this.el.addEventListener('pointerleave', leave);
      this.cleanup.push(() => {
        this.el.removeEventListener('pointermove', move);
        this.el.removeEventListener('pointerleave', leave);
      });
    });
  }

  ngOnDestroy() { this.cleanup.forEach(fn => fn()); }
}

/**
 * 3D tilt toward the pointer. Also exposes --mx / --my (in %) so the
 * element's CSS can paint a spotlight or glare that follows the cursor.
 */
@Directive({ selector: '[tilt]' })
export class TiltDirective implements OnInit, OnDestroy {
  /** Max rotation in degrees; 0 keeps only the spotlight vars. */
  readonly tilt = input(6, { transform: num(6) });

  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly motion = inject(MotionService);
  private readonly zone = inject(NgZone);
  private cleanup: (() => void)[] = [];

  ngOnInit() {
    if (!this.motion.on || !this.motion.finePointer) return;
    const max = this.tilt();
    this.zone.runOutsideAngular(() => {
      const enter = (e: PointerEvent) => {
        const r = this.el.getBoundingClientRect();
        this.el.style.setProperty('--ex', `${((e.clientX - r.left) / r.width) * 100}%`);
        this.el.style.setProperty('--ey', `${((e.clientY - r.top) / r.height) * 100}%`);
      };
      const move = (e: PointerEvent) => {
        const r = this.el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        this.el.style.setProperty('--mx', `${px * 100}%`);
        this.el.style.setProperty('--my', `${py * 100}%`);
        if (max) {
          this.el.style.transform =
            `perspective(900px) rotateX(${(0.5 - py) * max}deg) rotateY(${(px - 0.5) * max}deg) translateY(-6px)`;
        }
      };
      const leave = (e: PointerEvent) => {
        const r = this.el.getBoundingClientRect();
        this.el.style.setProperty('--ex', `${((e.clientX - r.left) / r.width) * 100}%`);
        this.el.style.setProperty('--ey', `${((e.clientY - r.top) / r.height) * 100}%`);
        if (max) this.el.style.transform = '';
      };
      this.el.addEventListener('pointerenter', enter);
      this.el.addEventListener('pointermove', move);
      this.el.addEventListener('pointerleave', leave);
      this.cleanup.push(() => {
        this.el.removeEventListener('pointerenter', enter);
        this.el.removeEventListener('pointermove', move);
        this.el.removeEventListener('pointerleave', leave);
      });
    });
  }

  ngOnDestroy() { this.cleanup.forEach(fn => fn()); }
}

/** Vertical parallax: shifts the element by `speed` × its distance from the viewport centre. */
@Directive({ selector: '[parallax]' })
export class ParallaxDirective implements OnInit, OnDestroy {
  readonly parallax = input(0.08, { transform: num(0.08) });

  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly motion = inject(MotionService);
  private off?: () => void;

  ngOnInit() {
    if (!this.motion.on) return;
    const k = this.parallax();
    this.el.style.willChange = 'transform';
    this.off = this.motion.onFrame((_, vh) => {
      const r = this.el.parentElement!.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) return;
      const d = r.top + r.height / 2 - vh / 2;
      this.el.style.translate = `0 ${(-d * k).toFixed(1)}px`;
    });
  }

  ngOnDestroy() { this.off?.(); }
}

/** Counts from 0 to the target number the first time it scrolls into view. */
@Directive({ selector: '[countUp]' })
export class CountUpDirective implements OnInit, OnDestroy {
  readonly countUp = input.required<number>();
  readonly countDelay = input(0);

  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly motion = inject(MotionService);
  private raf = 0;

  ngOnInit() {
    const target = this.countUp();
    const pad = (n: number) => String(n).padStart(2, '0');
    this.el.textContent = pad(this.motion.on ? 0 : target);
    if (!this.motion.on) return;
    this.motion.whenVisible(this.el, () => {
      const start = performance.now() + this.countDelay(), dur = 1600;
      const step = (t: number) => {
        const p = Math.min(1, Math.max(0, (t - start) / dur));
        const eased = 1 - Math.pow(1 - p, 4);
        this.el.textContent = pad(Math.round(target * eased));
        if (p < 1) this.raf = requestAnimationFrame(step);
      };
      this.raf = requestAnimationFrame(step);
    });
  }

  ngOnDestroy() { cancelAnimationFrame(this.raf); this.motion.unobserve(this.el); }
}

export const MOTION = [RevealDirective, MagneticDirective, TiltDirective, ParallaxDirective, CountUpDirective] as const;
