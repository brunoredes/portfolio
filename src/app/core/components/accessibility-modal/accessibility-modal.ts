import { Component, effect, inject, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccessibilitySettingsService } from '../../services/accessibility';
import type { AccessibilitySettings } from '../../services/types/accessibility-settings';
import {CdkTrapFocus} from '@angular/cdk/a11y';

@Component({
  selector: 'app-accessibility-modal',
  imports: [FormsModule, CdkTrapFocus],
  templateUrl: './accessibility-modal.html',
  styleUrl: './accessibility-modal.css',
})
export class AccessibilityModal {
  protected accessibilityService: AccessibilitySettingsService = inject(AccessibilitySettingsService);

  closed = output<void>();

  // Local form data for ngModel
  protected formData: AccessibilitySettings = {
    fontSize: 'normal',
    highContrast: false,
    reducedMotion: false,
    linkUnderlines: false,
    focusIndicators: 'default',
    colorScheme: 'default',
    dyslexiaFont: false,
  };

  constructor() {
    // Load current settings when modal opens
    effect(() => {
      if (this.accessibilityService.isModalOpen()) {
        this.loadCurrentSettings();
        this.openDialog();
      }
    });
  }

  /**
   * Load current settings into form
   */
  private loadCurrentSettings(): void {
    // Call settings() as a function since it's a computed signal
    const currentSettings = this.accessibilityService.settings();
    this.formData = { ...currentSettings };
  }

  /**
   * Open native dialog
   */
  private openDialog(): void {
    setTimeout(() => {
      const dialog = document.getElementById('accessibility-dialog') as HTMLDialogElement;
      if (dialog && !dialog.open) {
        dialog.showModal();

        // Focus first interactive element
        const firstInput = dialog.querySelector('input, select, button') as HTMLElement;
        firstInput?.focus();
      }
    }, 0);
  }

  /**
   * Close dialog
   */
  closeDialog(): void {
    const dialog = document.getElementById('accessibility-dialog') as HTMLDialogElement;
    if (dialog) {
      dialog.close();
    }
    this.accessibilityService.closeModal();
    this.closed.emit();
  }

  /**
   * Handle form submission
   */
  onSubmit(event: Event): void {
    event.preventDefault();

    // Update settings in service
    this.accessibilityService.updateSettings(this.formData);

    // Close dialog
    this.closeDialog();
  }

  /**
   * Reset form to default settings
   */
  onReset(): void {
    const confirmReset = confirm('Restaurar todas as configurações para os valores padrão?');
    if (!confirmReset) {
      return;
    }

    // Reset service settings
    this.accessibilityService.resetSettings();

    // Reload form with new defaults
    this.loadCurrentSettings();
  }

  /**
   * Cancel and revert changes
   */
  onCancel(): void {
    // Reload saved settings
    this.loadCurrentSettings();
    this.closeDialog();
  }
}
