import { Component } from '@angular/core';
import type { BlogPlatform } from '../../data/blog';
import { BLOG_POSTS } from '../../data/blog';
import { TimeAgoPipe } from '../../shared/pipes/time-ago-pipe';

@Component({
  selector: 'app-blog',
  imports: [TimeAgoPipe],
  templateUrl: './blog.html',
  styleUrl: './blog.css',
})
export class Blog {
  protected posts = BLOG_POSTS;

  /**
   * Get flag emoji for language
   */
  getLanguageFlag(language: 'pt-BR' | 'en-US'): string {
    const flags: Record<string, string> = {
      'pt-BR': '🇧🇷',
      'en-US': '🇺🇸',
    };
    return flags[language] || '';
  }

  /**
   * Get accessible language name
   */
  getLanguageName(language: 'pt-BR' | 'en-US'): string {
    const names: Record<string, string> = {
      'pt-BR': 'Português Brasileiro',
      'en-US': 'English',
    };
    return names[language] || '';
  }

  /**
   * Format date for screen readers (full date)
   */
  getAccessibleDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  /**
   * Get platform display name
   */
  getPlatformName(platform: BlogPlatform): string {
    return platform.name;
  }

  /**
   * Get accessible label for platform link
   */
  getPlatformLabel(platform: BlogPlatform, postTitle: string): string {
    const langName = this.getLanguageName(platform.language);
    return `Ler "${postTitle}" no ${platform.name} em ${langName}, abre em nova aba`;
  }
}
