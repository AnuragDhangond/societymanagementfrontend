import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UiService } from '../../shared/ui.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  isAdmin = false;

  constructor(
    private router: Router,
    private ui: UiService
  ) {}

  ngOnInit(): void {
    const role = localStorage.getItem('role');
    this.isAdmin = role === 'admin';
  }

  isMembersPage(): boolean {
    return this.router.url.includes('/members');
  }

  triggerAddMember() {
    if (!this.isAdmin) return;   // 🔐 SAFETY
    this.ui.openAddMember$.next();
  }

  toggleSidebar() {
    this.ui.sidebarToggle$.next();
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
