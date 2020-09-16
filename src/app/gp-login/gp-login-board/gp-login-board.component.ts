import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import * as passwordHash from 'js-sha512';
import { APIService } from 'src/app/services/api.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-gp-login-board',
  templateUrl: './gp-login-board.component.html',
  styleUrls: ['./gp-login-board.component.scss']
})
export class GpLoginBoardComponent implements OnInit {

  loginForm: FormGroup;
  checked = false;

  constructor(
    private fb: FormBuilder,
    private route: Router,
    private loginService: APIService,
    private commonServices: CommonService
  ) {
    this.rememberMe();
  }

  ngOnInit() {
    // tslint:disable-next-line: max-line-length
    const emailregex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    // Login Form Controls
    this.loginForm = this.fb.group({
      userEmail: ['', [Validators.required, Validators.pattern(emailregex)]],
      password: ['', [Validators.required]],
      checkBox: [false]
    });

    localStorage.clear();

  }

  rememberMe() {
    if (sessionStorage.getItem('email') && sessionStorage.getItem('password')) {
      const emailregex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      // Login Form Controls
      this.loginForm = this.fb.group({
        userEmail: [sessionStorage.getItem('email'), [Validators.required, Validators.pattern(emailregex)]],
        password: [sessionStorage.getItem('password'), [Validators.required]],
        checkBox: [true]
      }),
        setTimeout(() => {
          this.setVal();
        }, 1000);

    }
  }

  // Set value
  setVal() {
    this.loginForm.setValue(
      {
        userEmail: sessionStorage.getItem('email'),
        password: sessionStorage.getItem('password'),
        checkBox: [true]
      }
    );
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
    return this.loginForm.get('userEmail');
  }

  get password() {
    return this.loginForm.get('password');
  }

  // Login Submit

  Login() {
    if (this.loginForm.valid) {
      const loginData = {
        email: this.loginForm.value.userEmail.toString().toLowerCase(),
        password: this.loginForm.value.password,
        rememberMe: this.loginForm.value.checkBox
      };
      if (this.loginForm.value.checkBox) {
        sessionStorage.setItem('email', loginData.email);
        sessionStorage.setItem('password', loginData.password);
      } else {
        sessionStorage.getItem('email') ? sessionStorage.removeItem('email') : '';
        sessionStorage.getItem('password') ? sessionStorage.removeItem('password') : '';
      }
      this.loginService.userLogin(loginData).subscribe((data: any) => {

        localStorage.setItem('Access_Token', data.data.user.accessToken);
        // localStorage.setItem('userId', data.data.user._id);
        // localStorage.setItem('userName', data.data.user.firstName);
        if (sessionStorage.getItem('commentUrl')) {

          if (data.data.user.status === 'not_verified') {
            localStorage.setItem('status', '0');
            this.route.navigate([sessionStorage.getItem('commentUrl')]);
          }
          if (data.data.user.status === 'force_change') {
            this.route.navigate(['/password-reset']);
          } else {
            localStorage.setItem('status', '1');
            this.route.navigate([sessionStorage.getItem('commentUrl')]);
          }
        } else {
          if (data.data.user.status === 'not_verified') {
            localStorage.setItem('status', '0');
            this.route.navigate(['/']);
          }
          if (data.data.user.status === 'force_change') {
            this.route.navigate(['/password-reset']);
          } else {
            localStorage.setItem('status', '1');
            this.route.navigate(['/']);
          }
        }
      });
    } else {
      this.validateAllFields(this.loginForm);
    }
  }

  // Forgot password
  ForgotPassword() {
    this.route.navigate(['/forgot-password']);
  }

  forceRoute(data: any) {
    if (data.data.user.force_change === 2) {
      this.route.navigate(['/password-reset']);
    } else {
      this.route.navigate(['/']);
    }
  }

}
