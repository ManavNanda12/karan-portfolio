import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CAREER, EY_HIGHLIGHTS, EY_RESPONSIBILITIES, FOCUS_AREAS, PREVIOUS_EXPERIENCE } from '../data/portfolio.data';
import { DraftComponent } from '../shared/ui.components';
import { ParallaxDirective, RevealDirective, TiltDirective } from '../shared/motion.directives';

@Component({
  selector: 'app-experience',
  imports: [RevealDirective, ParallaxDirective, TiltDirective, DraftComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="experience" class="section exp on-dark">
      <div class="watermark" aria-hidden="true"><span parallax="0.18">EY</span></div>
      <div class="container rel">
        <div reveal class="eyebrow"><span>02</span><span class="rule"></span><span>Experience</span></div>
        <h2 class="h2"><span class="mask-line"><span reveal="mask">Professional Experience</span></span></h2>

        <div reveal class="exp-grid">
          <div class="exp-main">
            <div class="ey">{{ career.company }}</div>
            <div class="role">{{ career.practice }}</div>
            <dl class="facts">
              <div>
                <dt>Position</dt>
                <dd><span>{{ career.title }} <span class="promo">Promoted</span></span></dd>
              </div>
              <div><dt>Location</dt><dd>{{ career.location }}</dd></div>
              <div><dt>Period</dt><dd>{{ career.period }}</dd></div>
            </dl>

            <!-- Career track: joined → promoted -->
            <ol reveal class="track" aria-label="Career milestones">
              @for (m of career.milestones; track m.date; let last = $last) {
                <li class="ms" [class.ms--now]="last">
                  <span class="ms-dot" aria-hidden="true"></span>
                  <span class="ms-date">{{ m.date }}</span>
                  <span class="ms-label">{{ m.label }}</span>
                  <span class="ms-detail">{{ m.detail }}</span>
                </li>
              }
            </ol>
          </div>
          <div class="exp-focus">
            <div class="mono-label">Areas of professional focus</div>
            <ol class="focus">
              @for (f of focus; track f; let i = $index) {
                <li reveal [revealDelay]="i * 60">
                  <span class="num">0{{ i + 1 }}</span><span class="txt">{{ f }}</span><span class="go" aria-hidden="true">→</span>
                </li>
              }
            </ol>
          </div>
        </div>

        <!-- Role detail: client names are confidential and intentionally omitted -->
        <div class="detail">
          <div reveal class="d-card" tilt="4">
            <div class="d-head"><span class="mono-label gold">At EY</span><span class="d-title">Responsibilities</span></div>
            <ul class="d-list">
              @for (r of responsibilities; track r) { <li>{{ r }}</li> }
            </ul>
          </div>
          <div reveal [revealDelay]="100" class="d-card" tilt="4">
            <div class="d-head"><span class="mono-label gold">Highlights</span><span class="d-title">Selected achievements</span></div>
            <ul class="d-list d-list--star">
              @for (h of highlights; track h) { <li>{{ h }}</li> }
            </ul>
          </div>
          @for (x of previous; track x.company) {
            <div reveal [revealDelay]="200" class="d-card" tilt="4">
              <div class="d-head">
                <span class="mono-label gold">Previous experience</span>
                <span class="d-title">{{ x.company }} <em>· {{ x.role }}</em></span>
                @if (x.period) { <span class="mono-label">{{ x.period }}</span> }
                @else { <app-draft [dark]="true">Internship dates — to confirm</app-draft> }
              </div>
              <ul class="d-list">
                @for (pt of x.points; track pt) { <li>{{ pt }}</li> }
              </ul>
            </div>
          }
        </div>
      </div>
    </section>
  `,
  styles: `
    .exp { background: var(--deep); color: var(--on-deep); overflow: hidden; }
    .rel { position: relative; }
    .watermark {
      position: absolute; right: -4vw; top: 50%; translate: 0 -50%; pointer-events: none;
      font-family: var(--serif); font-weight: 300; font-size: clamp(220px, 34vw, 520px); line-height: .8; letter-spacing: -.06em;
      color: transparent; -webkit-text-stroke: 1px rgba(217,195,152,.07); user-select: none;
    }
    .watermark span { display: block; }
    .exp-grid {
      margin-top: clamp(56px,7vw,96px); border-top: 1px solid rgba(217,195,152,.45); padding-top: 44px;
      display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 340px), 1fr)); gap: 48px clamp(40px,6vw,96px);
    }
    .exp-main { min-width: 0; display: flex; flex-direction: column; gap: 22px; }
    /* Gold light sweeps across the letters: a masked gold copy over the cream text
       (background-clip:text would expose the variable font's overlapping contours) */
    .ey {
      position: relative; width: fit-content;
      font-family: var(--serif); font-weight: 300; font-size: clamp(64px,7vw,100px); line-height: .85; letter-spacing: -.03em;
    }
    .ey::after {
      content: 'EY'; position: absolute; inset: 0; color: var(--gold-soft);
      -webkit-mask-image: linear-gradient(110deg, transparent 40%, #000 50%, transparent 60%);
      mask-image: linear-gradient(110deg, transparent 40%, #000 50%, transparent 60%);
      -webkit-mask-size: 250% 100%; mask-size: 250% 100%;
      animation: sheen 6s var(--ease) infinite;
    }
    @keyframes sheen { 0% { -webkit-mask-position: 100% 0; mask-position: 100% 0; } 45%, 100% { -webkit-mask-position: -50% 0; mask-position: -50% 0; } }
    .role { font-family: var(--serif); font-style: italic; font-size: 24px; color: var(--gold-soft); }
    .exp-main .facts { margin-top: 12px; }
    .exp-main .facts > div { grid-template-columns: 110px minmax(0,1fr); padding: 14px 0; }
    .exp-main .facts dd { font-size: 17px; }

    .promo {
      display: inline-block; margin-left: 10px; vertical-align: 2px; font-family: var(--mono); font-size: 10px; letter-spacing: .12em;
      text-transform: uppercase; color: var(--deep-fixed); background: var(--gold-soft); border-radius: 999px; padding: 3px 9px;
    }
    /* Joined → promoted track: the gold line draws in, the current milestone pulses */
    .track { position: relative; list-style: none; margin: 8px 0 0; padding: 0; display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    .track::before {
      content: ''; position: absolute; left: 6px; right: 40%; top: 6px; height: 1px;
      background: linear-gradient(90deg, var(--gold), var(--gold-soft)); transform-origin: left;
      transform: scaleX(0); transition: transform 1.6s var(--ease) .5s;
    }
    .track.is-revealed::before { transform: none; }
    .ms { position: relative; display: flex; flex-direction: column; gap: 6px; padding-top: 26px; }
    .ms-dot { position: absolute; left: 0; top: 0; width: 13px; height: 13px; border-radius: 50%; background: var(--deep); border: 1px solid var(--gold); }
    .ms--now .ms-dot { background: var(--gold); box-shadow: 0 0 0 6px rgba(184,154,98,.18); }
    .ms--now .ms-dot::after { content: ''; position: absolute; inset: -1px; border-radius: 50%; border: 1px solid var(--gold); animation: ms-ring 2s ease-out infinite; }
    @keyframes ms-ring { to { transform: scale(3); opacity: 0; } }
    .ms-date { font-family: var(--mono); font-size: 11px; letter-spacing: .14em; text-transform: uppercase; color: var(--gold-soft); }
    .ms-label { font-family: var(--serif); font-size: 20px; line-height: 1.2; }
    .ms-detail { font-size: 14px; color: var(--mist); }
    .exp-focus { min-width: 0; }
    .focus { list-style: none; margin: 20px 0 0; padding: 0; display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 240px), 1fr)); column-gap: 40px; }
    .focus li {
      position: relative; display: flex; gap: 18px; align-items: baseline; padding: 20px 0;
      border-bottom: 1px solid rgba(246,242,234,.14);
    }
    .focus li::after {
      content: ''; position: absolute; left: 0; right: 0; bottom: -1px; height: 1px; background: var(--gold);
      transform: scaleX(0); transform-origin: left; transition: transform .6s var(--ease);
    }
    .focus li:hover::after { transform: scaleX(1); }
    .num { font-family: var(--mono); font-size: 11px; color: var(--gold-soft); transition: transform .5s var(--ease); }
    .txt { flex: 1; font-family: var(--serif); font-size: 19px; line-height: 1.3; transition: transform .5s var(--ease), color .4s; }
    .go { color: var(--gold-soft); opacity: 0; transform: translateX(-8px); transition: opacity .4s, transform .5s var(--ease); }
    .focus li:hover .txt { transform: translateX(8px); color: var(--gold-pale); }
    .focus li:hover .go { opacity: 1; transform: none; }

    .detail { margin-top: 64px; display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px), 1fr)); gap: 16px; }
    .d-card {
      position: relative; padding: 30px; display: flex; flex-direction: column; gap: 22px;
      border: 1px solid rgba(217,195,152,.22); transition: transform .45s var(--ease), border-color .4s;
      background: radial-gradient(320px circle at var(--mx, 50%) var(--my, 0%), rgba(217,195,152,.1), transparent 70%);
    }
    .d-card:hover { border-color: var(--gold-soft); }
    .d-head { display: flex; flex-direction: column; gap: 10px; align-items: flex-start; }
    .d-title { font-family: var(--serif); font-size: 24px; line-height: 1.2; }
    .d-title em { color: var(--gold-soft); }
    .d-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 14px; }
    .d-list li { position: relative; padding-left: 22px; font-size: 15px; line-height: 1.6; color: rgba(246,242,234,.82); }
    .d-list li::before { content: ''; position: absolute; left: 0; top: .8em; width: 10px; height: 1px; background: var(--gold); }
    .d-list--star li::before { content: '✦'; width: auto; height: auto; top: 0; background: none; color: var(--gold); font-size: 12px; }    .gold { color: var(--gold-soft) !important; letter-spacing: .06em; }
  `,
})
export class ExperienceComponent {
  readonly career = CAREER;
  readonly focus = FOCUS_AREAS;
  readonly responsibilities = EY_RESPONSIBILITIES;
  readonly highlights = EY_HIGHLIGHTS;
  readonly previous = PREVIOUS_EXPERIENCE;
}
