import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ServiceWorkerService {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  /**
   * Check if service worker is supported and registered
   */
  isSupported(): boolean {
    return this.isBrowser && 'serviceWorker' in navigator;
  }

  /**
   * Get registration status
   */
  async getRegistration(): Promise<ServiceWorkerRegistration | undefined> {
    if (!this.isSupported()) return undefined;
    return navigator.serviceWorker.getRegistration();
  }

  /**
   * Manually update service worker
   */
  async update(): Promise<void> {
    const registration = await this.getRegistration();
    if (registration) {
      await registration.update();
    }
  }

  /**
   * Unregister service worker (for development/testing)
   */
  async unregister(): Promise<void> {
    const registration = await this.getRegistration();
    if (registration) {
      await registration.unregister();
    }
  }
}
