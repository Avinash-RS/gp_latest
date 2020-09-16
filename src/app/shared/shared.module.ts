import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { GpHeaderComponent } from './gp-header/gp-header.component';
import { GpMaterialModule } from './gp-material.module';
import { GpSidebarComponent } from './gp-sidebar/gp-sidebar.component';
import { ModalInfoWithbuttonComponent } from './modal-info-withbutton/modal-info-withbutton.component';
import { GpEmailVerfierComponent } from './gp-email-verfier/gp-email-verfier.component';
import { GpEmailVerifyLoaderComponent } from './gp-email-verify-loader/gp-email-verify-loader.component';
import { Routes, RouterModule } from '@angular/router';
import { GpLoaderComponent } from './gp-loader/gp-loader.component';
import { GpErrorDialogComponent } from './gp-error-dialog/gp-error-dialog.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';



@NgModule({
  declarations: [
    GpHeaderComponent,
    GpSidebarComponent,
    ModalInfoWithbuttonComponent,
    GpEmailVerfierComponent,
    GpEmailVerifyLoaderComponent,
    GpLoaderComponent,
    GpErrorDialogComponent,
    PageNotFoundComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    GpMaterialModule,
    RouterModule,
  ],
  entryComponents: [GpErrorDialogComponent],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    GpHeaderComponent,
    GpSidebarComponent,
    ModalInfoWithbuttonComponent,
    GpEmailVerfierComponent,
    GpEmailVerifyLoaderComponent,
    RouterModule,
    GpLoaderComponent,
    GpErrorDialogComponent
  ]
})
export class SharedModule { }
