import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FOOTER_LINKS, SITE, SOCIALS } from '../data/portfolio.data';
import { MotionService } from '../shared/motion.service';
import { MagneticDirective, RevealDirective } from '../shared/motion.directives';

@Component({
  selector: 'app-footer',
  imports: [RevealDirective, MagneticDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer class="ftr">
      <div class="container">
        <div class="top">
          <div reveal class="brand">
            <a href="#top" class="logo" (click)="go('top', $event)">
              <span class="mark">{{ site.monogram }}</span>
              <span class="name">{{ site.name }}</span>
            </a>
            <p class="tagline">Analytical Thinking. Global Perspective. <em>Meaningful Impact.</em></p>
            <p class="role">Senior Analyst · Risk Consulting at EY</p>
          </div>

          <nav reveal [revealDelay]="80" class="col" aria-label="Footer">
            <span class="col-title">Explore</span>
            <div class="links">
              @for (l of links; track l.id) {
                <a [href]="'#' + l.id" (click)="go(l.id, $event)"><span class="dash" aria-hidden="true"></span>{{ l.label }}</a>
              }
            </div>
          </nav>

          <div reveal [revealDelay]="160" class="col">
            <span class="col-title">Connect</span>
            <div class="socials">
              @for (s of socials; track s.id) {
                <a [href]="s.href" [attr.target]="s.id === 'email' ? null : '_blank'" rel="noopener noreferrer"
                   class="social" [attr.aria-label]="s.label" [attr.data-cursor]="s.label" magnetic="0.35">
                  @switch (s.id) {
                    @case ('linkedin') {
                      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.75h4v11H3zM9.5 9.75h3.8v1.5h.06c.53-1 1.83-2.06 3.77-2.06 4.03 0 4.77 2.65 4.77 6.1v5.46h-4v-4.84c0-1.16-.02-2.64-1.61-2.64-1.61 0-1.86 1.26-1.86 2.56v4.92h-4z"/></svg>
                    }
                    @case ('email') {
                      <svg viewBox="0 0 24 24" aria-hidden="true" class="stroke"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 6.5 8.5 6.5 8.5-6.5"/></svg>
                    }
                    @case ('instagram') {
                      <svg viewBox="0 0 24 24" aria-hidden="true" class="stroke"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".6" fill="currentColor"/></svg>
                    }
                    @case ('x') {
                      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17.75 3h3.07l-6.7 7.66L22 21h-6.17l-4.83-6.32L5.47 21H2.4l7.17-8.2L2 3h6.33l4.37 5.78zm-1.08 16.2h1.7L7.4 4.73H5.58z"/></svg>
                    }
                  }
                </a>
              }
            </div>
            <a [href]="site.linkedin" target="_blank" rel="noopener" class="cta">Let's connect on LinkedIn <span aria-hidden="true">↗</span></a>
            <span class="loc">{{ site.location }}</span>
          </div>
        </div>

        <div class="bottom">
          <span>© {{ year }} {{ site.name }}. All rights reserved.</span>
          <span>Personal website · Not affiliated with or endorsed by EY</span>
        </div>
      </div>
    </footer>
  `,
  styles: `
    .ftr {
      position: relative; background: var(--deep); color: var(--on-deep); overflow: hidden;
      padding: clamp(64px, 7vw, 96px) 0 28px;
    }
    /* Gold hairline + soft glow along the top edge */
    .ftr::before {
      content: ''; position: absolute; left: 0; right: 0; top: 0; height: 1px;
      background: linear-gradient(90deg, transparent, var(--gold), transparent);
    }
    .ftr::after {
      content: ''; position: absolute; left: 50%; top: -220px; width: 700px; height: 320px; translate: -50% 0;
      background: radial-gradient(closest-side, rgba(184,154,98,.16), transparent); pointer-events: none;
    }
    .top {
      position: relative; display: grid; grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr) minmax(0, 1fr);
      gap: 48px; padding-bottom: 48px;
    }

    .logo { display: inline-flex; align-items: center; gap: 14px; text-decoration: none; color: var(--on-deep); }
    .mark {
      width: 46px; height: 46px; border-radius: 50%; border: 1px solid var(--gold); display: grid; place-items: center;
      font-family: var(--serif); font-style: italic; font-size: 19px; transition: transform .8s var(--ease), background-color .4s, color .4s;
    }
    .logo:hover .mark { transform: rotate(360deg); background: var(--gold-soft); color: var(--deep-fixed); }
    .name { font-family: var(--serif); font-size: 26px; font-weight: 300; letter-spacing: -.01em; }
    .tagline { margin: 22px 0 0; max-width: 26em; font-family: var(--serif); font-size: 19px; line-height: 1.45; color: rgba(246,242,234,.85); }
    .tagline em { color: var(--gold-soft); }
    .role { margin: 12px 0 0; font-family: var(--mono); font-size: 11px; letter-spacing: .14em; text-transform: uppercase; color: var(--mist); }

    .col { display: flex; flex-direction: column; gap: 18px; align-items: flex-start; }
    .col-title { font-family: var(--mono); font-size: 11px; letter-spacing: .16em; text-transform: uppercase; color: var(--gold-soft); }
    .links { display: grid; grid-template-columns: repeat(2, auto); gap: 12px 36px; }
    .links a {
      display: inline-flex; align-items: center; gap: 0; color: rgba(246,242,234,.8); text-decoration: none; font-size: 15px;
      transition: color .3s, gap .4s var(--ease);
    }
    .dash { width: 0; height: 1px; background: var(--gold); transition: width .4s var(--ease); }
    .links a:hover { color: var(--on-deep); gap: 8px; }
    .links a:hover .dash { width: 14px; }

    .socials { display: flex; flex-wrap: wrap; gap: 10px; }
    .social {
      position: relative; width: 46px; height: 46px; border-radius: 50%; display: grid; place-items: center; overflow: hidden;
      border: 1px solid rgba(217,195,152,.35); color: var(--on-deep); isolation: isolate;
      transition: color .4s, border-color .4s;
    }
    .social::before {
      content: ''; position: absolute; inset: 0; z-index: -1; border-radius: inherit; background: var(--gold-soft);
      transform: scale(0); transition: transform .45s var(--ease);
    }
    .social:hover { color: var(--deep-fixed); border-color: var(--gold-soft); }
    .social:hover::before { transform: scale(1); }
    .social svg { width: 18px; height: 18px; fill: currentColor; }
    .social svg.stroke { fill: none; stroke: currentColor; stroke-width: 1.6; stroke-linecap: round; stroke-linejoin: round; }

    .cta {
      margin-top: 4px; color: var(--on-deep); text-decoration: none; font-size: 15px; padding-bottom: 3px;
      background-image: linear-gradient(var(--gold-soft), var(--gold-soft)); background-repeat: no-repeat;
      background-position: left bottom; background-size: 100% 1px; transition: background-size .4s var(--ease);
    }
    .cta:hover { background-size: 0% 1px; color: var(--on-deep); }
    .loc { font-size: 14px; color: var(--mist); }

    .bottom {
      position: relative; display: flex; flex-wrap: wrap; justify-content: space-between; gap: 10px 32px;
      padding-top: 24px; border-top: 1px solid rgba(246,242,234,.12);
      font-family: var(--mono); font-size: 11px; letter-spacing: .08em; text-transform: uppercase; color: var(--mist);
    }

    @media (max-width: 900px) {
      .top { grid-template-columns: 1fr 1fr; }
      .brand { grid-column: 1 / -1; }
    }
    @media (max-width: 560px) {
      .top { grid-template-columns: 1fr; gap: 36px; }
      .bottom { flex-direction: column; }
    }
  `,
})
export class FooterComponent {
  private readonly motion = inject(MotionService);
  readonly site = SITE;
  readonly links = FOOTER_LINKS;
  readonly socials = SOCIALS.filter(s => s.href);
  readonly year = new Date().getFullYear();

  go(id: string, e?: Event) { e?.preventDefault(); this.motion.scrollTo(id); }
}
