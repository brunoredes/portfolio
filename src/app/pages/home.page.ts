import { Component } from '@angular/core';
import { Blog } from '../components/blog/blog';
import { Header } from "../components/header/header";
import { Hero } from '../components/hero/hero';
import { Projects } from '../components/projects/projects';
import { TechStack } from '../components/tech-stack/tech-stack';
import { Contact } from '../components/contact/contact';
import { Footer } from "../components/footer/footer";

@Component({
  selector: 'app-home',
  imports: [Header, Hero, Projects, Blog, TechStack, Contact, Footer],
  templateUrl: './home.page.html',
  styleUrl: './home.page.css',
})
export default class HomePage {

}
