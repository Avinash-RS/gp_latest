import { Component, OnInit, OnChanges, HostListener, Inject, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { APIService } from 'src/app/services/api.service';
import { CommonService } from 'src/app/services/common.service';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-gp-add-members',
  templateUrl: './gp-add-members.component.html',
  styleUrls: ['./gp-add-members.component.scss'],
})
export class GpAddMembersComponent implements OnInit, AfterViewInit, OnDestroy {

  sub: Subscription;
  sub1: Subscription;

  addMembersForm: FormGroup;
  departmentsArr: any;
  selectedRole;
  selectedDept;
  phoneNumber;
  roles: any;
  editData = false;
  allUsersArr: any;
  currUser: any;
  fname: any;
  titleCard;
  showEditPage: boolean;
  productList: any;

  constructor(
    private fb: FormBuilder,
    private route: Router,
    public dialog: MatDialog,
    private apiServices: APIService,
    private activatedRoute: ActivatedRoute,
    private commonServices: CommonService,
    private cdRef: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA)
    public data
  ) {
  }

  ngOnInit() {
    // Get All departments
    // this.getDepartment();
    // this.getRole();

    if (this.data) {
      this.editData = true;
      this.titleCard = 'Edit Member';
      this.getUsers(this.data);
    } else {
      this.editData = false;
      this.titleCard = 'Add Member';
      this.getDepartment();
      this.getRole();
      this.memberForm();
    }


    // Member Form Controls
    // this.memberForm();
  }

  ngAfterViewInit() {
    // this.cdRef.detectChanges();
    // console.log(this.cdRef.detectChanges());
    // this.editData = false;
  }

  // Get All users
  getUsers(id) {
    this.getDepartment();
    this.getRole();
    this.sub = this.apiServices.getUsersOnTeam().subscribe((data: any) => {
      this.allUsersArr = data.data.users;
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < this.allUsersArr.length; i++) {
        if (this.allUsersArr[i].user._id === id) {
          this.currUser = this.allUsersArr[i];
          this.selectedRole = this.currUser.role._id;
          this.selectedDept = this.currUser.department._id;
          this.fname = this.currUser.user.firstName;
        }
      }
      if (this.fname) {
        this.memberForm();

      }
    });
  }


  // Member Form
  memberForm() {
    const emailregex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (this.editData === false) {
      this.addMembersForm = this.fb.group({
        userEmail: ['', [Validators.required, Validators.pattern(emailregex)]],
        firstName: ['', [Validators.required]],
        lastName: ['', [Validators.required]],
        // phoneNo: ['', [Validators.required]],
        // location: ['', [Validators.required]],
        department: ['', [Validators.required]],
        role: ['', [Validators.required]]
      });
    } else {
      this.addMembersForm = this.fb.group({
        userEmail: ['', [Validators.required, Validators.pattern(emailregex)]],
        firstName: ['', [Validators.required]],
        lastName: ['', [Validators.required]],
        // phoneNo: ['', [Validators.required]],
        // location: ['', [Validators.required]],
        department: ['', [Validators.required]],
        role: ['', [Validators.required]]
      }),
        // setTimeout(() => {
        this.setVal();
      // }, 2500);
    }
  }

  // Set value
  setVal() {
    this.showEditPage = true;
    this.addMembersForm.setValue(
      {
        userEmail: this.currUser.user.email,
        firstName: this.fname,
        lastName: this.currUser.user.lastName,
        department: this.selectedDept,
        role: this.selectedRole
      }
    );
  }


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
  // get phoneNo() {
  //   return this.addMembersForm.get('phoneNo');
  // }
  // get location() {
  //   return this.addMembersForm.get('location');
  // }
  get department() {
    return this.addMembersForm.get('department');
  }
  get role() {
    return this.addMembersForm.get('role');
  }

  // Add Members form Submit
  addMember() {
    if (this.addMembersForm.valid) {
      let forApiCall;
      if (this.editData === false) {
        forApiCall = {
          email: this.addMembersForm.value.userEmail.toString().toLowerCase(),
          firstName: this.addMembersForm.value.firstName,
          lastName: this.addMembersForm.value.lastName,
          role: this.addMembersForm.value.role,
          department: this.addMembersForm.value.department,
          password: 'hellogrowth'
        };

        this.apiServices.addMember(forApiCall).subscribe((data: any) => {
          this.commonServices.success('Member added Successfully', '');
          this.closeDialog();
          this.apiServices.memberListRefresh.next();
        });

      } else {
        const forEditApiCall = {
          role: this.addMembersForm.value.role,
          department: this.addMembersForm.value.department
        };

        this.apiServices.editMember(this.data, forEditApiCall).subscribe((data: any) => {
          this.commonServices.success('User Data Modified', '');
          this.closeDialog();
          this.apiServices.memberListRefresh.next();
          this.getProducts();
        });
      }
    } else {
      this.validateAllFields(this.addMembersForm);
    }
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

  // Cancel
  cancel() {
    this.closeDialog();
  }

  closeDialog() {
    this.dialog.closeAll();
  }


  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    // console.log(event);
  }
  // Get All Department
  getDepartment() {
    this.apiServices.getDepartments().subscribe((data: any) => {
      this.departmentsArr = data.data.departments;
      // this.departmentsArr = data.data.departments.filter((item, i) => (item.displayName !== 'All') ? item : null);
    });
  }

  // Get All Department
  getRole() {
    this.apiServices.getRolesOnTeam().subscribe((data: any) => {
      // this.productListArr = data.data.departments;
      this.roles = data.data.roles;
    });
  }

  getProducts() {
    this.sub1 = this.apiServices.productList().subscribe((data: any) => {
      this.productList = data.data.products;

      let productAccess;
      let milestoneAccess;
      let commentAccess;
      let permissions;
      let role;
      let dept;
      const user = this.productList.find(ele => ele.product._id === JSON.parse(localStorage.getItem('productAccess')).productId.toString());
      let deptName;
      let productDetails;
      productDetails = user.users;
      dept = productDetails[0].department._id;
      permissions = productDetails[0].department.displayName;
      deptName = productDetails[0].department.displayName;
      role = productDetails[0].role.permissions;
      role.forEach(roles => {
        if (roles.resource === "product") {
          productAccess = roles.action;
        }
        if (roles.resource === "milestone") {
          milestoneAccess = roles.action;
        }
        if (roles.resource === "comment") {
          commentAccess = roles.action;
        }
      });
      // Product Access Local Storage
      localStorage.setItem(
        'productAccess', JSON.stringify({
          departmentName: JSON.parse(localStorage.getItem('productAccess')).departmentName,
          department: JSON.parse(localStorage.getItem('productAccess')).department,
          productId: JSON.parse(localStorage.getItem('productAccess')).productId,
          ACLaccess: { product: productAccess, milestone: milestoneAccess, comment: commentAccess },
          sprintMilestoneId: JSON.parse(localStorage.getItem('productAccess')).sprintMilestoneId,
          versionId: JSON.parse(localStorage.getItem('productAccess')).versionId,
          Month: JSON.parse(localStorage.getItem('productAccess')).Month,
          Year: JSON.parse(localStorage.getItem('productAccess')).Year
        })
      );

    });
  }

  ngOnDestroy() {
    if (this.editData) {
     this.sub ? this.sub.unsubscribe() : '';
     this.sub1 ? this.sub1.unsubscribe() : '';
    }
  }

}
