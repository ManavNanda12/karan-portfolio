import { ChangeDetectionStrategy, Component, OnDestroy, effect, inject, signal } from '@angular/core';
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
export class HeroComponent implements OnDestroy {
  private readonly motion = inject(MotionService);

  readonly site = SITE;
  readonly stats = HERO_STATS;
  readonly portraitSrc = PHOTOS.portrait;
  readonly resume = SITE.resumeUrl.trim();
  readonly role = signal(this.motion.on ? '' : HERO_ROLES[0]);


  private typeTimer: ReturnType<typeof setTimeout> | undefined;

  constructor() {
    // Start typing once the preloader has lifted
    effect(() => {
      if (this.motion.introDone() && this.motion.on) this.typeTimer = setTimeout(() => this.type(0, 0, false), 1200);
    });
  }

  ngOnDestroy() {
    clearTimeout(this.typeTimer);
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

}
