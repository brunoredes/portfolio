export interface AccessibilitySettings {
  fontSize: 'normal' | 'large' | 'x-large';
  highContrast: boolean;
  reducedMotion: boolean;
  linkUnderlines: boolean;
  focusIndicators: 'default' | 'enhanced';
  colorScheme:
  | 'default'
  | 'monochrome'
  | 'protanopia'        // Red-blind (no red cones)
  | 'protanomaly'       // Red-weak (anomalous red cones)
  | 'deuteranopia'      // Green-blind (no green cones)
  | 'deuteranomaly'     // Green-weak (anomalous green cones)
  | 'tritanopia'        // Blue-blind (no blue cones)
  | 'tritanomaly';      // Blue-weak (anomalous blue cones)
  dyslexiaFont: boolean;
}
