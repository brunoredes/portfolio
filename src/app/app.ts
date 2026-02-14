import { Component, effect, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CookieModal } from './components/cookie-modal/cookie-modal';
import { CookieConsent } from './services/cookie-consent';
import { Ga } from './services/ga';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CookieModal],
  template: `<router-outlet /><app-cookie-modal />`,
})
export class App {
  private cookieConsent = inject(CookieConsent);
  private analytics = inject(Ga);

  constructor() {
    effect(() => {
      if (this.cookieConsent.isAnalyticsEnabled()) {
        this.analytics.initialize();
      }
    });
  }
}
