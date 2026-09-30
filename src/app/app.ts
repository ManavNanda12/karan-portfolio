import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SITE } from './data/portfolio.data';
import { BackToTopComponent } from './layout/back-to-top.component';
import { CursorComponent } from './layout/cursor.component';
import { FooterComponent } from './layout/footer.component';
import { HeaderComponent } from './layout/header.component';
import { PreloaderComponent } from './layout/preloader.component';
import { AboutComponent } from './sections/about.component';
import { BeyondComponent } from './sections/beyond.component';
import { CertificationsComponent } from './sections/certifications/certifications.component';
import { ContactComponent } from './sections/contact/contact.component';
import { ExperienceComponent } from './sections/experience.component';
import { HeroComponent } from './sections/hero/hero.component';
import { InterestsComponent } from './sections/interests.component';
import { JourneyComponent } from './sections/journey/journey.component';
import { MarqueeComponent } from './sections/marquee.component';

@Component({
  selector: 'app-root',
  imports: [
    PreloaderComponent, CursorComponent, HeaderComponent, BackToTopComponent, FooterComponent,
    HeroComponent, MarqueeComponent, AboutComponent, ExperienceComponent, JourneyComponent,
    CertificationsComponent, InterestsComponent, BeyondComponent, ContactComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.html',
})
export class App {
  readonly showBeyond = SITE.showBeyond;
}
