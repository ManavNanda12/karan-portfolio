import {
  AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, NgZone, OnDestroy, inject, viewChildren,
} from '@angular/core';
import { MARQUEE } from '../data/portfolio.data';
import { MotionService } from '../shared/motion.service';

/**
 * Two counter-scrolling ribbons of focus areas. Scrolling the page speeds
 * them up (and flips direction when scrolling up) with a slight skew.
 */
@Component({
  selector: 'app-marquee',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="marquee" aria-label="Areas of focus">
      @for (row of rows; track $index) {
        <div class="row" [class.row--alt]="$odd">
          <div #track class="track" aria-hidden="true">
            @for (copy of [0, 1]; track copy) {
              <div class="set">
                @for (w of words; track w) {
                  <span class="word">{{ w }}</span><span class="star">✦</span>
                }
              </div>
            }
          </div>
        </div>
      }
      <span class="sr-only">{{ words.join(', ') }}</span>
    </div>
  `,
  styles: `
    .marquee { padding: clamp(28px, 4vw, 48px) 0; border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); overflow: hidden; background: var(--cream); }
    .row { overflow: hidden; white-space: nowrap; }
    .row + .row { margin-top: 6px; }
    .track { display: inline-flex; will-change: transform; }
    .set { display: inline-flex; align-items: center; flex: none; }
    .word {
      padding: 0 .45em; font-family: var(--serif); font-weight: 300; font-size: clamp(28px, 4vw, 58px);
      line-height: 1.1; letter-spacing: -.02em; color: var(--navy); transition: color .4s;
    }
    .row--alt .word { font-style: italic; color: transparent; -webkit-text-stroke: 1px var(--gold); }
    .word:hover { color: var(--gold-deep); }
    .row--alt .word:hover { color: var(--gold-soft); }
    .star { font-size: clamp(12px, 1.4vw, 18px); color: var(--gold); }
  `,
})
export class MarqueeComponent implements AfterViewInit, OnDestroy {
  private readonly motion = inject(MotionService);
  private readonly zone = inject(NgZone);
  private readonly tracks = viewChildren<ElementRef<HTMLElement>>('track');
  readonly words = MARQUEE;
  readonly rows = [0, 1];
  private raf = 0;
  private off?: () => void;

  ngAfterViewInit() {
    if (!this.motion.on) return;
    const els = this.tracks().map(t => t.nativeElement);
    const pos = els.map(() => 0);
    let lastY = window.scrollY, vel = 0, dir = 1;

    this.off = this.motion.onFrame(y => {
      const dy = y - lastY; lastY = y;
      vel = Math.max(-40, Math.min(40, dy));
      if (dy) dir = dy > 0 ? 1 : -1;
    });

    this.zone.runOutsideAngular(() => {
      const loop = () => {
        vel *= 0.9;
        const speed = (0.6 + Math.abs(vel) * 0.35) * dir;
        const skew = Math.max(-8, Math.min(8, vel * 0.3));
        els.forEach((el, i) => {
          const half = el.scrollWidth / 2;
          pos[i] -= i % 2 ? -speed : speed;
          if (pos[i] <= -half) pos[i] += half;
          if (pos[i] > 0) pos[i] -= half;
          el.style.transform = `translate3d(${pos[i]}px,0,0) skewX(${-skew}deg)`;
        });
        this.raf = requestAnimationFrame(loop);
      };
      this.raf = requestAnimationFrame(loop);
    });
  }

  ngOnDestroy() { cancelAnimationFrame(this.raf); this.off?.(); }
}
