import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComplaintsRoutingModule } from './complaints-routing.module';
import { ComplaintsComponent } from './complaints.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ComplaintsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ComplaintsRoutingModule
  ]
})
export class ComplaintsModule { }
