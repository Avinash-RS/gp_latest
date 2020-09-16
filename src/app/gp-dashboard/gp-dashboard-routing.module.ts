import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GpDashboardComponent } from './gp-dashboard.component';
import { GpAddTasksComponent } from './gp-add-tasks/gp-add-tasks.component';
import { GpViewMilestoneComponent } from './gp-view-milestone/gp-view-milestone.component';
import { GpVersionDashboardComponent } from './gp-version-dashboard/gp-version-dashboard.component';
import { GpSprintDashboardComponent } from './gp-version-dashboard/gp-sprint-dashboard/gp-sprint-dashboard.component';
import { GpSprintDetailBoardComponent } from './gp-sprint-detail-board/gp-sprint-detail-board.component';
import { GpCommentsComponent } from './gp-comments/gp-comments.component';


const dashboardroutes: Routes = [
  {
    path: '',
    component: GpDashboardComponent,
    children: [
      {
        path: '', component: GpVersionDashboardComponent, children: [
          {
            path: ':sid/s', component: GpSprintDashboardComponent,
            children: [
              {
                path: ':scid/comments', component: GpCommentsComponent
              }
            ]
          },
          {
            path: 'r/:sid/comments', component: GpSprintDashboardComponent,
          },
          {
            path: 'add', component: GpAddTasksComponent
          },
          {
            path: ':id/view', component: GpViewMilestoneComponent
          },
          {
            path: ':mid/edit', component: GpAddTasksComponent
          },
          {
            path: ':id/comments', component: GpCommentsComponent
          }
        ]
      },
    ]
  },

  // {
  //   path: ':sid/sprints', component: GpVersionDashboardComponent
  // },

  {
    path: ':sid/t/:tid/f/:fid/detail-board', component: GpSprintDetailBoardComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(dashboardroutes)],
  exports: [RouterModule]
})
export class GpDashboardRoutingModule { }
