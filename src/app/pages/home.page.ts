import { Component } from '@angular/core';
import { Experience } from "../components/experience/experience";
import { Blog } from '../components/blog/blog';
import { Contact } from '../components/contact/contact';
import { Footer } from "../components/footer/footer";
import { Header } from "../components/header/header";
import { Hero } from '../components/hero/hero';
import { Projects } from '../components/projects/projects';
import { TechStack } from '../components/tech-stack/tech-stack';

@Component({
  selector: 'app-home',
  imports: [Header, Hero, Projects, Experience, Blog, TechStack, Contact, Footer],
  templateUrl: './home.page.html',
  styleUrl: './home.page.css',
})
export default class HomePage {

}
