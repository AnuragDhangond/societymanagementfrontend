import { Component, OnInit, HostBinding } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { UiService } from '../shared/ui.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  isLoggedIn = false;
  userRole = ''; // ⭐ NEW

  @HostBinding('class.open') isOpen = false; 

  constructor(
    private router: Router,
    private ui: UiService
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    this.userRole = localStorage.getItem('role') || ''; // ⭐ GET ROLE

    this.ui.sidebarToggle$.subscribe(() => {
      this.isOpen = !this.isOpen;
    });

    // Automatically close sidebar when clicking a tab/route change
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.isOpen = false;
    });
  }

  closeSidebar() {
    this.isOpen = false;
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}