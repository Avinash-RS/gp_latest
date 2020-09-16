import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpTeamsComponent } from './gp-teams-list/gp-teams.component';
import { GpTeamsRoutingModule } from './gp-teams-routing.module';
import { SharedModule } from '../shared/shared.module';
import { GpMaterialModule } from '../shared/gp-material.module';
import { GpMembersComponent } from './gp-members/gp-members.component';
import { GpAddTeamsComponent } from './gp-add-teams/gp-add-teams.component';
import { GpAddMembersComponent } from './gp-add-members/gp-add-members.component';
import { InternationalPhoneNumberModule } from 'ngx-international-phone-number';
import { GpErrorDialogComponent } from '../shared/gp-error-dialog/gp-error-dialog.component';



@NgModule({
  declarations: [GpTeamsComponent, GpMembersComponent, GpAddTeamsComponent, GpAddMembersComponent],
  imports: [
    CommonModule,
    GpTeamsRoutingModule,
    SharedModule,
    GpMaterialModule,
    InternationalPhoneNumberModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
  entryComponents: [GpAddMembersComponent, GpErrorDialogComponent]
})
export class GpTeamsmoduleModule { }
