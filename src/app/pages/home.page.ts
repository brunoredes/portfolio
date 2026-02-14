import { Component } from '@angular/core';
import { Blog } from '../domain/home/components/blog/blog';
import { Contact } from '../domain/home/components/contact/contact';
import { Experience } from "../domain/home/components/experience/experience";
import { Hero } from '../domain/home/components/hero/hero';
import { Projects } from '../domain/home/components/projects/projects';
import { TechStack } from '../domain/home/components/tech-stack/tech-stack';

@Component({
  selector: 'app-home',
  imports: [Hero, Projects, Experience, Blog, TechStack, Contact],
  templateUrl: './home.page.html',
  styleUrl: './home.page.css',
})
export default class HomePage { }
