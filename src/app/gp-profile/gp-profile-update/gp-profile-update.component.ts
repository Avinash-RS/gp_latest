/// <reference types="@types/googlemaps" />
import { Component, OnInit, Inject, NgZone, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { APIService } from 'src/app/services/api.service';
import { CommonService } from 'src/app/services/common.service';
import { CustomValidators } from 'src/app/helper/password-validators';
import { MapsAPILoader } from '@agm/core';
import * as moment from 'moment-timezone';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

declare var google;

export interface State {
  abbr: string;
  text: string;
  offset: any;
  utc: any;
}

@Component({
  selector: 'app-gp-profile-update',
  templateUrl: './gp-profile-update.component.html',
  styleUrls: ['./gp-profile-update.component.scss']
})
export class GpProfileUpdateComponent implements OnInit {

  BASE_IMAGE_URL = environment.Image_Base_Url;

  /*map Start*/
  public latitude: number;
  public longitude: number;
  public searchControl: FormControl;
  public zoom: number;

  @ViewChild('search', { static: false })
  public searchElementRef: ElementRef;

  /*Map end*/
  locations = '';
  addMembersForm: FormGroup;
  passwordResetForm: FormGroup;
  passMismatchText: any;
  editData = false;
  departmentsArr: any;
  roles: any;
  selectedRole;
  selectedDept;
  selectedTimezone;
  selectedDialCode;
  phoneNumber;
  allUsersArr: any;
  currUser: any;
  fname: any;
  telCodeArr: any;
  timeZoneArr: any;
  phNumberValidation;
  selectedTimezoneInput;

  showProfilePage: boolean;

  stateCtrl = new FormControl();
  filteredStates: Observable<State[]>;

  states: State[] = [];
  errorMsg: string;
  dontRun = false;
  phoneNumberBoolean: boolean;
  phoneCodeBoolean: boolean;

  url: any;
  sub1: any;

  selectedImage: any;
  imageSignature: any;
  imageExpire: any;
  imageBaseUrl: any;
  imageToken: any;
  imagePublicKey: any;
  uploadForm: FormGroup;
  finalImg: any;
  fName: any;
  lName: any;
  showDeleteButton = false;
  APIUrl: any;
  APIlocation: any;
  APIphoneCodes: any;
  APIphoneNos: any;
  profileLoader: boolean = true;

  constructor(
    @Inject(MapsAPILoader) public mapsAPILoader: MapsAPILoader,
    public ngZone: NgZone,
    private fb: FormBuilder,
    private route: Router,
    public dialog: MatDialog,
    private apiServices: APIService,
    private activatedRoute: ActivatedRoute,
    private commonServices: CommonService,

  ) { }

  ngOnInit() {
    this.getMyProfile();
    // Maps
    // this.apiServices.mapsApi();
    // this.maps();

    this.telCodes();

    // this.getDepartment();
    // this.getRole();


    // this.memberForm();

    this.filteredStates = this.stateCtrl.valueChanges
      .pipe(
        startWith(''),
        map(state => state ? this._filterStates(state) : this.states.slice())
      );

    // this.formControlValueChanged();
    // this.codeControlValueChanged();

    this.proImageSignatureGetter();

    this.uploadForm = this.fb.group({
      profile: ['']
    });
  }

  proImageSignatureGetter() {
    this.sub1 = this.apiServices.profilePicSignature().subscribe((data: any) => {
      this.imageSignature = data.data.endpoint.signature;
      this.imageExpire = data.data.endpoint.expire;
      this.imageBaseUrl = data.data.endpoint.baseUrl;
      this.imageToken = data.data.endpoint.token;
      this.imagePublicKey = data.data.endpoint.publicKey;
    });
  }

  private _filterStates(value: any): State[] {
    const filterValue = value.toString().toLowerCase();

    return this.states.filter(state => state.abbr.toString().toLowerCase().includes(filterValue));
  }

  telCodes() {
    this.apiServices.telCodeJson().subscribe((data: any) => {
      this.telCodeArr = data;
    });

    this.apiServices.timezoneJson().subscribe((data: any) => {
      this.timeZoneArr = data;
      this.states = this.timeZoneArr;
    });
  }

  // Member Form
  memberForm() {
    const emailregex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const regex: RegExp = /^[0-9]*$/;
    // const regex: RegExp = /^(?=.{15}$)(([0-9]{2}[a-zA-Z]{4}([a-zA-Z]{1}|[0-9]{1}).[0-9]{3}[a-zA-Z]([a-zA-Z]|[0-9]){3}))/;

    this.addMembersForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      phoneNo: ['', [Validators.pattern(regex), Validators.maxLength(10)]],
      phoneCode: [''],
      location: [''],
      // timezone: ['', [Validators.required]]
    }),
      // setTimeout(() => {
      this.setVal();
    // }, 2500);

    // Password Reset Form
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


  // formControlValueChanged() {
  //   const regex: RegExp = /^[0-9]*$/;
  //   const phoneControl = this.addMembersForm.get('phoneNo');
  //   const phoneCodeControl = this.addMembersForm.get('phoneCode');
  //   this.addMembersForm.get('phoneCode').valueChanges.subscribe(
  //     (mode: any) => {
  //       if (mode !== undefined && mode !== '' && this.phoneNumberBoolean !== true) {
  //         this.phoneCodeBoolean = true;
  //         phoneControl.setValidators([Validators.required, Validators.pattern(regex), Validators.maxLength(15)]);
  //         phoneControl.updateValueAndValidity();
  //       }
  //       if (mode === '' && phoneControl.value === '') {
  //         phoneControl.setValidators([Validators.required, Validators.pattern(regex), Validators.maxLength(15)]);
  //         phoneCodeControl.clearValidators();
  //       } else {
  //         this.phoneCodeBoolean = false;
  //       }
  //     });
  // }

  noPhoneCode() {
    this.selectedDialCode = '';
  }
  // noPhoneCode() {
  //   const regex: RegExp = /^[0-9]*$/;
  //   const phoneControl = this.addMembersForm.get('phoneNo');
  //   const phoneCodeControl = this.addMembersForm.get('phoneCode');
  //   this.phNumberValidation = '';
  //   phoneCodeControl.clearValidators();
  //   phoneControl.clearValidators();

  //   // if (phoneControl.value !== '' && phoneControl.value !== undefined) {
  //   //   this.phoneNumberBoolean = false;
  //   //   phoneCodeControl.setValidators([Validators.required]);
  //   //   phoneCodeControl.updateValueAndValidity();
  //   //   phoneControl.setValidators([Validators.required, Validators.pattern(regex), Validators.maxLength(15)]);
  //   //   phoneControl.updateValueAndValidity();
  //   // }
  //   // if ((this.phNumberValidation == '' || this.phNumberValidation == null) && (this.selectedDialCode == '' || this.selectedDialCode == null)) {
  //   //   phoneCodeControl.clearValidators();
  //   //   phoneControl.clearValidators();
  //   // } else {
  //   //   // phoneControl.setValidators([Validators.pattern(regex)]);
  //   //   phoneCodeControl.clearValidators();
  //   //   // phoneControl.updateValueAndValidity();
  //   //   phoneControl.clearValidators();
  //   // }
  // }

  // codeControlValueChanged() {
  //   const regexAlpha: RegExp = /^[0-9]*$/;
  //   const phoneControl = this.addMembersForm.get('phoneNo');
  //   const phoneCodeControl = this.addMembersForm.get('phoneCode');
  //   this.addMembersForm.get('phoneNo').valueChanges.subscribe(
  //     (modes: string) => {
  //       if (modes !== undefined && modes !== '' && modes !== null && regexAlpha) {
  //         this.phoneNumberBoolean = true;
  //         phoneCodeControl.setValidators([Validators.required]);
  //         phoneCodeControl.updateValueAndValidity();
  //       } else {
  //         const regex: RegExp = /^[0-9]*$/;
  //         const phoneControl = this.addMembersForm.get('phoneNo');
  //         if (this.phoneNumberBoolean === true) {
  //           phoneCodeControl.clearValidators();
  //           phoneCodeControl.updateValueAndValidity();
  //           this.phoneNumberBoolean = false;
  //         } else {
  //           this.phoneNumberBoolean = false;
  //         }
  //       }
  //     });

  // }

  // Set value
  setVal() {
    this.showProfilePage = true;
    this.addMembersForm.setValue(
      {
        firstName: this.fName,
        lastName: this.lName,
        // department: this.selectedDept,
        location: this.APIlocation,
        phoneCode: this.APIphoneCodes,
        phoneNo: this.APIphoneNos,
        // role: this.selectedRole
      }
    );
  }



  // Get my Profile
  getMyProfile() {
    const userProfile = JSON.parse(localStorage.getItem('userProfile'));

    this.selectedTimezoneInput = userProfile.selectedTimezoneInput === '' ? '' : userProfile.selectedTimezoneInput;
    this.fName = userProfile.fName;
    this.lName = userProfile.lName;
    this.APIlocation = userProfile.APIlocation;
    this.APIphoneCodes = userProfile.APIphoneCodes;
    this.APIphoneNos = userProfile.APIphoneNos === '' ? '' : userProfile.APIphoneNos;
    this.url = userProfile.url !== '' ? userProfile.url : '';
    this.APIUrl = userProfile.url !== '' ? userProfile.url : '';
    this.showDeleteButton = userProfile.url === '' ? this.showDeleteButton : !this.url ? this.showDeleteButton : !this.showDeleteButton;
    this.memberForm();
    // this.formControlValueChanged();
    // this.codeControlValueChanged();
  }

  tabChange(id) {
    this.selectedTimezone = id;
  }

  profileUpdate() {
    if (this.addMembersForm.valid) {
      this.dontRun = false;
      if (this.selectedTimezoneInput === undefined || this.selectedTimezoneInput === '' || this.selectedTimezoneInput === null) {
        this.selectedTimezoneInput = null;
        let forApiCall;
        forApiCall = {
          email: this.addMembersForm.value.userEmail,
          firstName: this.addMembersForm.value.firstName,
          lastName: this.addMembersForm.value.lastName,
          location: this.addMembersForm.value.location,
          phoneNumber: {
            code: this.addMembersForm.value.phoneCode,
            phNumber: this.addMembersForm.value.phoneNo
          },
          timezone: this.selectedTimezoneInput,
          profileImageUrl: this.url ? this.url : ''
        };
        // Api Calling
        this.apiServices.editMyProfile(forApiCall).subscribe((data: any) => {
          this.commonServices.success('User Updated Successfully', '');
          this.apiServices.profilePicUpdate.next();
          // this.memberForm();
          // this.getMyProfile();
          this.route.navigate([`/p/${JSON.parse(localStorage.getItem('productAccess')).productId.toString()}/m`]);
        });
      }

      if (this.selectedTimezoneInput !== undefined && this.selectedTimezoneInput !== '' && this.selectedTimezoneInput !== null) {
        for (let i = 0; i < this.timeZoneArr.length; i++) {
          if (this.timeZoneArr[i].utc[0] === this.selectedTimezoneInput) {
            this.dontRun = true;
            this.errorMsg = '';
            let forApiCall;
            forApiCall = {
              email: this.addMembersForm.value.userEmail,
              firstName: this.addMembersForm.value.firstName,
              lastName: this.addMembersForm.value.lastName,
              location: this.addMembersForm.value.location,
              phoneNumber: {
                code: this.addMembersForm.value.phoneCode,
                phNumber: this.addMembersForm.value.phoneNo
              },
              timezone: this.selectedTimezoneInput,
              profileImageUrl: this.url ? this.url : ''
            };

            // Api Calling
            this.apiServices.editMyProfile(forApiCall).subscribe((data: any) => {
              this.commonServices.success('User Updated Successfully', '');
              this.apiServices.profilePicUpdate.next();
              // this.memberForm();
              // this.getMyProfile();
              this.route.navigate([`/p/${JSON.parse(localStorage.getItem('productAccess')).productId.toString()}/m`]);
            });
          }
        }
        if (this.dontRun !== true) {
          for (let i = 0; i < this.timeZoneArr.length; i++) {
            if (this.timeZoneArr[i].utc[0] !== this.selectedTimezoneInput) {
              this.dontRun = false;
              this.errorMsg = 'Please select timezone from Dropdown';
            }
          }
        }
      }
    } else {
      this.validateAllFields(this.addMembersForm);
    }
  }

  updatePassword() {
    if (this.passwordResetForm.valid) {
      if (this.passwordResetForm.value.password === this.passwordResetForm.value.confirmPassword) {
        const password = { password: this.passwordResetForm.value.password };
        const data = { message: 'Reset link sent to the email' };
        this.apiServices.changePassword(password).subscribe((success: any) => {
          this.passMismatchText = '';
          this.commonServices.success('Password Updated Successfully', '');
          this.route.navigate([`/p/${JSON.parse(localStorage.getItem('productAccess')).productId.toString()}/m`]);
        }, (error) => {
          this.passMismatchText = '';
        });
      } else {
        this.passMismatchText = 'Repeat Password should match the New Password';
      }
    } else {
      this.validateAllFields(this.passwordResetForm);
    }
  }

  cancel() {
    this.route.navigate([`/p/${JSON.parse(localStorage.getItem('productAccess')).productId.toString()}/m`]);
  }

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


  /* Pass word getters */
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

  /* ----- */

  // Form Getters

  get userEmail() {
    return this.addMembersForm.get('userEmail');
  }

  get firstName() {
    return this.addMembersForm.get('firstName');
  }
  get lastName() {
    return this.addMembersForm.get('lastName');
  }
  get phoneNo() {
    return this.addMembersForm.get('phoneNo');
  }
  get phoneCode() {
    return this.addMembersForm.get('phoneCode');
  }
  get location() {
    return this.addMembersForm.get('location');
  }
  get department() {
    return this.addMembersForm.get('department');
  }
  get role() {
    return this.addMembersForm.get('role');
  }
  get timezone() {
    return this.addMembersForm.get('timezone');
  }

  numberRestrict(data) {
    if (data.length === 15) {
    } else {

    }
  }


  // Get All Department
  getDepartment() {
    this.apiServices.getDepartments().subscribe((data: any) => {
      // this.productListArr = data.data.departments;
      this.departmentsArr = data.data.departments.filter((item, i) => (item.displayName !== 'All') ? item : null);
    });
  }

  // Get All Department
  getRole() {
    this.apiServices.getRolesOnTeam().subscribe((data: any) => {
      // this.productListArr = data.data.departments;
      this.roles = data.data.roles;
    });
  }

  afterImgLoad() {
    this.profileLoader = true;
  }
  async onSelectFile(event) {
    if (event.target.files[0].type.includes('image/') && !event.target.files[0].name.includes('svg')) {
      this.profileLoader = false;
      this.showDeleteButton = true;

      this.proImageSignatureGetter();


      if (event.target.files && event.target.files[0]) {
        this.selectedImage = event.target.files[0];
        const fd = new FormData();




        fd.append('file', this.selectedImage);
        fd.append('publicKey', this.imagePublicKey);
        fd.append('signature', this.imageSignature);
        fd.append('expire', this.imageExpire);
        fd.append('token', this.imageToken);
        fd.append('fileName', this.selectedImage.name);
        fd.append('folder', '/profiles');

        try {
          const response = await (await this.apiServices.profilePic(fd)).json();
          const file = event.target.files[0];
          this.uploadForm.get('profile').setValue(file);
          let reader = new FileReader();
          let urls;
          reader.readAsDataURL(event.target.files[0]); // read file as data url
          reader.onload = (event: any) => { // called once readAsDataURL is completed
            urls = event.target.result;
          };
          let apiUrl = response.filePath;
          // this.url = `${response.url}?tr=w-150,h-150`;
          this.url = `${apiUrl}`;
        } catch (e) {
          this.commonServices.error('Please Upload a Valid Image', '');
          this.url = this.APIUrl ? this.APIUrl : '';
          if (!this.APIUrl) {
            this.showDeleteButton = true;
          }
          console.log(e);
          this.profileLoader = true;
        }

      }

    } else {
      this.commonServices.error('Please Upload a Valid Png or Jpeg Files', '');
      // this.url = this.APIUrl ? this.APIUrl : `https://ui-avatars.com/api/?name=${this.fName}+${this.lName}`;
      // if (!this.APIUrl) {
      //   this.showDeleteButton = true;
      // }
    }
  }

  public delete() {
    this.showDeleteButton = !this.showDeleteButton;
    this.url = '';
  }

  // Maps
  maps() {
    // set google maps defaults
    this.zoom = 4;
    this.latitude = 39.8282;
    this.longitude = -98.5795;

    // create search FormControl
    this.searchControl = new FormControl();

    // set current position
    this.setCurrentPosition();

    // load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
      const autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        types: ['(regions)'],
        // componentRestrictions: { country: ['us', 'in', 'de'] }
      });
      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          // get the place result
          const place: google.maps.places.PlaceResult = autocomplete.getPlace();
          // verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          // set latitude, longitude and zoom
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
          this.zoom = 12;
          this.apiServices.timeZone(this.latitude, this.longitude).subscribe((data: any) => {
            let userTimezoneChange = data.timeZoneId;
            let userTimezone = moment().tz(data.timeZoneId).format('hh : mm : ss a z');
            let userOffset = data.rawOffset + data.dstOffset + 1331766000;
          });

        });
      });
      setTimeout(() => {
        // $('.pac-container').prependTo('#mapMoveHere');
      }, 300);

    });
  }

  private setCurrentPosition() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 12;
      });
    }
  }

}
