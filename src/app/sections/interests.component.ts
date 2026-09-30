import { ChangeDetectionStrategy, Component } from '@angular/core';
import { INTERESTS } from '../data/portfolio.data';
import { RevealDirective, TiltDirective } from '../shared/motion.directives';

@Component({
  selector: 'app-interests',
  imports: [RevealDirective, TiltDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="interests" class="section">
      <div class="container">
        <div reveal class="eyebrow"><span>05</span><span class="rule"></span><span>Interests</span></div>
        <h2 class="h2"><span class="mask-line"><span reveal="mask">Professional Interests</span></span></h2>
        <div class="grid">
          @for (it of items; track it.title; let i = $index) {
            <div reveal [revealDelay]="(i % 3) * 80" class="card" tilt="0">
              <span class="fill" aria-hidden="true"></span>
              <div class="card-top">
                <span class="num">0{{ i + 1 }}</span>
                <span class="arrow" aria-hidden="true">↗</span>
              </div>
              <h3>{{ it.title }}</h3>
              <p>{{ it.body }}</p>
            </div>
          }
        </div>
      </div>
    </section>
  `,
  styles: `
    .grid { margin-top: 56px; display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 320px), 1fr)); gap: 16px; }
    .card {
      position: relative; isolation: isolate; overflow: hidden; display: flex; flex-direction: column; gap: 18px;
      min-height: 230px; padding: 30px; border: 1px solid rgba(var(--ink-rgb),.12); color: var(--navy);
      transition: color .5s var(--ease), border-color .5s;
    }
    /* Navy ink spreads from wherever the pointer entered, retracts toward where it left */
    .fill {
      position: absolute; inset: 0; z-index: -1; background: var(--deep);
      clip-path: circle(0% at var(--ex, 50%) var(--ey, 50%)); transition: clip-path .75s var(--ease);
    }
    .card:hover { color: var(--on-deep); border-color: var(--deep); }
    .card:hover .fill { clip-path: circle(150% at var(--ex, 50%) var(--ey, 50%)); }
    .card-top { display: flex; justify-content: space-between; align-items: center; }
    .num { font-family: var(--mono); font-size: 12px; letter-spacing: .14em; color: var(--gold); }
    .arrow {
      width: 40px; height: 40px; border-radius: 50%; border: 1px solid rgba(184,154,98,.5); display: grid; place-items: center;
      color: var(--gold); transform: rotate(-45deg) scale(.8); opacity: 0; transition: transform .6s var(--ease), opacity .4s;
    }
    .card:hover .arrow { transform: none; opacity: 1; }
    h3 {
      margin: auto 0 0; font-family: var(--serif); font-weight: 400; font-size: 26px; line-height: 1.15; letter-spacing: -.015em;
      transition: transform .6s var(--ease);
    }
    .card:hover h3 { transform: translateX(6px); }
    p { margin: 0; font-size: 16px; line-height: 1.6; opacity: .82; }
  `,
})
export class InterestsComponent {
  readonly items = INTERESTS;
}
