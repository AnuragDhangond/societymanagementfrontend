import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  constructor(private router: Router) {}

  isMembersPage(): boolean {
    return this.router.url.includes('/members');
  }

  isMaintenancePage(): boolean {
    return this.router.url.includes('/maintenance');
  }

  // 🔑 Signal ONLY (no business logic)
  triggerAddMember() {
    this.router.navigate([], { queryParams: { action: 'addMember' } });
  }
}
