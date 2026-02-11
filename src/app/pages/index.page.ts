import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-index',
  template: '',
})
export default class IndexPage {
  constructor(private readonly router: Router) {
    this.router.navigate(['/home'], { replaceUrl: true });
  }
}
