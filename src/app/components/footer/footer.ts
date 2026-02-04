import { Component } from '@angular/core';
import { NAV_LINKS, SOCIAL_LINKS } from '../../shared/utils/constants';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  protected navLinks = NAV_LINKS;
  protected socialLinks = SOCIAL_LINKS;
  protected currentYear = new Date().getFullYear();
}
