import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UiService {

  // sidebar toggle
  sidebarToggle$ = new Subject<void>();

  // add member button
  openAddMember$ = new Subject<void>();
}
