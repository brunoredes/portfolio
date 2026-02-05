import type { ElementRef } from '@angular/core';
import { Component, effect, signal, viewChild } from '@angular/core';
import { NAV_LINKS, SOCIAL_LINKS } from '../../shared/utils/constants';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  mobileNavFirstLink = viewChild<ElementRef<HTMLAnchorElement>>('mobileNavFirstLink');

  protected navLinks = NAV_LINKS;
  protected socialLinks = SOCIAL_LINKS;
  protected isMenuOpen = signal(false);

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
}
