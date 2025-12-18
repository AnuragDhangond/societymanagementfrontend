// src/app/members/members-routing.module.ts

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// Update path for the moved component
import { MemberDashComponent } from './member-dash.component'; 

const routes: Routes = [
  // The path is empty because the parent path ('members') is handled in app-routing.module.ts
  { path: '', component: MemberDashComponent } 
];

@NgModule({
  imports: [RouterModule.forChild(routes)], // Use forChild() for feature modules
  exports: [RouterModule]
})
export class MembersRoutingModule { }