import type { OnInit } from '@angular/core';
import { Component, inject } from '@angular/core';
import { Seo } from '../core/services/seo';

@Component({
  selector: 'app-privacy-policy',
  imports: [],
  templateUrl: './privacy-policy.page.html',
  styleUrl: './privacy-policy.page.css',
})
export default class PrivacyPolicyPage implements OnInit {
  private seo = inject(Seo);

  protected lastUpdated = '14 de fevereiro de 2026';

  ngOnInit(): void {
    this.seo.updateTags({
      title: 'Política de Privacidade - Bruno Donatelli',
      description: 'Política de privacidade do portfolio de Bruno Donatelli. Saiba como seus dados são tratados ao utilizar este site.',
      url: 'https://brunodonatelli.com/privacy-policy',
      type: 'article',
      noIndex: false,
    });

    // Scroll to top
    window.scrollTo(0, 0);
  }
}
