import { Component, computed, signal } from '@angular/core';
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

  // Current carousel index
  protected currentIndex = signal(0);

  // Detect if mobile view
  protected isMobile = signal(false);

  // Posts per view based on screen size
  protected postsPerView = computed(() => this.isMobile() ? 1 : 3);

  // Total pages
  protected totalPages = computed(() =>
    Math.ceil(this.posts.length / this.postsPerView())
  );

  // Current page (1-based for UI)
  protected currentPage = computed(() => this.currentIndex() + 1);

  // Can navigate
  protected canGoPrev = computed(() => this.currentIndex() > 0);
  protected canGoNext = computed(() =>
    this.currentIndex() < this.totalPages() - 1
  );

  // Show "View All" link if more than 6 posts
  protected shouldShowViewAll = computed(() => this.posts.length > 6);

  // Visible posts for current page
  protected visiblePosts = computed(() => {
    const start = this.currentIndex() * this.postsPerView();
    const end = start + this.postsPerView();
    return this.posts.slice(start, end);
  });

  // Transform value for carousel
  protected transformValue = computed(() => {
    const offset = this.currentIndex() * -100;
    return `translateX(${offset}%)`;
  });

  private mediaQuery: MediaQueryList;
  private mediaQueryListener: (e: MediaQueryListEvent) => void;

  constructor() {
    // Setup media query listener
    this.mediaQuery = window.matchMedia('(max-width: 1024px)');
    this.mediaQueryListener = (e: MediaQueryListEvent) => {
      this.isMobile.set(e.matches);
      // Reset to first page when switching viewports
      this.currentIndex.set(0);
    };

    // Set initial state
    this.isMobile.set(this.mediaQuery.matches);

    // Add listener
    this.mediaQuery.addEventListener('change', this.mediaQueryListener);
  }

  ngOnDestroy(): void {
    // Clean up listener
    this.mediaQuery.removeEventListener('change', this.mediaQueryListener);
  }

  /**
   * Navigate to previous page
   */
  goPrev(): void {
    if (this.canGoPrev()) {
      this.currentIndex.update(i => i - 1);
    }
  }

  /**
   * Navigate to next page
   */
  goNext(): void {
    if (this.canGoNext()) {
      this.currentIndex.update(i => i + 1);
    }
  }

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
   * Calculate time ago from date
   */
  getTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return 'hoje';
    if (diffInDays === 1) return 'ontem';
    if (diffInDays < 7) return `há ${diffInDays} dias`;
    if (diffInDays < 30) {
      const weeks = Math.floor(diffInDays / 7);
      return weeks === 1 ? 'há 1 semana' : `há ${weeks} semanas`;
    }
    if (diffInDays < 365) {
      const months = Math.floor(diffInDays / 30);
      return months === 1 ? 'há 1 mês' : `há ${months} meses`;
    }
    const years = Math.floor(diffInDays / 365);
    return years === 1 ? 'há 1 ano' : `há ${years} anos`;
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
   * Get accessible label for platform link
   */
  getPlatformLabel(platform: any, postTitle: string): string {
    const langName = this.getLanguageName(platform.language);
    return `Ler "${postTitle}" no ${platform.name} em ${langName}, abre em nova aba`;
  }

  /**
   * Check if post is currently visible (for mobile indicator)
   */
  isPostVisible(postIndex: number): boolean {
    const start = this.currentIndex() * this.postsPerView();
    const end = start + this.postsPerView();
    return postIndex >= start && postIndex < end;
  }
}
