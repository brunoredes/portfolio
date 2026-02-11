import { Component, inject, signal } from '@angular/core';
import { AccessibilityModal } from "../../components/accessibility-modal/accessibility-modal";
import { AccessibilitySettingsService } from '../../services/accessibility';
import { NAV_LINKS, SOCIAL_LINKS } from '../../shared/utils/constants';

@Component({
  selector: 'app-footer',
  imports: [AccessibilityModal],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
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
