import { Component, OnInit, HostBinding } from '@angular/core';
import { Router } from '@angular/router';
import { UiService } from '../shared/ui.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  isLoggedIn = false;

  @HostBinding('class.open') isOpen = false; 

  constructor(
    private router: Router,
    private ui: UiService
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    this.ui.sidebarToggle$.subscribe(() => {
      this.isOpen = !this.isOpen;
    });
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
