// src/app/data/experiences.ts
export interface Experience {
  id: string;
  company: string;
  role: string;
  roleLevel: string;
  startDate: string; // YYYY-MM format
  endDate: string | 'current'; // YYYY-MM or 'current'
  description: string;
  technologies?: string[];
  location?: string;
}

export const EXPERIENCES: Experience[] = [
  {
    id: 'exp-1',
    company: 'BTG Pactual',
    role: 'Desenvolvedor Fullstack',
    roleLevel: 'Senior',
    startDate: '2026-01',
    endDate: 'current',
    description: 'Criação e manutenção de sites para RI em Assets, com CMS próprio.',
    technologies: ['React', 'C#', 'Storybook', 'Azure Devops'],
    location: 'São Paulo, SP - Remoto',
  },
  {
    id: 'exp-2',
    company: 'Itaú Unibanco | NTT Data Europe & LATAM',
    role: 'Desenvolvedor Frontend',
    roleLevel: 'Pleno',
    startDate: '2024-11',
    endDate: '2025-12',
    description: 'desenvolvimento de web componentes responsivos baseado em handoff em Figma. Estilização e atualização de tokens, criação de componentes e composição de componentes utilizando Angular, React, WebComponents. Criação de documentação interativa em portal interno. Criação de testes unitários e testes de acessibilidade.',
    technologies: ['Angular', 'React', 'Lit WebComponents', 'TypeScript', 'AWS', 'Github Actions', 'NVDA', 'axe-core', 'Jest', 'Testing Library', 'Storybook'],
    location: 'São Paulo, SP - Remoto',
  },
  {
    id: 'exp-3',
    company: 'Itaú Unibanco | NTT Data Europe & LATAM',
    role: 'Desenvolvedor Frontend',
    roleLevel: 'Pleno',
    startDate: '2024-06',
    endDate: '2024-11',
    description: 'Desenvolvimento do MFE webview do chat de todas as plataformas do app. Modernização e migração de tecnologia para AWS, SQS, S3, Angular 14, Jest, NestJS, API Gateway, microsserviços, websocket.',
    technologies: ['Angular', 'Node.js', 'TypeScript', 'AWS', 'Docker', 'NestJS', 'Jest', 'WebSocket', 'SQS', 'S3', 'API Gateway', 'BFF'],
    location: 'São Paulo, SP - Remoto',
  },
  {
    id: 'exp-4',
    company: 'NTT Data Europe & LATAM',
    role: 'Desenvolvedor Frontend',
    roleLevel: 'Pleno',
    startDate: '2020-04',
    endDate: '2024-06',
    description: 'Desenvolvimento de plataforma lowcode de chatbot conversacional empresarial com IA. https://www.syntphony.com/ai.html',
    technologies: ['Angular', 'Node.js', 'Docker', 'Kubernetes', 'GCP', 'SCSS', 'TypeScript', 'Jest', 'Testing Library', 'Sonarqube'],
    location: 'São Paulo, SP',
  },
  {
    id: 'exp-5',
    company: 'NTT Data Europe & LATAM',
    role: 'Desenvolvedor Frontend',
    roleLevel: 'Júnior',
    startDate: '2020-10',
    endDate: '2023-04',
    description: 'Desenvolvimento de plataforma lowcode de chatbot conversacional empresarial com IA. https://www.syntphony.com/ai.html',
    technologies: ['Angular', 'Node.js', 'Docker', 'Kubernetes', 'GCP', 'SCSS', 'TypeScript', 'Jest', 'Testing Library', 'Sonarqube'],
    location: 'São Paulo, SP',
  },
  {
    id: 'exp-6',
    company: 'Stefanini IT Solutions',
    roleLevel: 'Estágio',
    role: 'Desenvolvedor frontend',
    startDate: '2019-10',
    endDate: '2020-06',
    description: 'Desenvolvimento frontend de aplicações internas, utilizando Angular 8, integrações com API HTTP. Layout adaptativo com Angular Material.',
    technologies: ['Angular', 'Angular Material', 'TypeScript', 'HTML', 'CSS'],
    location: 'São Paulo, SP',
  },
  {
    id: 'exp-7',
    company: 'Stefanini IT Solutions',
    roleLevel: 'Estágio',
    role: 'Analista de sustentação',
    startDate: '2019-01',
    endDate: '2019-10',
    description: 'Atendimento de chamados N1; Consultas em banco de dados SQL Server 2008 / Oracle; Uso de base de conhecimento para resolução de problemas; Execução de T-SQL/PLSQL',
    technologies: ['SQL Server', 'Oracle', 'T-SQL', 'PLSQL'],
    location: 'São Paulo, SP',
  },
];
