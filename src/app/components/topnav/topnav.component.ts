import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-topnav',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './topnav.component.html',
  styleUrls: ['./topnav.component.css']
})
export class TopnavComponent {
  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  instagram() {
    window.open('https://www.instagram.com/_dna_constructions_architects_/', '_blank');
  }

  youtube() {
    window.open('https://www.youtube.com/@dnaconstructionsarchitect3233', '_blank');
  }

  // Scroll to top on navigation to avoid partial offsets and ensure content starts at the viewport top
  scrollTop() {
    // Close mobile menu if open
    if (this.isMenuOpen) {
      this.isMenuOpen = false;
    }
    // Use smooth scroll where supported
    try {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    } catch {
      // Fallback for older browsers
      window.scrollTo(0, 0);
    }
  }
}
