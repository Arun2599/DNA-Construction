import { Component, ElementRef, AfterViewInit, ViewChild, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BottomnavComponent } from "../components/bottomnav/bottomnav.component";
import { TopnavComponent } from "../components/topnav/topnav.component";

interface Project {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
}

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, BottomnavComponent, TopnavComponent],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements AfterViewInit {
  activeFilter: string = 'all';
  @ViewChild('filterScroll', { static: false }) filterScrollRef?: ElementRef<HTMLDivElement>;
  showLeft: boolean = false;
  showRight: boolean = false;
  
  projects: Project[] = [
    {
      id: 1,
      title: 'Modern Office Building',
      description: 'Interior work',
      imageUrl: 'assets/images/projects/project1.jpg',
      category: 'interior'
    },
    {
      id: 2,
      title: 'Luxury Apartment',
      description: 'Construction work',
      imageUrl: 'assets/images/projects/project2.jpg',
      category: 'construction'
    },
    {
      id: 3,
      title: 'Shopping Complex',
      description: 'Architecture design',
      imageUrl: 'assets/images/projects/project3.jpg',
      category: 'architecture'
    },
    {
      id: 4,
      title: 'Residential Villa',
      description: 'Building work',
      imageUrl: 'assets/images/projects/project4.jpg',
      category: 'building'
    },
    {
      id: 5,
      title: 'Heritage Building',
      description: 'Renovation work',
      imageUrl: 'assets/images/projects/project5.jpg',
      category: 'renovation'
    },
    {
      id: 6,
      title: 'Corporate Office',
      description: 'Interior design',
      imageUrl: 'assets/images/projects/project6.jpg',
      category: 'interior'
    },
    {
      id: 7,
      title: 'Modern House',
      description: 'Construction work',
      imageUrl: 'assets/images/projects/project7.jpg',
      category: 'construction'
    },
    {
      id: 8,
      title: 'Commercial Complex',
      description: 'Architecture design',
      imageUrl: 'assets/images/projects/project8.jpg',
      category: 'architecture'
    },
    {
      id: 9,
      title: 'Beach House',
      description: 'Building work',
      imageUrl: 'assets/images/projects/project9.jpg',
      category: 'building'
    }
  ];

  get filteredProjects(): Project[] {
    if (this.activeFilter === 'all') {
      return this.projects;
    }
    return this.projects.filter(project => project.category === this.activeFilter);
  }

  filterProjects(category: string): void {
    this.activeFilter = category;
  }

  ngAfterViewInit(): void {
    // Evaluate arrow visibility once view is ready
    setTimeout(() => this.updateArrows(), 0);
    // Attach scroll listener to update indicators
    this.filterScrollRef?.nativeElement.addEventListener('scroll', this.updateArrows, { passive: true });
    // Also on images/fonts load layout may change
    window.addEventListener('load', this.updateArrows, { once: false });
  }

  @HostListener('window:resize') onResize() {
    this.updateArrows();
  }

  // Use arrow function to preserve `this`
  updateArrows = (): void => {
    const el = this.filterScrollRef?.nativeElement;
    if (!el) { return; }
    const maxScroll = el.scrollWidth - el.clientWidth;
    this.showLeft = el.scrollLeft > 2;
    this.showRight = el.scrollLeft < maxScroll - 2;
  };

  scrollLeftBy(): void {
    const el = this.filterScrollRef?.nativeElement;
    if (!el) { return; }
    el.scrollBy({ left: -Math.max(150, el.clientWidth * 0.6), behavior: 'smooth' });
  }

  scrollRightBy(): void {
    const el = this.filterScrollRef?.nativeElement;
    if (!el) { return; }
    el.scrollBy({ left: Math.max(150, el.clientWidth * 0.6), behavior: 'smooth' });
  }
}
