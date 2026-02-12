export interface BlogPlatform {
  name: 'dev.to' | 'medium';
  url: string;
  language: 'pt-BR' | 'en-US';
}

export interface BlogPost {
  id: string;
  title: string;
  platforms: BlogPlatform[];
  date: string; // ISO format: YYYY-MM-DD
  excerpt?: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'forms-signal',
    title: 'Angular Forms Signal: O que as documentações não te falam',
    platforms: [
      {
        name: 'dev.to',
        url: 'https://dev.to/brunoredes/angular-forms-signal-o-que-as-documentacoes-nao-te-falam-2c3p',
        language: 'pt-BR',
      },
      {
        name: 'medium',
        url: 'https://medium.com/@brunoredes/angular-forms-signal-migration-what-the-docs-wont-tell-you-123f476da9b8',
        language: 'en-US',
      },
    ],
    date: '2026-01-07',
    excerpt: 'A comprehensive guide to migrating Angular forms to signals, covering common pitfalls and best practices',
  },
  {
    id: 'angular-21',
    title: 'Conhecendo as novidades do Angular 21',
    platforms: [
      {
        name: 'dev.to',
        url: 'https://dev.to/brunoredes/conhecendo-as-novidades-do-angular-21-l29',
        language: 'pt-BR',
      },
    ],
    date: '2025-11-19',
    excerpt: 'Angular 21 news',
  },
  {
    id: 'modals',
    title: 'Simplifique modais com os atributos experimentais "command" e "commandfor"',
    platforms: [
      {
        name: 'dev.to',
        url: 'https://dev.to/brunoredes/simplifique-modais-com-os-atributos-experimentais-command-e-commandfor-3ahi',
        language: 'pt-BR',
      },
    ],
    date: '2025-03-05',
    excerpt: 'Native button attributes "command" and "commandfor" can simplify modal dialogs by eliminating the need for custom JavaScript. Learn how to use them effectively.',
  },
  {
    id: 'content-projection',
    title: 'Projeção de Conteúdo em Angular: O Guia para ng-content e ngTemplateOutlet',
    platforms: [
      {
        name: 'dev.to',
        url: 'https://dev.to/brunoredes/projecao-de-conteudo-em-angular-fmg',
        language: 'pt-BR',
      },
    ],
    date: '2025-03-24',
    excerpt: 'Projeção de conteúdo em Angular utilizando ng-content e ngTemplateOutlet. Aprenda como criar componentes reutilizáveis e flexíveis.',
  },
];
