import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(public router: Router) {}

  // ✅ ADD THIS METHOD
  isAuthPage(): boolean {
    return this.router.url.includes('/login') || this.router.url.includes('/signup');
  }
}
