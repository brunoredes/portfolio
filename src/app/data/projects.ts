export interface Project {
  id: string;
  number: string;
  title: string;
  description: string;
  technologies: string[];
  repoUrl: string;
  liveUrl?: string;
}

export const PROJECTS: Project[] = [
  {
    id: 'dashboard',
    number: '01',
    title: 'React Dashboard',
    description: 'Dashboard administrativo completo com gráficos e analytics em tempo real',
    technologies: ['React', 'TypeScript', 'Chart.js'],
    repoUrl: 'https://github.com/brunoredes/dashboard',
    liveUrl: 'https://dashboard-demo.com',
  },
  {
    id: 'api-gateway',
    number: '02',
    title: 'API Gateway com autenticação',
    description: 'Gateway de API com autenticação JWT e rate limiting distribuído',
    technologies: ['Node.js', 'Express', 'Redis'],
    repoUrl: 'https://github.com/brunoredes/api-gateway',
  },
  {
    id: 'ml-pipeline',
    number: '03',
    title: 'ML Pipeline para analytics',
    description: 'Pipeline de machine learning para processamento e análise de dados',
    technologies: ['Python', 'TensorFlow', 'Docker'],
    repoUrl: 'https://github.com/brunoredes/ml-pipeline',
  },
];
