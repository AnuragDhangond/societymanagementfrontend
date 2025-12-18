// src/app/members/members.module.ts

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MembersRoutingModule } from './members-routing.module';
import { MemberDashComponent } from './member-dash.component'; 
import { ReactiveFormsModule } from '@angular/forms'; // <-- ADD THIS IF MemberDashComponent uses forms

import { NavbarComponent } from '../layout/navbar/navbar.component';

@NgModule({
  declarations: [
    MemberDashComponent // Declare the component here
    // NavbarComponent
  ],
  imports: [
    CommonModule,
    MembersRoutingModule,
    ReactiveFormsModule // <-- Import feature-specific modules here
  ]
})
export class MembersModule { }