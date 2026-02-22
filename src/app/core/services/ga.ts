import { isPlatformBrowser } from '@angular/common';
import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { CookieConsent } from './cookie-consent';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

@Injectable({
  providedIn: 'root',
})
export class Ga {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);
  private cookieConsent = inject(CookieConsent);

  // biome-ignore lint/complexity/useLiteralKeys: <USING .ENV VARIABLES>
  private measurementId = import.meta.env['VITE_GA_TAG']; // Replace with your GA4 Measurement ID
  private isInitialized = false;

  /**
   * Initialize Google Analytics if consent is given
   */
  initialize(): void {
    if (!this.isBrowser || this.isInitialized) return;

    // Only initialize if analytics consent is given
    if (!this.cookieConsent.isAnalyticsEnabled()) {
      console.log('GA: Analytics not enabled by user');
      return;
    }

    // Load GA script dynamically
    this.loadGoogleAnalyticsScript();
    this.isInitialized = true;

    console.log('GA: Initialized');
  }

  /**
   * Load Google Analytics script dynamically
   */
  private loadGoogleAnalyticsScript(): void {
    if (!this.isBrowser) return;

    // Load the script first (async)
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${this.measurementId}`;
    document.head.appendChild(script);

    // Initialize dataLayer - must use standard function declaration for arguments object
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      // biome-ignore lint: gtag requires the arguments object - Google's official pattern
      if (window.dataLayer) window.dataLayer.push(arguments);
    };

    // Set initial timestamp
    window.gtag('js', new Date());

    // Configure GA with consent mode
    window.gtag('config', this.measurementId, {
      anonymize_ip: true, // Anonymize IPs for privacy
      cookie_flags: 'SameSite=None;Secure', // Cookie settings
    });
  }

  /**
   * Track page view
   */
  trackPageView(url: string, title?: string): void {
    if (!this.isBrowser || !this.isInitialized) return;

    window.gtag?.('event', 'page_view', {
      page_path: url,
      page_title: title || document.title,
    });
  }

  /**
   * Track custom event
   */
  trackEvent(eventName: string, eventParams?: { [key: string]: unknown }): void {
    console.log(eventParams)
    if (!this.isBrowser || !this.isInitialized) return;

    window.gtag?.('event', eventName, eventParams);
  }

  /**
   * Update consent
   */
  updateConsent(analytics: boolean): void {
    if (!this.isBrowser) return;

    if (analytics && !this.isInitialized) {
      // User just gave consent - initialize GA
      this.initialize();
    } else if (!analytics && this.isInitialized) {
      // User revoked consent - disable GA
      window.gtag?.('consent', 'update', {
        analytics_storage: 'denied',
      });
    }
  }
}
