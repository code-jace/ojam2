import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [FormsModule, CommonModule, MatFormField, MatInput, MatButton],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent {

  constructor(private router: Router) {}

  manualSessionId: string = '';

  navigateToPlayerPage(){
    this.router.navigate(['/player']); // Navigate to voter page with manualSessionId

  }

  navigateToVoterPage() {
    if (this.manualSessionId) {
      this.router.navigate(['/sesh', this.manualSessionId], { onSameUrlNavigation: 'reload' }); // Navigate to voter page with manualSessionId
    } else {
      console.error('No session ID entered.');
    }
  }


}
