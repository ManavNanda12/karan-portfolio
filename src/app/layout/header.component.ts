import {
  ChangeDetectionStrategy, Component, ElementRef, OnDestroy, OnInit, inject, signal, viewChild,
} from '@angular/core';
import { NAV, SITE } from '../data/portfolio.data';
import { MotionService } from '../shared/motion.service';
import { ThemeService } from '../shared/theme.service';
import { MagneticDirective } from '../shared/motion.directives';

@Component({
  selector: 'app-header',
  imports: [MagneticDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit, OnDestroy {
  private readonly motion = inject(MotionService);
  readonly theme = inject(ThemeService);
  readonly nav = NAV;
  readonly site = SITE;
  readonly menuOpen = signal(false);
  readonly active = signal('');
  readonly scrolled = signal(false);
  readonly hidden = signal(false);

  private readonly progress = viewChild.required<ElementRef<HTMLElement>>('progress');
  private lastY = 0;
  private off?: () => void;

  ngOnInit() {
    const ids = [...NAV.map(n => n.id), 'beyond', 'contact'];
    this.off = this.motion.onFrame((y, vh) => {
      this.scrolled.set(y > 30);
      if (this.menuOpen() || y < 480 || y < this.lastY - 3) this.hidden.set(false);
      else if (y > this.lastY + 3) this.hidden.set(true);
      this.lastY = y;

      const max = document.documentElement.scrollHeight - vh;
      this.progress().nativeElement.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;

      let current = '';
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top < vh * 0.4) current = id;
      }
      if (current === 'beyond') current = 'interests';
      this.active.set(current);
    });
  }

  ngOnDestroy() { this.off?.(); }

  go(id: string, e?: Event) {
    e?.preventDefault();
    this.menuOpen.set(false);
    this.motion.scrollTo(id);
  }

  toggleMenu() { this.menuOpen.update(v => !v); }
}
