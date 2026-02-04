export interface BlogPost {
  id: string;
  title: string;
  platform: 'dev.to' | 'medium';
  date: string;
  url: string;
  excerpt?: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'scalable-react-apps',
    title: 'Building Scalable React Apps',
    platform: 'dev.to',
    date: '15/01/2024',
    url: 'https://dev.to/brunoredes/building-scalable-react-apps',
    excerpt: 'Best practices for building large-scale React applications with TypeScript',
  },
  {
    id: 'microservices-architecture',
    title: 'Microservices Architecture',
    platform: 'medium',
    date: '08/01/2024',
    url: 'https://medium.com/@brunoredes/microservices-architecture',
    excerpt: 'A deep dive into microservices patterns and implementation strategies',
  },
  {
    id: 'typescript-tips',
    title: 'TypeScript Tips',
    platform: 'dev.to',
    date: '22/12/2023',
    url: 'https://dev.to/brunoredes/typescript-tips',
    excerpt: 'Advanced TypeScript techniques for better type safety and developer experience',
  },
];
