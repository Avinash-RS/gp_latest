import { BrowserModule } from '@angular/platform-browser';
import { NgModule, forwardRef } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GpMaterialModule } from './shared/gp-material.module';
import { AgmCoreModule } from '@agm/core';
import { ModalInfoWithbuttonComponent } from './shared/modal-info-withbutton/modal-info-withbutton.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthGuard } from './auth/auth.guard';
import { IfauthGuard } from './auth/ifauth.guard';
import { MyInterceptor } from './interceptor/interceptor';
import { MalihuScrollbarModule } from 'ngx-malihu-scrollbar';
import { GpAddMembersComponent } from './gp-teams/gp-add-members/gp-add-members.component';
import { InternationalPhoneNumberModule } from 'ngx-international-phone-number';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { GpForgotPasswordComponent } from './gp-login/gp-forgot-password/gp-forgot-password.component';
import { GpPasswordResetComponent } from './gp-login/gp-password-reset/gp-password-reset.component';
import { GpLoginBoardComponent } from './gp-login/gp-login-board/gp-login-board.component';

@NgModule({
  declarations: [
    AppComponent,
    GpLoginBoardComponent,
    GpForgotPasswordComponent,
    GpPasswordResetComponent
  ],
  imports: [
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBWb8W2cEFg6Wk_x2jVNsL9xd2Awkmho44',
      libraries: ['places']
    }),
    BrowserModule,
    SharedModule,
    GpMaterialModule,
    BrowserAnimationsModule,
    HttpClientModule,
    InternationalPhoneNumberModule,
    MalihuScrollbarModule.forRoot(),
    AppRoutingModule,
  ],
  providers: [
    AuthGuard,
    IfauthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MyInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
  entryComponents: [ModalInfoWithbuttonComponent]
})
export class AppModule { }
