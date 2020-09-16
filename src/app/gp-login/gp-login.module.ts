import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GpLoginRoutingModule } from './gp-login-routing.module';
import { GpLoginComponent } from './gp-login.component';
import { GpForgotPasswordComponent } from './gp-forgot-password/gp-forgot-password.component';
import { SharedModule } from '../shared/shared.module';
import { GpMaterialModule } from '../shared/gp-material.module';
import { GpLoginBoardComponent } from './gp-login-board/gp-login-board.component';
import { GpPasswordResetComponent } from './gp-password-reset/gp-password-reset.component';


@NgModule({
  declarations: [GpLoginComponent],
  imports: [
    CommonModule,
    GpLoginRoutingModule,
    SharedModule,
    GpMaterialModule
  ]
})
export class GpLoginModule { }
