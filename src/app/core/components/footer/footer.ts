import { NgOptimizedImage } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { NAV_LINKS, SOCIAL_LINKS } from '../../../shared/utils/constants';
import { AccessibilitySettingsService } from '../../services/accessibility';
import { AccessibilityModal } from "../accessibility-modal/accessibility-modal";

@Component({
  selector: 'app-footer',
  imports: [AccessibilityModal, NgOptimizedImage],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
  host: { role: 'contentinfo', class: 'footer' },
})
export class Footer {
  protected accessibilityService: AccessibilitySettingsService = inject(AccessibilitySettingsService);

  protected navLinks = NAV_LINKS;
  protected socialLinks = SOCIAL_LINKS;
  protected currentYear = new Date().getFullYear();

  protected shouldLoadModal = signal(false);

  openAccessibilitySettings(): void {
    this.accessibilityService.openModal();
  }
}
