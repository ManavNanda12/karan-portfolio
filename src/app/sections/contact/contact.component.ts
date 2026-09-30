import { ChangeDetectionStrategy, Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { SITE } from '../../data/portfolio.data';
import { EASE, MotionService } from '../../shared/motion.service';
import { MagneticDirective, RevealDirective } from '../../shared/motion.directives';
import { DraftComponent } from '../../shared/ui.components';

@Component({
  selector: 'app-contact',
  imports: [RevealDirective, MagneticDirective, DraftComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css',
})
export class ContactComponent {
  private readonly motion = inject(MotionService);
  readonly site = SITE;
  readonly email = SITE.contactEmail.trim();
  readonly num = SITE.showBeyond ? '07' : '06';
  readonly drafts = SITE.showDraftMarkers;

  readonly sending = signal(false);
  readonly sent = signal(false);
  readonly error = signal(false);

  private readonly success = viewChild<ElementRef<HTMLElement>>('success');

  async submit(e: SubmitEvent) {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    if (!form.checkValidity()) { form.reportValidity(); return; }
    const data = Object.fromEntries(new FormData(form));
    this.sending.set(true);
    this.error.set(false);
    const endpoint = SITE.formEndpoint.trim();
    try {
      // Integration point: POST to SITE.formEndpoint when set; otherwise simulate.
      if (endpoint) {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error(String(res.status));
      } else {
        await new Promise(r => setTimeout(r, 1400));
      }
      this.sent.set(true);
      requestAnimationFrame(() => this.playSuccess());
    } catch {
      this.error.set(true);
    } finally {
      this.sending.set(false);
    }
  }

  reset() { this.sent.set(false); }

  /** Draw the ring + tick, then lift the copy in. */
  private playSuccess() {
    const el = this.success()?.nativeElement;
    if (!el || !this.motion.on) return;
    el.querySelectorAll<SVGGeometryElement>('[data-draw]').forEach((p, i) => {
      const len = parseFloat(p.style.strokeDasharray) || 150;
      p.animate([{ strokeDashoffset: len }, { strokeDashoffset: 0 }], { duration: 700, delay: 100 + i * 350, easing: EASE, fill: 'backwards' });
    });
    Array.from(el.children).slice(1).forEach((c, i) => c.animate(
      [{ opacity: 0, transform: 'translateY(14px)' }, { opacity: 1, transform: 'none' }],
      { duration: 700, delay: 350 + i * 110, easing: EASE, fill: 'backwards' }));
  }
}
