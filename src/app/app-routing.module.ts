// app-routing.module.ts

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
// **REMOVE** the import for MemberDashComponent here: 
// import { MemberDashComponent } from './member-dash/member-dash.component'; 

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  
  // Lazy Loading Configuration:
  { 
    path: 'members', 
    loadChildren: () => import('./members/members.module').then(m => m.MembersModule) 
  },
  { path: 'maintenance', loadChildren: () => import('./maintenance/maintenance.module').then(m => m.MaintenanceModule) },
  { path: 'complaints', loadChildren: () => import('./complaints/complaints.module').then(m => m.ComplaintsModule) },
  { path: 'expenses', loadChildren: () => import('./expenses/expenses.module').then(m => m.ExpensesModule) },
  { path: 'notice',loadChildren: () => import('./notice/notice.module').then(m => m.NoticeModule)},
  {path: 'accounts',loadChildren: () => import('./accounts/accounts.module').then(m => m.AccountsModule)},
  { path: 'election', loadChildren: () => import('./election/election.module').then(m => m.ElectionModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }