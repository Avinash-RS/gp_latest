import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { IModalInfo } from 'src/app/Interface/model';
import { ModalInfoWithbuttonComponent } from 'src/app/shared/modal-info-withbutton/modal-info-withbutton.component';
import { CustomValidators } from 'src/app/helper/password-validators';
import { APIService } from 'src/app/services/api.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-gp-password-reset',
  templateUrl: './gp-password-reset.component.html',
  styleUrls: ['./gp-password-reset.component.scss']
})
export class GpPasswordResetComponent implements OnInit {

  passwordResetForm: FormGroup;
  passMismatchText: any;


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
    this.passwordResetForm = this.fb.group({
      //      userEmail: ['', [Validators.required, Validators.pattern(emailregex)]],
      password: ['',
        Validators.compose([
          // Password Field is Required
          Validators.required,
          // check whether the entered password has a number
          CustomValidators.patternValidator(/\d/, { hasNumber: true }),
          // check whether the entered password has upper case letter
          CustomValidators.patternValidator(/[A-Z]/, {
            hasCapitalCase: true
          }),
          // check whether the entered password has a special character
          /*CustomValidators.patternValidator(
            /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
            { hasSpecialCharacters: true }
          ),*/
          // Has a minimum length of 8 characters
          Validators.minLength(8)
        ])
      ],
      confirmPassword: ['', Validators.required]
    },
      { validator: this.checkPasswords });
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


  //   /**
  //  * Check Password match
  //  * @param group: any
  //  */
  checkPasswords(group: FormGroup) {
    // here we have checking password and new password match
    const pass = group.value.newPassword;
    const confirmPass = group.value.repeatPassword;
    return pass === confirmPass ? null : { notSame: true };
  }

  /**
   * Check has error
   */
  public hasError = (controlName: string, errorName: string) => {
    return this.passwordResetForm.controls[controlName].hasError(errorName);
  }

  /**
   * login controls
   */
  get loginControls() {
    return this.passwordResetForm.controls;
  }


  // Form Getters

  get password() {
    return this.passwordResetForm.get('password');
  }

  get confirmPassword() {
    return this.passwordResetForm.get('confirmPassword');
  }

  // Update Password
  updatePassword() {
    if (this.passwordResetForm.valid) {
      if (this.passwordResetForm.value.password === this.passwordResetForm.value.confirmPassword) {
        const password = { password: this.passwordResetForm.value.password };
        const data = { message: 'Reset link sent to the email' };
        this.apiService.changePassword(password).subscribe((success: any) => {
          this.openDialog(data);
        });

      } else {
        this.passMismatchText = 'Repeat Password should match the New Password';
      }
    } else {
      this.validateAllFields(this.passwordResetForm);
    }
  }

  // Open dailog
  openDialog(data: any) {
    let dialogDetails: IModalInfo;
    let pageContent;

    if (data.message === 'Reset link sent to the email') {
      // tslint:disable-next-line: max-line-length
      pageContent = '<p>Password has been updated, Page will be</p> <p>redirected to login page</p>';
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
      width: '440px',
      height: '280px',
      data: dialogDetails
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.apiService.logout().subscribe((data: any) => {
          localStorage.clear();
          this.route.navigate(['/login']);
        });
      }
    });
  }


}
