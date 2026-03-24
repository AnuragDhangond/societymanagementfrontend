import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NoticeRoutingModule } from './notice-routing.module';
import { NoticeComponent } from './notice.component';

@NgModule({
  declarations: [
    NoticeComponent
  ],
  imports: [
    CommonModule,
    FormsModule,        
    NoticeRoutingModule
  ]
})
export class NoticeModule { }
