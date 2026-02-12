export interface Project {
  id: string;
  number: string;
  title: string;
  description: string;
  technologies: string[];
  repoUrl: string;
  liveUrl?: string;
  previewImg: string;
}

export const PROJECTS: Project[] = [
  {
    id: 'tft-unit-counter',
    number: '01',
    title: 'TFT Unit Counter',
    description: 'Projeto para fazer contagem de unidades em Teamfight Tactics em campeonatos, exportando dados em xlsx',
    technologies: ['Angular', 'TypeScript'],
    repoUrl: 'https://github.com/brunoredes/unity-counter',
    previewImg: '/blog/pingu.avif'
  },
  {
    id: 'concertify',
    number: '02',
    title: 'Concertify',
    description: 'Gerador de playlists baseado em setlists de shows',
    technologies: ['Node.js', 'Fastify', 'Angular', 'TypeScript'],
    repoUrl: 'https://www.concertify.app/',
    previewImg: ''
  },
  {
    id: 'tft-learning-path',
    number: '03',
    title: 'TFT Learning Path',
    description: 'Projeto para aprender TFT em forma de tarefas TODO',
    technologies: ['Angular', 'TypeScript'],
    repoUrl: 'https://github.com/brunoredes/tft-learning-path',
    previewImg: '/blog/shisa.avif'
  },
];
