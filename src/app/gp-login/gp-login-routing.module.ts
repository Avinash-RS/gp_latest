import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GpLoginComponent } from './gp-login.component';
import { GpForgotPasswordComponent } from './gp-forgot-password/gp-forgot-password.component';
import { GpLoginBoardComponent } from './gp-login-board/gp-login-board.component';
import { GpPasswordResetComponent } from './gp-password-reset/gp-password-reset.component';
import { IfauthGuard } from '../auth/ifauth.guard';


const loginroutes: Routes = [
  {
    path: '',
    component: GpLoginComponent,
    children: [
      {
        path: 'login', component: GpLoginBoardComponent
      },
      // {
      //   path: 'forgot-password', component: GpForgotPasswordComponent
      // },
      // {
      //   path: 'password-reset', component: GpPasswordResetComponent
      // },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(loginroutes)],
  exports: [RouterModule]
})
export class GpLoginRoutingModule { }
