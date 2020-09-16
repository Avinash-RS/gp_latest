import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { GpEmailVerifyLoaderComponent } from './shared/gp-email-verify-loader/gp-email-verify-loader.component';
import { IfauthGuard } from './auth/ifauth.guard';
import { PageNotFoundComponent } from './shared/page-not-found/page-not-found.component';
import { GpForgotPasswordComponent } from './gp-login/gp-forgot-password/gp-forgot-password.component';
import { GpPasswordResetComponent } from './gp-login/gp-password-reset/gp-password-reset.component';
import { GpLoginBoardComponent } from './gp-login/gp-login-board/gp-login-board.component';


const routes: Routes = [
  // {
  //   path: '', loadChildren: './gp-login/gp-login.module#GpLoginModule', canActivate: [IfauthGuard]
  // },
  {
    path: 'login', pathMatch: 'full', component: GpLoginBoardComponent, canActivate: [IfauthGuard]
  },
  {
    path: 'forgot-password', component: GpForgotPasswordComponent
  },
  {
    path: 'password-reset', component: GpPasswordResetComponent
  },
  {
    path: '', loadChildren: './gp-main-dashboard/gp-main-dashboard.module#GpMainDashboardModule', canActivate: [AuthGuard]
  },
  {
    path: 'verify/:id', component: GpEmailVerifyLoaderComponent
  },
  {
    path: 'pagenotfound', component: PageNotFoundComponent
  },
  {
    path: '**', component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(
    routes,
    {
      preloadingStrategy: PreloadAllModules
    }
  )],
  exports: [RouterModule]
})
export class AppRoutingModule { }
