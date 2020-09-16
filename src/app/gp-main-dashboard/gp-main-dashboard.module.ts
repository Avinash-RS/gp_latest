import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GpMainDashboardRoutingModule } from './gp-main-dashboard-routing.module';
import { GpMainDashboardComponent } from './gp-main-dashboard.component';
import { GpMaterialModule } from '../shared/gp-material.module';
import { SharedModule } from '../shared/shared.module';
import { GpAddTasksComponent } from '../gp-dashboard/gp-add-tasks/gp-add-tasks.component';
import { MalihuScrollbarModule } from 'ngx-malihu-scrollbar';


@NgModule({
  declarations: [
    GpMainDashboardComponent,
    // GpAddTasksComponent
  ],
  imports: [
    CommonModule,
    GpMainDashboardRoutingModule,
    GpMaterialModule,
    SharedModule,
    MalihuScrollbarModule
  ]
})
export class GpMainDashboardModule { }
