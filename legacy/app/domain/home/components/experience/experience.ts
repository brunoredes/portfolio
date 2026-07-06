import type { ElementRef } from '@angular/core';
import { Component, afterNextRender, computed, inject, Injector, signal, viewChild } from '@angular/core';
import type { Experience as ProExperience } from '../../data/experiences';
import { EXPERIENCES } from '../../data/experiences';

@Component({
  selector: 'app-experience',
  imports: [],
  templateUrl: './experience.html',
  styleUrl: './experience.css',
})
export class Experience {
  private injector = inject(Injector);

  protected experiences = EXPERIENCES;

  private experienceSection = viewChild<ElementRef<HTMLElement>>('experienceSection');

  // Number of visible experiences (starts at 1)
  protected visibleCount = signal(1);

  // Computed: visible experiences
  protected visibleExperiences = computed(() =>
    this.experiences.slice(0, this.visibleCount())
  );

  // Computed: is fully expanded
  protected isFullyExpanded = computed(() =>
    this.visibleCount() >= this.experiences.length
  );

  // Computed: button text
  protected buttonText = computed(() =>
    this.isFullyExpanded() ? 'Ver menos experiências' : 'Ver mais experiências'
  );

  // Computed: button icon
  protected buttonIcon = computed(() =>
    this.isFullyExpanded() ? 'expand_less' : 'expand_more'
  );

  /**
   * Toggle expand/collapse with scroll position management
   */
  toggleExpand(): void {
    if (this.isFullyExpanded()) {
      // Collapse to show only current (first), then scroll to section top
      this.visibleCount.set(1);
      afterNextRender(() => {
        this.experienceSection()?.nativeElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, { injector: this.injector });
    } else {
      // Expand: lock scroll position so the page doesn't follow the button
      const scrollY = window.scrollY;
      this.visibleCount.update(count =>
        Math.min(count + 1, this.experiences.length)
      );
      afterNextRender(() => {
        document.documentElement.style.scrollBehavior = 'auto';
        window.scrollTo(0, scrollY);
        requestAnimationFrame(() => {
          document.documentElement.style.scrollBehavior = '';
        });
      }, { injector: this.injector });
    }
  }

  /**
   * Format date range
   */
  getDateRange(experience: ProExperience): string {
    const start = this.formatDate(experience.startDate);
    const end = experience.endDate === 'current'
      ? 'Atual'
      : this.formatDate(experience.endDate);

    return `${start} - ${end}`;
  }

  /**
   * Format date from YYYY-MM to "MMM YYYY"
   */
  private formatDate(dateString: string): string {
    const [year, month] = dateString.split('-');
    const monthNames = [
      'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
      'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
    ];
    return `${monthNames[parseInt(month, 10) - 1]} ${year}`;
  }

  /**
   * Calculate duration in months
   */
  getDuration(experience: ProExperience): string {
    const start = new Date(experience.startDate + '-01');
    const end = experience.endDate === 'current'
      ? new Date()
      : new Date(experience.endDate + '-01');

    const months = (end.getFullYear() - start.getFullYear()) * 12
      + (end.getMonth() - start.getMonth());

    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;

    if (years === 0) {
      return `${months} ${months === 1 ? 'mês' : 'meses'}`;
    } else if (remainingMonths === 0) {
      return `${years} ${years === 1 ? 'ano' : 'anos'}`;
    } else {
      return `${years} ${years === 1 ? 'ano' : 'anos'} e ${remainingMonths} ${remainingMonths === 1 ? 'mês' : 'meses'}`;
    }
  }

  /**
   * Check if experience is current
   */
  isCurrent(experience: ProExperience): boolean {
    return experience.endDate === 'current';
  }
}
