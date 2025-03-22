import { Component } from '@angular/core';
import { TopnavComponent } from '../components/topnav/topnav.component';
import { BottomnavComponent } from '../components/bottomnav/bottomnav.component';
@Component({
  selector: 'app-what-we-offer',
  standalone: true,
  imports: [TopnavComponent, BottomnavComponent],
  templateUrl: './what-we-offer.component.html',
  styleUrl: './what-we-offer.component.css'
})
export class WhatWeOfferComponent {

}
