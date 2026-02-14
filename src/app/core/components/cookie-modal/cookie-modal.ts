import { CdkTrapFocus } from '@angular/cdk/a11y';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import type { CookiePreferences } from '../../services/cookie-consent';
import { CookieConsent } from '../../services/cookie-consent';

@Component({
  selector: 'app-cookie-modal',
  imports: [CdkTrapFocus, FormsModule],
  templateUrl: './cookie-modal.html',
  styleUrl: './cookie-modal.css',
})
export class CookieModal {
  protected cookieConsent = inject(CookieConsent);

  // Show detailed settings
  protected showSettings = signal(false);

  // Preferences form
  protected preferences = signal<CookiePreferences>({
    analytics: true,
    marketing: false,
    preferences: false,
  });

  toggleSettings(): void {
    this.showSettings.update(v => !v);
  }

  acceptAll(): void {
    this.cookieConsent.acceptAll();
  }

  rejectAll(): void {
    this.cookieConsent.rejectAll();
  }

  savePreferences(): void {
    this.cookieConsent.setPreferences(this.preferences());
  }
}
