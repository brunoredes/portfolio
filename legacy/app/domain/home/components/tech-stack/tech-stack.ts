import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { TECH_STACK } from '../../data/tech-stack';

@Component({
  selector: 'app-tech-stack',
  imports: [NgOptimizedImage],
  templateUrl: './tech-stack.html',
  styleUrl: './tech-stack.css',
})
export class TechStack {
  protected techStack = TECH_STACK;

  protected getCategoryLabel(category: string): string {
    const labels: Record<string, string> = {
      frontend: 'Frontend',
      backend: 'Backend',
      // devops: 'DevOps',
      // database: 'Database',
      tools: 'Ferramentas',
    };
    return labels[category] || category;
  }
}
