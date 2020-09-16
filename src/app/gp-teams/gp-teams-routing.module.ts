import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GpTeamsComponent } from './gp-teams-list/gp-teams.component';
import { GpAddMembersComponent } from './gp-add-members/gp-add-members.component';

const teamRoutes: Routes = [
{
  path: '',
  component: GpTeamsComponent,
}
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(teamRoutes)
  ],
  exports: [RouterModule]
})
export class GpTeamsRoutingModule { }
