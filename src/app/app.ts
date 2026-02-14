import { Component, effect, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CookieModal } from './core/components/cookie-modal/cookie-modal';
import { Footer } from './core/components/footer/footer';
import { Header } from "./core/components/header/header";
import { CookieConsent } from './core/services/cookie-consent';
import { Ga } from './core/services/ga';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CookieModal, Header, Footer],
  template: `
  <app-header />
  <main>
    <router-outlet />
  </main>
  <app-footer />
  <app-cookie-modal />`,
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
