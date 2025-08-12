import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopnavComponent } from '../components/topnav/topnav.component';
import { BottomnavComponent } from '../components/bottomnav/bottomnav.component';
import { Router } from '@angular/router';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, TopnavComponent, BottomnavComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  @ViewChild('projectsContainer') projectsContainer!: ElementRef;
  @ViewChild('testimonialsContainer') testimonialsContainer!: ElementRef;
  @ViewChild('aboutSection') aboutSection!: ElementRef<HTMLElement>;

  constructor(private router: Router) {}

  scrollProjects(direction: 'left' | 'right'): void {
    const container = this.projectsContainer.nativeElement;
    const scrollAmount = 400; // Adjust this value to control scroll distance
    
    if (direction === 'left') {
      container.scrollLeft -= scrollAmount;
    } else {
      container.scrollLeft += scrollAmount;
    }
  }

  navigateToProjects(): void {
    this.router.navigate(['/projects']);
  }

  scrollToAbout(): void {
    if (this.aboutSection?.nativeElement) {
      this.aboutSection.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  scrollTestimonials(direction: 'left' | 'right'): void {
    const container = this.testimonialsContainer.nativeElement;
    const scrollAmount = 450; // Adjust this value to control scroll distance
    
    if (direction === 'left') {
      container.scrollLeft -= scrollAmount;
    } else {
      container.scrollLeft += scrollAmount;
    }
  }

  projects = [
    {
      image: 'assets/images/project1.jpg',
      title: 'Modern Office Complex',
      category: 'Commercial'
    },
    {
      image: 'assets/images/project2.jpg',
      title: 'Luxury Apartments',
      category: 'Residential'
    },
    {
      image: 'assets/images/project3.jpg',
      title: 'Shopping Mall',
      category: 'Commercial'
    }
  ];

  testimonials = [
    {
      text: 'Exceptional quality and professionalism in every aspect of their work. The team delivered our project ahead of schedule.',
      name: 'John D.',
      position: 'Project Manager'
    },
    {
      text: 'Outstanding attention to detail and excellent communication throughout the entire construction process.',
      name: 'Sarah M.',
      position: 'Property Developer'
    },
    {
      text: 'Innovative solutions and sustainable practices. Highly recommended for any construction project!',
      name: 'Michael R.',
      position: 'Business Owner'
    }
  ];
}
