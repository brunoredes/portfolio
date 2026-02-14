import type { ElementRef, OnDestroy, OnInit } from '@angular/core';
import { Component, effect, signal, viewChild } from '@angular/core';
import { NAV_LINKS, SOCIAL_LINKS } from '../../../shared/utils/constants';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [NgOptimizedImage],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit, OnDestroy {
  mobileNavFirstLink = viewChild<ElementRef<HTMLAnchorElement>>('mobileNavFirstLink');

  protected navLinks = NAV_LINKS;
  protected socialLinks = SOCIAL_LINKS;
  protected isMenuOpen = signal(false);

  // Logo animation states
  protected logoText = signal('');
  protected showCursor = signal(false);
  protected animationComplete = signal(false);

  private readonly FULL_TEXT = 'DONATELLI DEV';
  private readonly FINAL_TEXT = 'dd';
  private readonly CHAR_DELAY = 50; // 50ms per character
  private animationTimeout?: number;

  constructor() {
    // Focus management when menu opens/closes
    effect(() => {
      if (this.isMenuOpen() && this.mobileNavFirstLink) {
        // Focus first link when menu opens
        setTimeout(() => {
          this.mobileNavFirstLink()?.nativeElement.focus();
        }, 100);
      }
    });
  }

  ngOnInit() {
    // Start logo animation on page load
    this.startLogoAnimation();
  }

  ngOnDestroy() {
    if (this.animationTimeout) {
      clearTimeout(this.animationTimeout);
    }
  }

  toggleMenu() {
    this.isMenuOpen.update(value => !value);
  }

  closeMenu() {
    this.isMenuOpen.set(false);
  }

  // Dynamic aria-label for hamburger button
  getMenuButtonLabel(): string {
    return this.isMenuOpen() ? 'Fechar menu' : 'Abrir menu';
  }

  private async startLogoAnimation() {
    // Wait a brief moment before starting
    await this.delay(500);

    // Type full text
    await this.typeText(this.FULL_TEXT);

    // Wait a moment at full text
    await this.delay(800);

    // Backspace to initials
    await this.backspaceToInitials(this.FULL_TEXT, this.FINAL_TEXT);

    // Show cursor and mark animation complete
    this.showCursor.set(true);
    this.animationComplete.set(true);
  }

  private async typeText(text: string) {
    for (let i = 0; i <= text.length; i++) {
      this.logoText.set(text.substring(0, i));
      await this.delay(this.CHAR_DELAY);
    }
  }

  private async backspaceToInitials(fullText: string, finalText: string) {
    const words = fullText.split(' ');

    // Backspace the entire text
    for (let i = fullText.length; i >= 0; i--) {
      this.logoText.set(fullText.substring(0, i));
      await this.delay(this.CHAR_DELAY);
    }

    // Type the initials
    for (let i = 0; i <= finalText.length; i++) {
      this.logoText.set(finalText.substring(0, i));
      await this.delay(this.CHAR_DELAY);
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => {
      this.animationTimeout = window.setTimeout(resolve, ms);
    });
  }
}
