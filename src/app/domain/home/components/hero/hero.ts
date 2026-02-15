import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-hero',
  imports: [NgOptimizedImage],
  templateUrl: './hero.html',
  styleUrl: './hero.css',
})
export class Hero {
  protected readonly photoUrl = '/hero/donatelli-400w.avif';
  protected readonly photoWidth = 400;  // 2:3 portrait ratio
  protected readonly photoHeight = 600;
}
