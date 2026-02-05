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
    id: 'scalable-react-apps',
    title: 'Building Scalable React Apps',
    platforms: [
      {
        name: 'dev.to',
        url: 'https://dev.to/brunoredes/building-scalable-react-apps',
        language: 'pt-BR',
      },
      {
        name: 'medium',
        url: 'https://medium.com/@brunoredes/building-scalable-react-apps',
        language: 'en-US',
      },
    ],
    date: '2024-01-15',
    excerpt: 'Best practices for building large-scale React applications with TypeScript',
  },
  {
    id: 'microservices-architecture',
    title: 'Microservices Architecture',
    platforms: [
      {
        name: 'medium',
        url: 'https://medium.com/@brunoredes/microservices-architecture',
        language: 'en-US',
      },
    ],
    date: '2024-01-08',
    excerpt: 'A deep dive into microservices patterns and implementation strategies',
  },
  {
    id: 'typescript-tips',
    title: 'TypeScript Tips',
    platforms: [
      {
        name: 'dev.to',
        url: 'https://dev.to/brunoredes/typescript-tips',
        language: 'pt-BR',
      },
    ],
    date: '2023-12-22',
    excerpt: 'Advanced TypeScript techniques for better type safety and developer experience',
  },
];
