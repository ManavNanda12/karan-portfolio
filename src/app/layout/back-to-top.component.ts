import {
  AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnDestroy, inject, signal, viewChild,
} from '@angular/core';
import { MotionService } from '../shared/motion.service';
import { MagneticDirective } from '../shared/motion.directives';

/** Floating back-to-top button whose ring fills with page progress. */
@Component({
  selector: 'app-back-to-top',
  imports: [MagneticDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button type="button" class="btt" [class.btt--on]="show()" [attr.tabindex]="show() ? 0 : -1"
            aria-label="Back to top" magnetic="0.3" (click)="motion.scrollTo('top')">
      <svg viewBox="0 0 52 52" aria-hidden="true">
        <circle cx="26" cy="26" r="24" class="track" />
        <circle #ring cx="26" cy="26" r="24" class="prog" />
      </svg>
      <span class="arr" aria-hidden="true">↑</span>
    </button>
  `,
  styles: `
    .btt {
      position: fixed; right: clamp(16px, 3vw, 32px); bottom: clamp(16px, 3vw, 32px); z-index: 40;
      width: 56px; height: 56px; border-radius: 50%; border: 0; padding: 0; cursor: pointer;
      background: rgba(var(--paper-rgb),.9); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
      color: var(--navy); display: grid; place-items: center; box-shadow: 0 16px 30px -18px rgba(var(--ink-rgb),.45);
      opacity: 0; transform: translateY(20px) scale(.8); pointer-events: none;
      transition: opacity .45s var(--ease), transform .45s var(--ease), background-color .3s, color .3s;
    }
    .btt--on { opacity: 1; transform: none; pointer-events: auto; }
    .btt:hover { background: var(--deep); color: var(--on-deep); }
    svg { position: absolute; inset: 0; transform: rotate(-90deg); }
    circle { fill: none; stroke-width: 1.5; }
    .track { stroke: rgba(var(--ink-rgb),.1); }
    .prog { stroke: var(--gold); stroke-dasharray: 151; stroke-dashoffset: 151; stroke-linecap: round; }
    .arr { font-size: 18px; transition: transform .4s var(--ease); }
    .btt:hover .arr { transform: translateY(-3px); }
  `,
})
export class BackToTopComponent implements AfterViewInit, OnDestroy {
  readonly motion = inject(MotionService);
  readonly show = signal(false);
  private readonly ring = viewChild.required<ElementRef<SVGCircleElement>>('ring');
  private off?: () => void;

  ngAfterViewInit() {
    const ring = this.ring().nativeElement;
    this.off = this.motion.onFrame((y, vh) => {
      this.show.set(y > vh * 0.9);
      const max = document.documentElement.scrollHeight - vh;
      ring.style.strokeDashoffset = String(151 * (1 - (max > 0 ? Math.min(1, y / max) : 0)));
    });
  }

  ngOnDestroy() { this.off?.(); }
}
