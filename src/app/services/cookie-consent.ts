import { isPlatformBrowser } from '@angular/common';
import { computed, effect, Injectable, inject, PLATFORM_ID, signal } from '@angular/core';

export type ConsentStatus = 'pending' | 'accepted' | 'rejected';

export interface CookiePreferences {
  analytics: boolean;
  marketing?: boolean;
  preferences?: boolean;
}

const STORAGE_KEY = 'cookie-consent';
const PREFERENCES_KEY = 'cookie-preferences';

@Injectable({
  providedIn: 'root',
})
export class CookieConsent {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  // Consent status signal
  private _consentStatus = signal<ConsentStatus>(this.loadConsentStatus());
  public consentStatus = computed(() => this._consentStatus());

  // Cookie preferences signal
  private _preferences = signal<CookiePreferences>(this.loadPreferences());
  public preferences = computed(() => this._preferences());

  // UI state
  private _showBanner = signal<boolean>(this.shouldShowBanner());
  public showBanner = computed(() => this._showBanner());

  constructor() {
    // Save preferences whenever they change
    effect(() => {
      if (this.isBrowser) {
        const status = this._consentStatus();
        if (status !== 'pending') {
          localStorage.setItem(STORAGE_KEY, status);
          localStorage.setItem(PREFERENCES_KEY, JSON.stringify(this._preferences()));
        }
      }
    });
  }

  /**
   * Accept all cookies
   */
  acceptAll(): void {
    this._consentStatus.set('accepted');
    this._preferences.set({
      analytics: true,
      marketing: true,
      preferences: true,
    });
    this._showBanner.set(false);
  }

  /**
   * Reject all cookies (only essential)
   */
  rejectAll(): void {
    this._consentStatus.set('rejected');
    this._preferences.set({
      analytics: false,
      marketing: false,
      preferences: false,
    });
    this._showBanner.set(false);
  }

  /**
   * Set custom preferences
   */
  setPreferences(preferences: CookiePreferences): void {
    this._consentStatus.set('accepted');
    this._preferences.set(preferences);
    this._showBanner.set(false);
  }

  /**
   * Reset consent (show banner again)
   */
  resetConsent(): void {
    if (this.isBrowser) {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(PREFERENCES_KEY);
    }
    this._consentStatus.set('pending');
    this._preferences.set({
      analytics: false,
      marketing: false,
      preferences: false,
    });
    this._showBanner.set(true);
  }

  /**
   * Check if analytics is enabled
   */
  isAnalyticsEnabled(): boolean {
    return this._consentStatus() === 'accepted' && this._preferences().analytics;
  }

  /**
   * Load consent status from storage
   */
  private loadConsentStatus(): ConsentStatus {
    if (!this.isBrowser) return 'pending';

    const stored = localStorage.getItem(STORAGE_KEY);
    return (stored as ConsentStatus) || 'pending';
  }

  /**
   * Load preferences from storage
   */
  private loadPreferences(): CookiePreferences {
    if (!this.isBrowser) {
      return { analytics: false, marketing: false, preferences: false };
    }

    try {
      const stored = localStorage.getItem(PREFERENCES_KEY);
      return stored ? JSON.parse(stored) : { analytics: false, marketing: false, preferences: false };
    } catch {
      return { analytics: false, marketing: false, preferences: false };
    }
  }

  /**
   * Determine if banner should be shown
   */
  private shouldShowBanner(): boolean {
    return this.loadConsentStatus() === 'pending';
  }
}
