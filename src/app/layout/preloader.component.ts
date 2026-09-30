import { ChangeDetectionStrategy, Component, DOCUMENT, OnInit, inject, signal } from '@angular/core';
import { SITE } from '../data/portfolio.data';
import { MotionService } from '../shared/motion.service';

/**
 * Intro curtain: the monogram ring draws itself, a counter runs to 100,
 * then the panel lifts away and the hero entrance begins.
 */
@Component({
  selector: 'app-preloader',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (visible()) {
      <div class="pre" [class.pre--out]="leaving()" aria-hidden="true">
        <div class="pre-center">
          <svg class="ring" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="56" />
          </svg>
          <span class="mono">{{ site.monogram }}</span>
        </div>
        <div class="pre-foot">
          <span class="pre-name">{{ site.name }}</span>
          <span class="pre-count">{{ count() }}</span>
        </div>
        <div class="pre-bar"><span [style.transform]="'scaleX(' + count() / 100 + ')'"></span></div>
      </div>
    }
  `,
  styles: `
    .pre {
      position: fixed; inset: 0; z-index: 1000; background: var(--deep); color: var(--on-deep);
      display: grid; place-items: center; transition: transform 1s cubic-bezier(.76,0,.24,1);
    }
    .pre--out { transform: translateY(-100%); }
    .pre-center { position: relative; width: 150px; height: 150px; display: grid; place-items: center; }
    .ring { position: absolute; inset: 0; transform: rotate(-90deg); }
    .ring circle {
      fill: none; stroke: var(--gold); stroke-width: 1; stroke-dasharray: 352; stroke-dashoffset: 352;
      animation: draw 1.4s var(--ease) forwards;
    }
    .mono {
      font-family: var(--serif); font-style: italic; font-size: 56px; letter-spacing: -.02em;
      opacity: 0; transform: translateY(14px); animation: rise .9s var(--ease) .35s forwards;
    }
    .pre-foot {
      position: absolute; left: var(--gutter); right: var(--gutter); bottom: 44px;
      display: flex; justify-content: space-between; align-items: flex-end;
      font-family: var(--mono); font-size: 11px; letter-spacing: .16em; text-transform: uppercase; color: var(--gold-soft);
    }
    .pre-count { font-family: var(--serif); font-size: 64px; line-height: .8; letter-spacing: -.03em; color: var(--on-deep); font-variant-numeric: tabular-nums; }
    .pre-bar { position: absolute; left: 0; right: 0; bottom: 0; height: 2px; background: rgba(217,195,152,.15); }
    .pre-bar span { display: block; height: 100%; background: var(--gold); transform-origin: left; }
    @keyframes draw { to { stroke-dashoffset: 0; } }
    @keyframes rise { to { opacity: 1; transform: none; } }
  `,
})
export class PreloaderComponent implements OnInit {
  private readonly motion = inject(MotionService);
  private readonly doc = inject(DOCUMENT);
  readonly site = SITE;
  readonly visible = signal(this.motion.on);
  readonly leaving = signal(false);
  readonly count = signal(0);

  ngOnInit() {
    if (!this.motion.on) return;
    const html = this.doc.documentElement;
    html.classList.add('is-loading');
    const start = performance.now(), dur = 1500;
    const step = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      this.count.set(Math.round(100 * (1 - Math.pow(1 - p, 3))));
      if (p < 1) { requestAnimationFrame(step); return; }
      setTimeout(() => {
        this.leaving.set(true);
        html.classList.remove('is-loading');
        // start the hero entrance while the curtain is still lifting
        setTimeout(() => this.motion.finishIntro(), 350);
        setTimeout(() => this.visible.set(false), 1100);
      }, 200);
    };
    requestAnimationFrame(step);
  }
}
