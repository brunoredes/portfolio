export interface TechItem {
  id: string;
  name: string;
  category: 'frontend' | 'backend' | 'devops' | 'database' | 'tools';
  iconUrl: string;
}

export const TECH_STACK: TechItem[] = [
  // Frontend
  { id: 'angular', name: 'Angular', category: 'frontend', iconUrl: '/techs/angular.avif' },
  { id: 'react', name: 'React', category: 'frontend', iconUrl: '/techs/react.avif' },
  { id: 'typescript', name: 'TypeScript', category: 'frontend', iconUrl: '/techs/typescript.avif' },
  { id: 'javascript', name: 'JavaScript', category: 'frontend', iconUrl: '/techs/js.avif' },
  { id: 'css', name: 'CSS', category: 'frontend', iconUrl: '/techs/css.avif' },
  { id: 'scss', name: 'SCSS', category: 'frontend', iconUrl: '/techs/scss.avif' },
  { id: 'webcomponents', name: 'Web Components', category: 'frontend', iconUrl: '/techs/webcomponents.avif' },

  // Backend
  { id: 'csharp', name: 'C#', category: 'backend', iconUrl: '/techs/csharp.avif' },

  // DevOps
  { id: 'docker', name: 'Docker', category: 'devops', iconUrl: '/techs/docker.avif' },
  { id: 'git', name: 'Git', category: 'devops', iconUrl: '/techs/git.avif' },
  { id: 'github', name: 'GitHub', category: 'devops', iconUrl: '/techs/github.avif' },
  { id: 'gitlab', name: 'GitLab', category: 'devops', iconUrl: '/techs/gitlab.avif' },

  // Database
  { id: 'postgresql', name: 'PostgreSQL', category: 'database', iconUrl: '/techs/pgsql.avif' },
  
  // Tools
  { id: 'nvda', name: 'NVDA', category: 'tools', iconUrl: '/techs/nvda.avif' },
];
