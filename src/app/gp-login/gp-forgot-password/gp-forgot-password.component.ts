import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { IModalInfo } from 'src/app/Interface/model';
import { ModalInfoWithbuttonComponent } from 'src/app/shared/modal-info-withbutton/modal-info-withbutton.component';
import { MatDialog } from '@angular/material';
import { APIService } from 'src/app/services/api.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-gp-forgot-password',
  templateUrl: './gp-forgot-password.component.html',
  styleUrls: ['./gp-forgot-password.component.scss']
})
export class GpForgotPasswordComponent implements OnInit {

  forgetPasswordForm: FormGroup;
  email: any;

  constructor(
    private fb: FormBuilder,
    private route: Router,
    public dialog: MatDialog,
    private apiService: APIService,
    private commonServices: CommonService
  ) { }

  ngOnInit() {
    // tslint:disable-next-line: max-line-length
    const emailregex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    // Login Form Controls
    this.forgetPasswordForm = this.fb.group({
      userEmail: ['', [Validators.required, Validators.pattern(emailregex)]]
    });

  }

  // To validate all fields after submit
  validateAllFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFields(control);
      }
    });
  }


  // Form Getters
  get userEmail() {
    return this.forgetPasswordForm.get('userEmail');
  }

  // Forgot Password form
  forgetPassword() {
    if (this.forgetPasswordForm.valid) {
      const email = { email: this.forgetPasswordForm.value.userEmail.toString().toLowerCase() };
      const data = { message: 'Reset link sent to the email' };
      this.apiService.forgotPassword(email).subscribe((success: any) => {
        this.openDialog(data);
      });
    } else {
      this.validateAllFields(this.forgetPasswordForm);
    }
  }

  // Back to login
  backtoLogin() {
    localStorage.clear();
    this.route.navigate(['/login']);
  }

  emptyFormField() {
    this.forgetPasswordForm.reset();
  }

  // Open dailog
  openDialog(data: any) {
    let dialogDetails: IModalInfo;
    let pageContent;

    if (data.message === 'Reset link sent to the email') {
      // tslint:disable-next-line: max-line-length
      pageContent = '<p>An Email has been sent to the Entered Email Address.</p> <p>Click on the reset button in the email to reset your Password</p>';
    } else {
      pageContent = data.message;
    }

    dialogDetails = {
      iconName: 'success',
      showCancel: false,
      content: pageContent,
      buttonText: 'Okay'
    };

    /**
     * Dialog modal window
     */
    // tslint:disable-next-line: one-variable-per-declaration
    const dialogRef = this.dialog.open(ModalInfoWithbuttonComponent, {
      width: '550px',
      height: '290px',
      data: dialogDetails
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Empty form field
        this.emptyFormField();
        // back to loggin page
        this.backtoLogin();
      }
    });
  }
}
