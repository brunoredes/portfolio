import { Component, signal } from '@angular/core';
import { NAV_LINKS, SOCIAL_LINKS } from '../../shared/utils/constants';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  protected navLinks = NAV_LINKS;
  protected socialLinks = SOCIAL_LINKS;
  protected isMenuOpen = signal(false);

  protected toggleMenu() {
    this.isMenuOpen.update(value => !value);
  }

  protected closeMenu() {
    this.isMenuOpen.set(false);
  }
}
