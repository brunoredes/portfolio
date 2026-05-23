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
  <a href="#main-content" class="skip-link">Ir para o conteúdo principal</a>
  <app-header />
  <main id="main-content">
    <router-outlet />
  </main>
  <app-footer />
  <!-- Lazy load cookie banner with @defer -->
    @defer (on idle) {
      <app-cookie-modal />
    } @placeholder {
      <!-- Nothing while loading -->
    }`,
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
