import type { RouteMeta } from '@analogjs/router';
import type { OnDestroy, OnInit } from '@angular/core';
import { Component, inject } from '@angular/core';
import { Seo } from '../core/services/seo';
import { StructuredData } from '../core/services/structured-data';
import { Blog } from '../domain/home/components/blog/blog';
import { Contact } from '../domain/home/components/contact/contact';
import { Experience } from '../domain/home/components/experience/experience';
import { Hero } from '../domain/home/components/hero/hero';
import { Projects } from '../domain/home/components/projects/projects';
import { TechStack } from '../domain/home/components/tech-stack/tech-stack';

export const routeMeta: RouteMeta = {
  title: 'Bruno Donatelli - Desenvolvedor Full Stack | Portfolio',
  meta: [
    {
      name: 'description',
      content:
        'Portfolio de Bruno Donatelli, desenvolvedor Full Stack especializado em Angular, React, Webcomponents, acessibilidade e soluções escaláveis.',
    },
    {
      name: 'keywords',
      content:
        'desenvolvedor full stack, angular, nodejs, typescript, react, web components, a11y, bruno donatelli',
    },
    {
      property: 'og:title',
      content: 'Bruno Donatelli - Desenvolvedor Full Stack',
    },
    {
      property: 'og:description',
      content: 'Criando experiências digitais incríveis com tecnologias modernas.',
    },
    {
      property: 'og:type',
      content: 'website',
    },
    {
      property: 'og:image',
      content: 'https://donatelli.dev/og-image.jpg',
    },
  ],
};

@Component({
  selector: 'app-index',
  imports: [Hero, Projects, Experience, Blog, TechStack, Contact],
  templateUrl: './index.page.html',
  styleUrl: './index.page.css',
})
export default class IndexPage implements OnInit, OnDestroy {
  private seo = inject(Seo);
  private structuredData = inject(StructuredData);

  ngOnInit(): void {
    // Update SEO tags
    this.seo.updateTags({
      title: 'Bruno Donatelli - Desenvolvedor Full Stack | Portfolio',
      description:
        'Portfolio de Bruno Donatelli, desenvolvedor Full Stack especializado em Angular, React, Webcomponents, acessibilidade e soluções escaláveis.',
      keywords: ['desenvolvedor full stack', 'angular', 'react', 'typescript', 'webcomponents', 'web development'],
      image: 'https://donatelli.dev/assets/images/og-image.jpg',
      url: 'https://donatelli.dev',
      type: 'website',
    });

    // Add structured data (JSON-LD)
    this.seo.addStructuredData(this.structuredData.getPersonSchema(), 'person-schema');

    this.seo.addStructuredData(this.structuredData.getWebSiteSchema(), 'website-schema');
  }

  ngOnDestroy(): void {
    // Clean up structured data
    this.seo.removeStructuredData('person-schema');
    this.seo.removeStructuredData('website-schema');
  }
}
