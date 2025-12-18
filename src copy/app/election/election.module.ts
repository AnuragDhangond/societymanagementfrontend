import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ElectionRoutingModule } from './election-routing.module';
import { ElectionComponent } from './election.component';


@NgModule({
  declarations: [
    ElectionComponent
  ],
  imports: [
    CommonModule,
    ElectionRoutingModule
  ]
})
export class ElectionModule { }
