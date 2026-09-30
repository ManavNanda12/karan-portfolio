import {
  ChangeDetectionStrategy, Component, DOCUMENT, ElementRef, NgZone, OnDestroy, OnInit, inject, viewChild,
} from '@angular/core';
import { MotionService } from '../shared/motion.service';

/**
 * Dot + trailing ring cursor. The ring swells over interactive elements and
 * shows a short label for anything carrying [data-cursor="Label"].
 * Uses mix-blend-mode: difference so it reads on both cream and navy sections.
 */
@Component({
  selector: 'app-cursor',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div #ring class="ring"><span #label class="label"></span></div>
    <div #dot class="dot"></div>
  `,
  styles: `
    /* No stacking context on the host, or the difference blend would only see a transparent layer */
    :host { display: contents; }
    .dot, .ring { position: fixed; top: 0; left: 0; z-index: 2000; border-radius: 50%; pointer-events: none; opacity: 0; transition: opacity .3s; }
    .dot { width: 8px; height: 8px; margin: -4px 0 0 -4px; background: #fff; mix-blend-mode: difference; }
    .ring {
      width: 40px; height: 40px; margin: -20px 0 0 -20px; border: 1px solid rgba(255,255,255,.9); mix-blend-mode: difference;
      display: grid; place-items: center;
      transition: opacity .3s, width .45s var(--ease), height .45s var(--ease), margin .45s var(--ease), background-color .45s var(--ease), border-color .45s;
    }
    :host(.live) .dot, :host(.live) .ring { opacity: 1; }
    :host(.hover) .ring { width: 64px; height: 64px; margin: -32px 0 0 -32px; background: rgba(255,255,255,.12); }
    :host(.labelled) .ring { width: 92px; height: 92px; margin: -46px 0 0 -46px; background: #fff; border-color: #fff; }
    :host(.labelled) .dot { opacity: 0; }
    :host(.down) .ring { width: 30px; height: 30px; margin: -15px 0 0 -15px; }
    .label {
      font-family: var(--mono); font-size: 10px; letter-spacing: .14em; text-transform: uppercase; color: #000;
      opacity: 0; transform: scale(.6); transition: opacity .3s, transform .45s var(--ease);
    }
    :host(.labelled) .label { opacity: 1; transform: none; }
  `,
})
export class CursorComponent implements OnInit, OnDestroy {
  private readonly motion = inject(MotionService);
  private readonly zone = inject(NgZone);
  private readonly doc = inject(DOCUMENT);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly dot = viewChild.required<ElementRef<HTMLElement>>('dot');
  private readonly ring = viewChild.required<ElementRef<HTMLElement>>('ring');
  private readonly label = viewChild.required<ElementRef<HTMLElement>>('label');
  private raf = 0;
  private cleanup: (() => void)[] = [];

  ngOnInit() {
    if (!this.motion.on || !this.motion.finePointer) { this.host.style.display = 'none'; return; }
    this.doc.documentElement.classList.add('has-cursor');
    const cl = this.host.classList;
    let mx = -100, my = -100, rx = -100, ry = -100;

    this.zone.runOutsideAngular(() => {
      const move = (e: PointerEvent) => {
        mx = e.clientX; my = e.clientY;
        cl.add('live');
        const t = (e.target as HTMLElement).closest<HTMLElement>('a, button, [data-cursor], input, textarea, label');
        const text = t?.dataset['cursor'] ?? '';
        const isField = !!t && /^(INPUT|TEXTAREA|LABEL)$/.test(t.tagName);
        cl.toggle('hover', !!t && !text && !isField);
        cl.toggle('labelled', !!text);
        if (text) this.label().nativeElement.textContent = text;
      };
      const leave = () => cl.remove('live');
      const down = () => cl.add('down');
      const up = () => cl.remove('down');
      this.doc.addEventListener('pointermove', move, { passive: true });
      this.doc.documentElement.addEventListener('pointerleave', leave);
      this.doc.addEventListener('pointerdown', down);
      this.doc.addEventListener('pointerup', up);
      this.cleanup.push(() => {
        this.doc.removeEventListener('pointermove', move);
        this.doc.documentElement.removeEventListener('pointerleave', leave);
        this.doc.removeEventListener('pointerdown', down);
        this.doc.removeEventListener('pointerup', up);
      });

      const loop = () => {
        rx += (mx - rx) * 0.16; ry += (my - ry) * 0.16;
        this.dot().nativeElement.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
        this.ring().nativeElement.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
        this.raf = requestAnimationFrame(loop);
      };
      this.raf = requestAnimationFrame(loop);
    });
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.raf);
    this.cleanup.forEach(fn => fn());
    this.doc.documentElement.classList.remove('has-cursor');
  }
}
