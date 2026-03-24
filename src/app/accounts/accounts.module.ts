import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountsRoutingModule } from './accounts-routing.module';
import { IncomeBookComponent } from './income-book/income-book.component';
import { ExpenseBookComponent } from './expense-book/expense-book.component';
import { LedgerBookComponent } from './ledger-book/ledger-book.component';
import { BalanceSheetComponent } from './balance-sheet/balance-sheet.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    IncomeBookComponent,
    ExpenseBookComponent,
    LedgerBookComponent,
    BalanceSheetComponent,
    DashboardComponent
  ],
  imports: [
    CommonModule,
    AccountsRoutingModule,
    FormsModule
  ]
})
export class AccountsModule { }
