import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GpMainDashboardComponent } from './gp-main-dashboard.component';
import { GpAddMembersComponent } from '../gp-teams/gp-add-members/gp-add-members.component';


const mainDashboardroutes: Routes = [
  {
    path: '',
    component: GpMainDashboardComponent,
    children: [
      {
        path: 'p/:pid/m',
        loadChildren:
        '../gp-dashboard/gp-dashboard.module#GpDashboardModule'
      },
      {
        path: 'p/:pid/t',
        loadChildren: '../gp-teams/gp-teamsmodule.module#GpTeamsmoduleModule'
      },
      {
        path: 'p/:pid/powerBI',
        loadChildren: '../gp-power-bi/gp-power-bi.module#GpPowerBIModule'
      },
      {
        path: 'p/:pid/profile',
        loadChildren: '../gp-profile/gp-profile.module#GpProfileModule'
      },
      {
        path: '',
        redirectTo: '',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(mainDashboardroutes)],
  exports: [RouterModule]
})
export class GpMainDashboardRoutingModule { }
