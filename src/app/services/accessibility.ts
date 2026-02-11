import { computed, Injectable, signal } from '@angular/core';
import type { AccessibilitySettings } from './types/accessibility-settings';

const STORAGE_KEY = 'accessibility-settings';

const DEFAULT_SETTINGS: AccessibilitySettings = {
  fontSize: 'normal',
  highContrast: false,
  reducedMotion: false,
  linkUnderlines: false,
  focusIndicators: 'default',
  colorScheme: 'default',
  dyslexiaFont: false,
};

@Injectable({
  providedIn: 'root',
})
export class AccessibilitySettingsService {
  private _isModalOpen = signal(false);

  // Settings state
  private _settings = signal<AccessibilitySettings>(this.loadSettings());

  // Public readonly signals
  public readonly isModalOpen = computed(() => this._isModalOpen());
  public readonly settings = computed(() => this._settings());

  // Computed values for easy access
  public readonly fontSizeClass = computed(() => `font-${this._settings().fontSize}`);
  public readonly shouldReduceMotion = computed(() => this._settings().reducedMotion);
  public readonly shouldShowLinkUnderlines = computed(() => this._settings().linkUnderlines);

  constructor() {
    // Apply settings on initialization
    this.applySettings(this._settings());
  }

  /**
   * Open the accessibility modal
   */
  openModal(): void {
    this._isModalOpen.set(true);
  }

  /**
   * Close the accessibility modal
   */
  closeModal(): void {
    this._isModalOpen.set(false);
  }

  /**
   * Update accessibility settings
   */
  updateSettings(settings: Partial<AccessibilitySettings>): void {
    const newSettings = { ...this._settings(), ...settings };
    this._settings.set(newSettings);
    this.saveSettings(newSettings);
    this.applySettings(newSettings);
  }

  /**
   * Reset settings to defaults
   */
  resetSettings(): void {
    this._settings.set(DEFAULT_SETTINGS);
    this.saveSettings(DEFAULT_SETTINGS);
    this.applySettings(DEFAULT_SETTINGS);
  }

  /**
   * Load settings from localStorage
   */
  private loadSettings(): AccessibilitySettings {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return { ...DEFAULT_SETTINGS, ...parsed };
      }
    } catch (error) {
      console.error('Failed to load accessibility settings:', error);
    }
    return DEFAULT_SETTINGS;
  }

  /**
   * Save settings to localStorage
   */
  private saveSettings(settings: AccessibilitySettings): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save accessibility settings:', error);
    }
  }

  /**
   * Apply settings to document
   */
  private applySettings(settings: AccessibilitySettings): void {
    const root = document.documentElement;

    // Font size
    root.classList.remove('font-normal', 'font-large', 'font-x-large');
    root.classList.add(`font-${settings.fontSize}`);

    // High contrast
    if (settings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Reduced motion
    if (settings.reducedMotion) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }

    // Link underlines
    if (settings.linkUnderlines) {
      root.classList.add('force-link-underlines');
    } else {
      root.classList.remove('force-link-underlines');
    }

    // Focus indicators
    root.classList.remove('focus-default', 'focus-enhanced');
    root.classList.add(`focus-${settings.focusIndicators}`);

    // Color scheme
    root.classList.remove('scheme-default', 'scheme-monochrome', 'scheme-deuteranopia', 'scheme-protanopia');
    root.classList.add(`scheme-${settings.colorScheme}`);

    // Dyslexia font
    if (settings.dyslexiaFont) {
      root.classList.add('dyslexia-font');
    } else {
      root.classList.remove('dyslexia-font');
    }
  }
}
