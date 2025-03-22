import { Component } from '@angular/core';
import { TopnavComponent } from '../components/topnav/topnav.component';
import { BottomnavComponent } from '../components/bottomnav/bottomnav.component';
@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [TopnavComponent, BottomnavComponent],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.css'
})
export class ContactUsComponent {

}
