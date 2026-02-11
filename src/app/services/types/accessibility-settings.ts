export interface AccessibilitySettings {
  fontSize: 'normal' | 'large' | 'x-large';
  highContrast: boolean;
  reducedMotion: boolean;
  linkUnderlines: boolean;
  focusIndicators: 'default' | 'enhanced';
  colorScheme: 'default' | 'monochrome' | 'deuteranopia' | 'protanopia';
  dyslexiaFont: boolean;
}
