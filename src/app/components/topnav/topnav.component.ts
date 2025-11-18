import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-topnav',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './topnav.component.html',
  styleUrls: ['./topnav.component.css']
})
export class TopnavComponent implements OnInit, OnDestroy {
  isMenuOpen = false;
  isNavbarHidden = false;
  private lastScrollTop = 0;
  private scrollThreshold = 100; // Minimum scroll before hiding navbar
  private scrollDelta = 5; // Minimum scroll change to trigger hide/show

  ngOnInit() {
    // Initialize scroll position
    this.lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;
  }

  ngOnDestroy() {
    // Cleanup if needed
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

    // Handle negative scrolling (bounce effect on mobile)
    if (currentScroll < 0) {
      return;
    }

    // If scrolled less than threshold, always show navbar
    if (currentScroll < this.scrollThreshold) {
      this.isNavbarHidden = false;
      this.lastScrollTop = currentScroll;
      return;
    }

    // Check if scroll change is significant enough
    const scrollDifference = Math.abs(currentScroll - this.lastScrollTop);
    if (scrollDifference < this.scrollDelta) {
      return;
    }

    // Scrolling down - hide navbar
    if (currentScroll > this.lastScrollTop) {
      this.isNavbarHidden = true;
      // Close mobile menu when scrolling down
      if (this.isMenuOpen) {
        this.isMenuOpen = false;
      }
    }
    // Scrolling up - show navbar
    else {
      this.isNavbarHidden = false;
    }

    this.lastScrollTop = currentScroll;
  }

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
