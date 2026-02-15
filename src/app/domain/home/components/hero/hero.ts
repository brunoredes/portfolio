import { NgOptimizedImage } from '@angular/common';
import { Component, inject } from '@angular/core';
import { HeroImage } from '../../services/hero-image';

@Component({
  selector: 'app-hero',
  imports: [NgOptimizedImage],
  templateUrl: './hero.html',
  styleUrl: './hero.css',
})
export class Hero {
  private readonly heroImage = inject(HeroImage);
  private readonly resolved = this.heroImage.resolve();

  protected readonly photoUrl = this.resolved.url;
  protected readonly photoWidth = this.resolved.width;
  protected readonly photoHeight = this.resolved.height;
}
