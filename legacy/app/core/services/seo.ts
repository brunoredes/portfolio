import { inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

export interface SEOConfig {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
  noFollow?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class Seo {
  private meta = inject(Meta);
  private title = inject(Title);
  private router = inject(Router);

  // Default SEO configuration
  private defaultConfig: SEOConfig = {
    title: 'Bruno Donatelli - Desenvolvedor Full Stack',
    description: 'Desenvolvedor Full Stack especializado em Angular, Node.js e arquitetura de soluções escaláveis. Criando experiências digitais incríveis.',
    keywords: ['desenvolvedor full stack', 'angular', 'nodejs', 'typescript', 'react', 'web development'],
    image: '/og-image.webp',
    url: 'https://donatelli.dev',
    type: 'website',
    author: 'Bruno Donatelli',
  };

  constructor() {
    // Update canonical URL on route changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.updateCanonicalUrl(`https://donatelli.dev${event.urlAfterRedirects}`);
    });
  }

  /**
   * Update all SEO meta tags
   */
  updateTags(config: SEOConfig): void {
    const seoConfig = { ...this.defaultConfig, ...config };

    // Page Title
    this.updateTitle(seoConfig.title!);

    // Basic Meta Tags
    this.updateMetaTag('description', seoConfig.description!);
    this.updateMetaTag('keywords', seoConfig.keywords?.join(', ') || '');
    this.updateMetaTag('author', seoConfig.author!);

    // Robots
    if (seoConfig.noIndex || seoConfig.noFollow) {
      const robotsContent = [
        seoConfig.noIndex ? 'noindex' : 'index',
        seoConfig.noFollow ? 'nofollow' : 'follow'
      ].join(', ');
      this.updateMetaTag('robots', robotsContent);
    }

    // Open Graph Tags (Facebook, LinkedIn)
    this.updateOpenGraphTags(seoConfig);

    // Twitter Card Tags
    this.updateTwitterCardTags(seoConfig);

    // Canonical URL
    if (seoConfig.canonicalUrl) {
      this.updateCanonicalUrl(seoConfig.canonicalUrl);
    }

    // Article specific tags
    if (seoConfig.type === 'article') {
      this.updateArticleTags(seoConfig);
    }
  }

  /**
   * Update page title
   */
  private updateTitle(title: string): void {
    this.title.setTitle(title);
    this.updateMetaTag('og:title', title, 'property');
    this.updateMetaTag('twitter:title', title);
  }

  /**
   * Update meta tag
   */
  private updateMetaTag(name: string, content: string, attribute: 'name' | 'property' = 'name'): void {
    if (!content) return;

    const selector = `${attribute}="${name}"`;

    if (this.meta.getTag(selector)) {
      this.meta.updateTag({ [attribute]: name, content });
    } else {
      this.meta.addTag({ [attribute]: name, content });
    }
  }

  /**
   * Update Open Graph tags
   */
  private updateOpenGraphTags(config: SEOConfig): void {
    this.updateMetaTag('og:type', config.type || 'website', 'property');
    this.updateMetaTag('og:url', config.url || this.defaultConfig.url!, 'property');
    this.updateMetaTag('og:title', config.title!, 'property');
    this.updateMetaTag('og:description', config.description!, 'property');
    this.updateMetaTag('og:image', config.image || this.defaultConfig.image!, 'property');
    this.updateMetaTag('og:image:alt', config.title!, 'property');
    this.updateMetaTag('og:site_name', 'Bruno Donatelli Portfolio', 'property');
    this.updateMetaTag('og:locale', 'pt_BR', 'property');
  }

  /**
   * Update Twitter Card tags
   */
  private updateTwitterCardTags(config: SEOConfig): void {
    this.updateMetaTag('twitter:card', 'summary_large_image');
    this.updateMetaTag('twitter:title', config.title!);
    this.updateMetaTag('twitter:description', config.description!);
    this.updateMetaTag('twitter:image', config.image || this.defaultConfig.image!);
    this.updateMetaTag('twitter:image:alt', config.title!);
  }

  /**
   * Update article-specific tags
   */
  private updateArticleTags(config: SEOConfig): void {
    if (config.publishedTime) {
      this.updateMetaTag('article:published_time', config.publishedTime, 'property');
    }
    if (config.modifiedTime) {
      this.updateMetaTag('article:modified_time', config.modifiedTime, 'property');
    }
    if (config.author) {
      this.updateMetaTag('article:author', config.author, 'property');
    }
  }

  /**
   * Update canonical URL
   */
  private updateCanonicalUrl(url: string): void {
    // Remove existing canonical
    const existingLink = document.querySelector('link[rel="canonical"]');
    if (existingLink) {
      existingLink.remove();
    }

    // Add new canonical
    const link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    link.setAttribute('href', url);
    document.head.appendChild(link);
  }

  /**
   * Add structured data (JSON-LD)
   */
  addStructuredData(data: object, id: string = 'structured-data'): void {
    // Remove existing script if present
    const existingScript = document.getElementById(id);
    if (existingScript) {
      existingScript.remove();
    }

    // Create new script
    const script = document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    script.text = JSON.stringify(data);
    document.head.appendChild(script);
  }

  /**
   * Remove structured data
   */
  removeStructuredData(id: string = 'structured-data'): void {
    const script = document.getElementById(id);
    if (script) {
      script.remove();
    }
  }
}
