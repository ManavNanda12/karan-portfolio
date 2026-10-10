import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BEYOND } from '../data/portfolio.data';
import { RevealDirective } from '../shared/motion.directives';

@Component({
  selector: 'app-beyond',
  imports: [RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="beyond" class="beyond">
      <div class="container inner">
        <div class="copy">
          <div reveal class="eyebrow"><span>06</span><span class="rule"></span><span>Beyond the Office</span></div>
          <h2 class="h2 title mask-line"><span reveal="mask">Beyond the Office</span></h2>
          <p reveal class="body-copy">{{ body }}</p>
        </div>
        <div class="activities" aria-label="Activities outside the classroom">
          @for (activity of activities; track activity; let i = $index) {
            <article reveal class="activity-card" [class.activity-card--middle]="i === 1">
              <span class="activity-index">0{{ i + 1 }}</span>
              <span class="activity-mark" aria-hidden="true"></span>
              <h3>{{ activity }}</h3>
              <span class="activity-rule" aria-hidden="true"></span>
            </article>
          }
        </div>
      </div>
    </section>
  `,
  styles: `
    .beyond { padding: 0 0 clamp(72px,9vw,130px); }
    .inner {
      padding-top: clamp(70px,9vw,120px); border-top: 1px solid rgba(var(--ink-rgb),.1);
      display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 340px), 1fr)); gap: clamp(40px,6vw,96px); align-items: start;
    }
    .copy { min-width: 0; display: flex; flex-direction: column; gap: 24px; }
    .title { margin-top: 4px; font-style: italic; }
    .copy .body-copy { max-width: 30em; }
    .activities { min-width: 0; display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 12px; align-items: start; }
    .activity-card {
      position: relative; isolation: isolate; min-width: 0; min-height: clamp(210px, 22vw, 290px); overflow: hidden;
      display: flex; flex-direction: column; justify-content: space-between; padding: clamp(16px, 2vw, 26px);
      border: 1px solid rgba(var(--ink-rgb),.12); background: var(--paper); transition: transform .5s var(--ease), border-color .4s ease, background-color .4s ease;
    }
    .activity-card::before {
      content: ''; position: absolute; z-index: -1; width: 170px; aspect-ratio: 1; right: -62px; top: 34px;
      border: 1px solid rgba(184,154,98,.25); border-radius: 50%; box-shadow: 0 0 0 18px rgba(184,154,98,.045), 0 0 0 38px rgba(184,154,98,.035);
      transition: transform .6s var(--ease);
    }
    .activity-card:hover { transform: translateY(-6px); border-color: rgba(184,154,98,.55); }
    .activity-card:hover::before { transform: scale(1.08); }
    .activity-card--middle { margin-top: clamp(20px, 3vw, 42px); }
    .activity-index { font-family: var(--mono); font-size: 11px; letter-spacing: .14em; color: var(--gold-deep); }
    .activity-mark { width: 8px; height: 8px; margin-top: auto; margin-bottom: 16px; border-radius: 50%; background: var(--gold); box-shadow: 0 0 0 6px rgba(184,154,98,.12); }
    .activity-card h3 { position: relative; margin: 0; font-family: var(--serif); font-size: clamp(17px, 1.65vw, 22px); line-height: 1.05; font-weight: 400; letter-spacing: -.035em; white-space: nowrap; }
    .activity-rule { width: 34px; height: 1px; margin-top: 18px; background: var(--gold); }
    @media (max-width: 700px) {
      .activities { grid-template-columns: repeat(2, minmax(0,1fr)); }
      .activity-card { min-height: 210px; }
      .activity-card--middle { margin-top: 0; }
      .activity-card:last-child { grid-column: 1 / -1; min-height: 170px; }
    }
    @media (max-width: 420px) { .activities { grid-template-columns: 1fr; } .activity-card:last-child { grid-column: auto; } }
    @media (min-width: 701px) and (max-width: 1000px) {
      .activities { grid-template-columns: 1fr; }
      .activity-card { min-height: 150px; }
      .activity-card--middle { margin-top: 0; }
      .activity-card h3 { font-size: clamp(20px, 2.8vw, 26px); }
    }
  `,
})
export class BeyondComponent {
  readonly body = BEYOND.body;
  readonly activities = BEYOND.activities;
}
