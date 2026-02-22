import { Component } from '@angular/core';
import type { Project } from '../../data/projects';
import { PROJECTS } from '../../data/projects';

@Component({
  selector: 'app-projects',
  imports: [],
  templateUrl: './projects.html',
  styleUrl: './projects.css',
})
export class Projects {
  protected projects = PROJECTS;

  /**
   * Returns all technologies as a single string for screen readers
   */
  getTechsLabel(project: Project): string {
    return `Tecnologias utilizadas: ${project.technologies.join(', ')}`;
  }
}
