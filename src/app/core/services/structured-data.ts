import { Injectable } from '@angular/core';
import type { BlogPost } from 'src/app/domain/home/data/blog';
import type { Experience } from 'src/app/domain/home/data/experiences';

@Injectable({
  providedIn: 'root',
})
export class StructuredData {
  /**
   * Generate Person schema (for profile/about page)
   */
  getPersonSchema(): object {
    return {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Bruno Donatelli',
      jobTitle: 'Desenvolvedor Full Stack',
      url: 'https://brunodonatelli.com',
      sameAs: [
        'https://github.com/brunoredes',
        'https://linkedin.com/in/brunoldonatelli',
      ],
      knowsAbout: [
        'JavaScript',
        'TypeScript',
        'Angular',
        'React',
        'Web Development',
        'Full Stack Development',
      ],
      description: 'Desenvolvedor Full Stack especializado em Angular, React, acessibilidade e soluções escaláveis.',
    };
  }

  /**
   * Generate WebSite schema (for homepage)
   */
  getWebSiteSchema(): object {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Bruno Donatelli Portfolio',
      description: 'Portfolio de Bruno Donatelli - Desenvolvedor Full Stack',
      url: 'https://brunodonatelli.com',
      author: {
        '@type': 'Person',
        name: 'Bruno Donatelli',
      },
    };
  }

  /**
   * Generate BlogPosting schema
   */
  getBlogPostSchema(post: BlogPost): object {
    return {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.excerpt,
      datePublished: post.date,
      author: {
        '@type': 'Person',
        name: 'Bruno Donatelli',
      },
      publisher: {
        '@type': 'Person',
        name: 'Bruno Donatelli',
      },
    };
  }

  /**
   * Generate ItemList schema (for blog list page)
   */
  getBlogListSchema(posts: BlogPost[]): object {
    return {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      itemListElement: posts.map((post, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: post.platforms[0]?.url,
        name: post.title,
      })),
    };
  }

  /**
   * Generate WorkExperience schema
   */
  getWorkExperienceSchema(experiences: Experience[]): object {
    return experiences.map(exp => ({
      '@context': 'https://schema.org',
      '@type': 'WorkExperience',
      name: exp.role,
      description: exp.description,
      startDate: exp.startDate,
      endDate: exp.endDate === 'current' ? undefined : exp.endDate,
      employer: {
        '@type': 'Organization',
        name: exp.company,
      },
      location: exp.location,
    }));
  }
}
