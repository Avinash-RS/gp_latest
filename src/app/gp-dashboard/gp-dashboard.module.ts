import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GpDashboardRoutingModule } from './gp-dashboard-routing.module';
import { GpDashboardComponent } from './gp-dashboard.component';
import { GpVersionDashboardComponent } from './gp-version-dashboard/gp-version-dashboard.component';
import { GpSprintProgressBarComponent } from './gp-version-dashboard/gp-sprint-progress-bar/gp-sprint-progress-bar.component';
import { GpSprintLaunchdateComponent } from './gp-version-dashboard/gp-sprint-launchdate/gp-sprint-launchdate.component';
import { GpSprintStoriesBoardComponent } from './gp-version-dashboard/gp-sprint-stories-board/gp-sprint-stories-board.component';
import { GpCommentsComponent } from './gp-comments/gp-comments.component';
import { GpAddTasksComponent, EllipsisPipe, datePipe } from './gp-add-tasks/gp-add-tasks.component';
import { GpMaterialModule } from '../shared/gp-material.module';
import { SharedModule } from '../shared/shared.module';
import { GpStoriesTabComponent } from './gp-version-dashboard/gp-sprint-stories-board/gp-stories-tab/gp-stories-tab.component';
import { GpViewMilestoneComponent } from './gp-view-milestone/gp-view-milestone.component';
import { GandChartComponent, TooltipListPipe } from './gp-gantt-chart/gand-chart.component';
import { GpSprintDashboardComponent } from './gp-version-dashboard/gp-sprint-dashboard/gp-sprint-dashboard.component';
import { GpSprintDetailBoardComponent } from './gp-sprint-detail-board/gp-sprint-detail-board.component';
import { MalihuScrollbarModule } from 'ngx-malihu-scrollbar';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { GpErrorDialogComponent } from '../shared/gp-error-dialog/gp-error-dialog.component';
import { MentionModule } from 'angular-mentions';
import { NgZorroAntdModule, NZ_I18N, en_US } from 'ng-zorro-antd';





@NgModule({
  // tslint:disable-next-line: max-line-length
  declarations: [
    GpDashboardComponent,
    GpVersionDashboardComponent,
    GpSprintProgressBarComponent,
    GpSprintLaunchdateComponent,
    GpSprintStoriesBoardComponent,
    GandChartComponent,
    GpCommentsComponent,
    GpAddTasksComponent,
    GpStoriesTabComponent,
    GpViewMilestoneComponent,
    GpSprintDashboardComponent,
    GpSprintDetailBoardComponent,
    TooltipListPipe,
    EllipsisPipe,
    datePipe
  ],
  imports: [
    CommonModule,
    GpDashboardRoutingModule,
    GpMaterialModule,
    SharedModule,
    MalihuScrollbarModule.forRoot(),
    AngularEditorModule,
    MentionModule,
    NgZorroAntdModule
  ],
  entryComponents: [GpErrorDialogComponent]
})
export class GpDashboardModule { }
