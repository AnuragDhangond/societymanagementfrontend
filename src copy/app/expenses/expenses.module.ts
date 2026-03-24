import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpensesComponent } from './expenses.component';
import { ExpensesRoutingModule } from './expenses-routing.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ExpensesComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ExpensesRoutingModule
  ]
})
export class ExpensesModule { }
