import {
  ChangeDetectionStrategy, Component, ElementRef, OnDestroy, OnInit, computed, inject, input, signal,
} from '@angular/core';
import { SITE } from '../data/portfolio.data';
import { MotionService } from './motion.service';

/** Image with a graceful placeholder when no file is set (or it fails to load). */
@Component({
  selector: 'app-photo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (src() && !failed()) {
      <img [src]="src()" [alt]="alt() || placeholder()" loading="lazy" decoding="async" (error)="failed.set(true)" />
    } @else {
      <div class="ph" role="img" [attr.aria-label]="placeholder()">
        @if (monogram()) { <span class="ph-mono">{{ monogram() }}</span> }
        @if (showLabel()) {
          <span class="ph-label">
            <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M4 7h3l2-2h6l2 2h3v12H4z M12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" fill="none" stroke="currentColor" stroke-width="1.2"/></svg>
            {{ placeholder() }}
          </span>
        }
      </div>
    }
  `,
  styles: `
    :host { display: block; width: 100%; height: 100%; overflow: hidden; }
    img { display: block; width: 100%; height: 100%; object-fit: cover; }
    .ph {
      position: relative; width: 100%; height: 100%; display: grid; place-items: center;
      background:
        repeating-linear-gradient(135deg, rgba(184,154,98,.09) 0 1px, transparent 1px 14px),
        radial-gradient(120% 90% at 30% 20%, var(--ph-1) 0%, var(--ph-2) 60%, var(--ph-3) 100%);
      color: var(--slate);
    }
    .ph-mono {
      font-family: var(--serif); font-style: italic; font-weight: 300;
      font-size: clamp(90px, 16vw, 190px); line-height: 1; color: transparent;
      -webkit-text-stroke: 1px var(--ph-stroke); letter-spacing: -.04em; user-select: none;
    }
    .ph-label {
      position: absolute; left: 16px; right: 16px; bottom: var(--ph-label-bottom, 14px); display: flex; align-items: center; gap: 8px;
      font-family: var(--mono); font-size: 10px; letter-spacing: .12em; text-transform: uppercase; opacity: .85;
    }
  `,
})
export class PhotoComponent {
  readonly src = input('');
  readonly placeholder = input('Photograph');
  readonly alt = input('');
  readonly monogram = input('');
  readonly showLabel = input(true);
  readonly failed = signal(false);
}

/** Dashed "to confirm" marker, hidden when SITE.showDraftMarkers is off. */
@Component({
  selector: 'app-draft',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `@if (show) { <span class="draft" [class.draft--dark]="dark()"><ng-content /></span> }`,
  styles: `:host { display: contents; }`,
})
export class DraftComponent {
  readonly dark = input(false);
  readonly show = SITE.showDraftMarkers;
}

/**
 * Paragraph whose words brighten one by one as it scrolls through the viewport.
 */
@Component({
  selector: 'app-scroll-text',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span class="sr-only">{{ text() }}</span><span aria-hidden="true">@for (w of words(); track $index) {<span class="w">{{ w }} </span>}</span>`,
  styles: `
    :host { display: block; }
    .w { opacity: var(--o, 1); transition: opacity .25s linear; }
  `,
})
export class ScrollTextComponent implements OnInit, OnDestroy {
  readonly text = input.required<string>();
  readonly words = computed(() => this.text().split(/\s+/));

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly motion = inject(MotionService);
  private off?: () => void;

  ngOnInit() {
    if (!this.motion.on) return;
    this.off = this.motion.onFrame((_, vh) => {
      const spans = this.host.querySelectorAll<HTMLElement>('.w');
      const r = this.host.getBoundingClientRect();
      // 0 when the block's top hits 85% of the viewport, 1 when its bottom reaches 45%
      const p = Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (r.height + vh * 0.4)));
      const lit = p * spans.length;
      spans.forEach((s, i) => s.style.setProperty('--o', String(Math.min(1, Math.max(0.16, lit - i + 0.16)))));
    });
  }

  ngOnDestroy() { this.off?.(); }
}
