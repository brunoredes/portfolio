import { Component } from '@angular/core';
import { BLOG_POSTS } from '../../data/blog';

@Component({
  selector: 'app-blog',
  imports: [],
  templateUrl: './blog.html',
  styleUrl: './blog.css',
})
export class Blog {
  protected posts = BLOG_POSTS;

  getPlatformIcon(platform: 'dev.to' | 'medium'): string {
    return platform === 'dev.to' ? 'article' : 'description';
  }
}
