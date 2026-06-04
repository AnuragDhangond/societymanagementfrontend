import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { ElectionRoutingModule } from './election-routing.module';
import { ElectionComponent } from './election.component';

@NgModule({
  declarations: [
    ElectionComponent
  ],
  imports: [
    CommonModule,
    ElectionRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class ElectionModule { }
