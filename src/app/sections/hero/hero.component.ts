import {
  AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, NgZone, OnDestroy, effect, inject, signal, viewChild,
} from '@angular/core';
import { HERO_ROLES, HERO_STATS, PHOTOS, SITE } from '../../data/portfolio.data';
import { MotionService } from '../../shared/motion.service';
import { CountUpDirective, MagneticDirective, RevealDirective } from '../../shared/motion.directives';
import { DraftComponent, PhotoComponent } from '../../shared/ui.components';

@Component({
  selector: 'app-hero',
  imports: [RevealDirective, MagneticDirective, CountUpDirective, PhotoComponent, DraftComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css',
})
export class HeroComponent implements AfterViewInit, OnDestroy {
  private readonly motion = inject(MotionService);
  private readonly zone = inject(NgZone);

  readonly site = SITE;
  readonly stats = HERO_STATS;
  readonly portraitSrc = PHOTOS.portrait;
  readonly resume = SITE.resumeUrl.trim();
  readonly role = signal(this.motion.on ? '' : HERO_ROLES[0]);

  private readonly section = viewChild.required<ElementRef<HTMLElement>>('section');
  private readonly portraitEl = viewChild.required<ElementRef<HTMLElement>>('portrait');
  private readonly glow = viewChild.required<ElementRef<HTMLElement>>('glow');
  private readonly liquid = viewChild.required<ElementRef<HTMLElement>>('liquid');
  private readonly turb = viewChild.required<ElementRef<SVGElement>>('turb');
  private readonly offs = viewChild.required<ElementRef<SVGElement>>('offs');
  private readonly disp = viewChild.required<ElementRef<SVGElement>>('disp');

  private typeTimer: ReturnType<typeof setTimeout> | undefined;
  private raf = 0;
  private rip = { s: 0, target: 0, x: 0, y: 0, lx: null as number | null, ly: null as number | null, idle: true };
  private cleanup: (() => void)[] = [];

  constructor() {
    // Start typing once the preloader has lifted
    effect(() => {
      if (this.motion.introDone() && this.motion.on) this.typeTimer = setTimeout(() => this.type(0, 0, false), 1200);
    });
  }

  ngAfterViewInit() {
    if (!this.motion.on) return;
    this.zone.runOutsideAngular(() => {
      this.startRipple();
      const p = this.portraitEl().nativeElement;
      const move = (e: PointerEvent) => this.onPortraitMove(e);
      const leave = () => this.onPortraitLeave();
      p.addEventListener('pointermove', move);
      p.addEventListener('pointerleave', leave);
      this.cleanup.push(() => { p.removeEventListener('pointermove', move); p.removeEventListener('pointerleave', leave); });
      if (this.motion.finePointer) this.trackPointer();
    });
  }

  ngOnDestroy() {
    clearTimeout(this.typeTimer);
    cancelAnimationFrame(this.raf);
    this.cleanup.forEach(fn => fn());
  }

  onResume(e: Event) { if (!this.resume) e.preventDefault(); }
  go(id: string, e: Event) { e.preventDefault(); this.motion.scrollTo(id); }

  /** Typewriter that cycles through the role list. */
  private type(ri: number, ci: number, deleting: boolean) {
    const word = HERO_ROLES[ri];
    ci += deleting ? -1 : 1;
    this.role.set(word.slice(0, ci));
    let wait = deleting ? 38 : 75, nextRi = ri, nextDel = deleting;
    if (!deleting && ci === word.length) { nextDel = true; wait = 2200; }
    else if (deleting && ci === 0) { nextDel = false; nextRi = (ri + 1) % HERO_ROLES.length; wait = 350; }
    this.typeTimer = setTimeout(() => this.type(nextRi, ci, nextDel), wait);
  }

  /** Background orbs + portrait frame drift with the pointer. */
  private trackPointer() {
    const sec = this.section().nativeElement;
    const move = (e: PointerEvent) => {
      const x = e.clientX / window.innerWidth - 0.5, y = e.clientY / window.innerHeight - 0.5;
      sec.style.setProperty('--px', x.toFixed(3));
      sec.style.setProperty('--py', y.toFixed(3));
    };
    window.addEventListener('pointermove', move, { passive: true });
    this.cleanup.push(() => window.removeEventListener('pointermove', move));
  }

  // ── Liquid ripple on the portrait (SVG displacement driven by pointer speed) ──
  private startRipple() {
    this.liquid().nativeElement.style.filter = 'url(#ksj-liquid)';
    const loop = (ts: number) => {
      this.raf = requestAnimationFrame(loop);
      const r = this.rip;
      r.target *= 0.93;
      r.s += (r.target - r.s) * 0.1;
      if (r.s < 0.05 && r.target < 0.05) {
        if (!r.idle) { r.idle = true; this.disp().nativeElement.setAttribute('scale', '0'); }
        return;
      }
      r.idle = false;
      const t = ts / 1000;
      this.turb().nativeElement.setAttribute('baseFrequency',
        `${(0.008 + 0.0025 * Math.sin(t * 1.1)).toFixed(5)} ${(0.015 + 0.004 * Math.cos(t * 0.8)).toFixed(5)}`);
      this.offs().nativeElement.setAttribute('dx', (r.x * 0.25).toFixed(1));
      this.offs().nativeElement.setAttribute('dy', (r.y * 0.25).toFixed(1));
      this.disp().nativeElement.setAttribute('scale', (r.s * SITE.rippleStrength).toFixed(2));
    };
    this.raf = requestAnimationFrame(loop);
  }

  private onPortraitMove(e: PointerEvent) {
    const r = this.rip;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left, y = e.clientY - rect.top;
    if (r.lx != null && r.ly != null) r.target = Math.min(34, r.target + Math.hypot(x - r.lx, y - r.ly) * 0.55);
    r.lx = x; r.ly = y; r.x = x; r.y = y;
    const g = this.glow().nativeElement;
    g.style.opacity = '1';
    g.style.background = `radial-gradient(300px circle at ${x}px ${y}px, rgba(255,246,222,0.55), rgba(255,246,222,0) 65%)`;
  }

  private onPortraitLeave() {
    this.rip.lx = null;
    this.glow().nativeElement.style.opacity = '0';
  }
}
