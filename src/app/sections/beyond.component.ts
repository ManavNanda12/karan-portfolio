import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BEYOND } from '../data/portfolio.data';
import { ParallaxDirective, RevealDirective } from '../shared/motion.directives';
import { PhotoComponent } from '../shared/ui.components';

@Component({
  selector: 'app-beyond',
  imports: [RevealDirective, ParallaxDirective, PhotoComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="beyond" class="beyond">
      <div class="container inner">
        <div class="copy">
          <div reveal class="eyebrow"><span>06</span><span class="rule"></span><span>Beyond the Office</span></div>
          <h2 class="h2 title mask-line"><span reveal="mask">Beyond the Office</span></h2>
          <p reveal class="body-copy">{{ body }}</p>
        </div>
        <div class="photos">
          @for (p of photos; track p.caption; let i = $index) {
            <figure class="ph" [class.ph--low]="i === 1">
              <div class="ph-move" [parallax]="i === 1 ? -0.05 : 0.04">
                <div reveal="clip" [revealDelay]="i * 120" class="ph-frame" data-cursor="View">
                  <app-photo [src]="p.src" placeholder="Personal photo" />
                </div>
                <figcaption class="mono-label">{{ p.caption }}</figcaption>
              </div>
            </figure>
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
    .photos { min-width: 0; display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 12px; align-items: start; }
    .ph { margin: 0; min-width: 0; }
    .ph--low { margin-top: clamp(24px,4vw,56px); }
    .ph-frame { aspect-ratio: 3/4; overflow: hidden; background: var(--sand); }
    .ph-frame:hover ::ng-deep img { transform: scale(1.06); }
    figcaption { margin-top: 10px; }
  `,
})
export class BeyondComponent {
  readonly body = BEYOND.body;
  readonly photos = BEYOND.photos;
}
