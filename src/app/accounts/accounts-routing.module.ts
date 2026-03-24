import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { IncomeBookComponent } from './income-book/income-book.component';
import { ExpenseBookComponent } from './expense-book/expense-book.component';
import { LedgerBookComponent } from './ledger-book/ledger-book.component';
import { BalanceSheetComponent } from './balance-sheet/balance-sheet.component';

const routes: Routes = [
  // ⭐ DEFAULT PAGE when clicking /accounts
  { path: '', component: DashboardComponent },

  // Optional (for future navigation)
  { path: 'income', component: IncomeBookComponent },
  { path: 'expense', component: ExpenseBookComponent },
  { path: 'ledger', component: LedgerBookComponent },
  { path: 'balance', component: BalanceSheetComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountsRoutingModule { }