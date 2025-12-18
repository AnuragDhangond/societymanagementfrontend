import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ElectionComponent } from './election.component';

const routes: Routes = [{ path: '', component: ElectionComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ElectionRoutingModule { }
