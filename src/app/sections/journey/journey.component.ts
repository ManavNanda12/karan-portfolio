import {
  AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnDestroy, inject, viewChild,
} from '@angular/core';
import { CHAPTERS } from '../../data/portfolio.data';
import { MotionService } from '../../shared/motion.service';
import { ParallaxDirective, RevealDirective } from '../../shared/motion.directives';
import { DraftComponent, PhotoComponent } from '../../shared/ui.components';

@Component({
  selector: 'app-journey',
  imports: [RevealDirective, ParallaxDirective, PhotoComponent, DraftComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './journey.component.html',
  styleUrl: './journey.component.css',
})
export class JourneyComponent implements AfterViewInit, OnDestroy {
  private readonly motion = inject(MotionService);
  readonly chapters = CHAPTERS;

  private readonly tl = viewChild.required<ElementRef<HTMLElement>>('tl');
  private readonly fill = viewChild.required<ElementRef<HTMLElement>>('fill');
  private off?: () => void;

  ngAfterViewInit() {
    const tl = this.tl().nativeElement, fill = this.fill().nativeElement;
    const chapters = Array.from(tl.querySelectorAll<HTMLElement>('.ch'));
    this.off = this.motion.onFrame((_, vh) => {
      const r = tl.getBoundingClientRect(), line = vh * 0.62;
      fill.style.transform = `scaleY(${Math.min(1, Math.max(0, (line - r.top) / r.height))})`;
      chapters.forEach(ch => {
        const m = ch.querySelector('.marker')!;
        ch.classList.toggle('is-on', m.getBoundingClientRect().top < line);
      });
    });
  }

  ngOnDestroy() { this.off?.(); }
}
