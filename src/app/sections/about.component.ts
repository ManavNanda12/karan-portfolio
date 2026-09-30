import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ABOUT_BODY, ABOUT_FACTS, ABOUT_LEAD } from '../data/portfolio.data';
import { RevealDirective } from '../shared/motion.directives';
import { ScrollTextComponent } from '../shared/ui.components';

@Component({
  selector: 'app-about',
  imports: [RevealDirective, ScrollTextComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="about" class="section about">
      <div class="container about-grid">
        <div class="col">
          <div reveal class="eyebrow"><span>01</span><span class="rule"></span><span>About</span></div>
          <h2 class="h2">
            <span class="mask-line"><span reveal="mask">An Analytical Mindset.</span></span>
            <span class="mask-line"><span reveal="mask" [revealDelay]="120" class="accent">A Global Outlook.</span></span>
          </h2>
          <dl reveal [revealDelay]="200" class="facts about-facts">
            @for (f of facts; track f.label) {
              <div><dt>{{ f.label }}</dt><dd>{{ f.value }}</dd></div>
            }
          </dl>
        </div>
        <div class="col copy">
          <app-scroll-text class="lead" [text]="lead" />
          @for (p of body; track $index) {
            <p reveal [revealDelay]="$index * 80" class="body-copy">{{ p }}</p>
          }
        </div>
      </div>
    </section>
  `,
  styles: `
    .about { border-top: 1px solid rgba(var(--ink-rgb),.08); }
    .about-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 400px), 1fr)); gap: clamp(40px,7vw,110px); align-items: start; }
    .col { min-width: 0; }
    .about-facts { margin-top: 56px; max-width: 440px; }
    .copy { display: flex; flex-direction: column; gap: 24px; max-width: 36em; }
    .lead {
      font-family: var(--serif); font-weight: 400; font-size: clamp(21px, 1.9vw, 27px); line-height: 1.4;
      letter-spacing: -.01em; color: var(--navy); text-wrap: pretty;
    }
  `,
})
export class AboutComponent {
  readonly facts = ABOUT_FACTS;
  readonly lead = ABOUT_LEAD;
  readonly body = ABOUT_BODY;
}
