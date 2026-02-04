export interface TechItem {
  id: string;
  name: string;
  category: 'frontend' | 'backend' | 'devops' | 'database' | 'tools';
  iconUrl: string;
}

export const TECH_STACK: TechItem[] = [
  // Frontend
  { id: 'angular', name: 'Angular', category: 'frontend', iconUrl: '/assets/icons/angular.svg' },
  { id: 'react', name: 'React', category: 'frontend', iconUrl: '/assets/icons/react.svg' },
  { id: 'typescript', name: 'TypeScript', category: 'frontend', iconUrl: '/assets/icons/typescript.svg' },
  { id: 'javascript', name: 'JavaScript', category: 'frontend', iconUrl: '/assets/icons/javascript.svg' },

  // Backend
  { id: 'nodejs', name: 'Node.js', category: 'backend', iconUrl: '/assets/icons/nodejs.svg' },
  { id: 'python', name: 'Python', category: 'backend', iconUrl: '/assets/icons/python.svg' },
  { id: 'express', name: 'Express', category: 'backend', iconUrl: '/assets/icons/express.svg' },

  // DevOps
  { id: 'docker', name: 'Docker', category: 'devops', iconUrl: '/assets/icons/docker.svg' },
  { id: 'kubernetes', name: 'Kubernetes', category: 'devops', iconUrl: '/assets/icons/kubernetes.svg' },
  { id: 'git', name: 'Git', category: 'devops', iconUrl: '/assets/icons/git.svg' },

  // Database
  { id: 'postgresql', name: 'PostgreSQL', category: 'database', iconUrl: '/assets/icons/postgresql.svg' },
  { id: 'mongodb', name: 'MongoDB', category: 'database', iconUrl: '/assets/icons/mongodb.svg' },
  { id: 'redis', name: 'Redis', category: 'database', iconUrl: '/assets/icons/redis.svg' },
];
