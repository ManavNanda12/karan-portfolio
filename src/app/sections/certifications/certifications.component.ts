import {
  AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnDestroy, computed, effect, inject, signal,
  viewChild, viewChildren,
} from '@angular/core';
import { CERTS, CERT_CATEGORIES, SITE } from '../../data/portfolio.data';
import { EASE, MotionService } from '../../shared/motion.service';
import { RevealDirective, TiltDirective } from '../../shared/motion.directives';

@Component({
  selector: 'app-certifications',
  imports: [RevealDirective, TiltDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './certifications.component.html',
  styleUrl: './certifications.component.css',
})
export class CertificationsComponent implements AfterViewInit, OnDestroy {
  private readonly motion = inject(MotionService);
  readonly linkedin = SITE.linkedin;
  readonly filter = signal('All');

  readonly filters = CERT_CATEGORIES.map(label => ({
    label,
    count: label === 'All' ? CERTS.length : CERTS.filter(c => c.category === label).length,
  }));
  readonly certs = computed(() => {
    const f = this.filter();
    return CERTS.filter(c => f === 'All' || c.category === f);
  });

  private readonly grid = viewChild.required<ElementRef<HTMLElement>>('grid');
  private readonly pills = viewChildren<ElementRef<HTMLElement>>('pill');
  private readonly indicator = viewChild.required<ElementRef<HTMLElement>>('indicator');
  private ro?: ResizeObserver;
  private ready = false;

  constructor() {
    effect(() => {
      this.filter();
      if (!this.ready) return;
      // wait for the @for to re-render, then stagger the new cards in
      requestAnimationFrame(() => {
        this.moveIndicator();
        if (!this.motion.on) return;
        this.grid().nativeElement.querySelectorAll('.cert').forEach((el, i) => el.animate(
          [{ opacity: 0, transform: 'translateY(24px) scale(.98)' }, { opacity: 1, transform: 'none' }],
          { duration: 560, delay: i * 50, easing: EASE, fill: 'backwards' }));
      });
    });
  }

  ngAfterViewInit() {
    this.ready = true;
    this.moveIndicator();
    this.ro = new ResizeObserver(() => this.moveIndicator());
    this.ro.observe(this.indicator().nativeElement.parentElement!);
  }

  ngOnDestroy() { this.ro?.disconnect(); }

  select(label: string) { this.filter.set(label); }

  /** Slide the dark pill under the active filter button. */
  private moveIndicator() {
    const i = this.filters.findIndex(f => f.label === this.filter());
    const btn = this.pills()[i]?.nativeElement, ind = this.indicator().nativeElement;
    if (!btn) return;
    ind.style.width = `${btn.offsetWidth}px`;
    ind.style.height = `${btn.offsetHeight}px`;
    ind.style.transform = `translate(${btn.offsetLeft}px, ${btn.offsetTop}px)`;
  }
}
