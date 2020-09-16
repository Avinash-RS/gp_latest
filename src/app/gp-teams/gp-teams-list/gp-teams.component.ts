import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { APIService } from 'src/app/services/api.service';
import { CommonService } from 'src/app/services/common.service';
import { MatDialog } from '@angular/material';
import { IModalInfo } from 'src/app/Interface/model';
import { ModalInfoWithbuttonComponent } from 'src/app/shared/modal-info-withbutton/modal-info-withbutton.component';
import { GpAddMembersComponent } from '../gp-add-members/gp-add-members.component';
import { Subscription } from 'rxjs';
import { TooltipPosition } from '@angular/material/tooltip';

@Component({
  selector: 'app-gp-teams',
  templateUrl: './gp-teams.component.html',
  styleUrls: ['./gp-teams.component.scss']
})
export class GpTeamsComponent implements OnInit, OnDestroy {

  sub: Subscription;

  positionOptions: TooltipPosition[] = ['after', 'before', 'above', 'below', 'left', 'right'];
  position = this.positionOptions[1];

  usersArr: any;

  @ViewChild('show', { static: false }) show: ElementRef;
  roles: any;
  departmentsArr: any;
  selectedRole = ['0'];
  selectedDept = ['0'];
  selectedRoleTip = 'All';
  selectedDeptTip = 'All';
  allUsersArr: any;
  ACLDepartmentId: string;
  ACLUserId: string;
  ACL: { list: string; edit: string; get: string; create: string; delete: string; };
  selectRoleSwap: boolean = true;
  selectDeptSwap: boolean = true;

  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private route: Router,
    private apiServices: APIService,
    private activatedRoute: ActivatedRoute,
    private commonServices: CommonService
  ) { }

  ngOnInit() {
    this.getUsers();

    // Rx js
    this.memberListRefresh();

    // Get Departments and Roles
    this.getRole();
    this.getDepartment();

    this.ACLAccess();

  }


  ACLAccess() {
    let ACLArr;
    this.ACLDepartmentId = JSON.parse(localStorage.getItem('productAccess')).department ? JSON.parse(localStorage.getItem('productAccess')).department : '';
    ACLArr = JSON.parse(localStorage.getItem('productAccess')).ACLaccess.product.toString();
    this.ACLUserId = JSON.parse(localStorage.getItem('userProfile')).userId;
    ACLArr = ACLArr.split(',');
    this.ACL = {
      list: '', edit: '', get: '', create: '', delete: ''
    };
    ACLArr.forEach(element => {
      if (element.includes('list:')) {
        this.ACL.list = element.replace(/^list:/gi, '');
      }
      if (element.includes('edit:')) {
        this.ACL.edit = element.replace(/^edit:/gi, '');
      }
      if (element.includes('get:')) {
        this.ACL.get = element.replace(/^get:/gi, '');
      }
      if (element.includes('create:')) {
        this.ACL.create = element.replace(/^create:/gi, '');
      }
      if (element.includes('delete:')) {
        this.ACL.delete = element.replace(/^delete:/gi, '');
      }
    });
  }


  // Rx js
  memberListRefresh() {
    this.apiServices.memberListRefresh.subscribe((data: any) => {
      this.selectedDept = ['0'];
      this.selectedRole = ['0'];
      this.getUsers();
    });
  }

  getUsers() {
    this.sub = this.apiServices.getUsersOnTeam().subscribe((data: any) => {
      this.usersArr = data.data.users;
      this.allUsersArr = data.data.users;
    });
  }

  addMember() {
    this.openDialog();
  }

  // Get All Department
  getDepartment() {
    this.apiServices.getDepartments().subscribe((data: any) => {
      // this.productListArr = data.data.departments;
      this.departmentsArr = data.data.departments.filter((item, i) => (item) ? item : null);

      this.departmentsArr.forEach(element => {
        if (this.selectedDept[0] === '0') {
          this.selectedDept.push(element._id);
        }
      });
      //   this.departmentsArr = data.data.departments.filter((item, i) => {
      //    if (item.displayName === 'All') {

      //    }
      // }
    });
  }

  // Get All Department
  getRole() {
    this.apiServices.getRolesOnTeam().subscribe((data: any) => {
      // this.productListArr = data.data.departments;
      this.roles = data.data.roles;

      this.roles.forEach(element => {
        if (this.selectedRole[0] === '0') {
          this.selectedRole.push(element._id);
        }
      });
    });
  }

  changeRole(val) {
    if (val[0] === '0') {
      this.selectedRole = ['0'];
      this.roles.forEach(element => {
        this.selectedRole.push(element._id);
      });
    }

    if (val[0] !== '0' && val.length === this.roles.length) {
      val = [];
      this.selectedRole = [];
      this.usersArr = [];
    }
  }

  changeDept(val) {
    if (val[0] === '0') {
      this.selectedDept = ['0'];
      this.departmentsArr.forEach(element => {
        this.selectedDept.push(element._id);
      });
    }

    if (val[0] !== '0' && val.length === this.departmentsArr.length) {
      val = [];
      this.selectedDept = [];
      this.usersArr = [];

    }

    // if (val[0] === '0' && val.length === this.departmentsArr.length) {
    //   this.selectedDept = this.selectedDept.filter((data, i) => (data !== '0'));
    //   val = val.filter((data, i) => (data !== '0'));
    // }

  }

  // Department change
  onDepartmentChange(id: any) {

    let tempDeptArr: any[] = [];
    const tempRoleArr: any[] = [];
    if (this.selectedRole[0] && this.selectedRole[0] === '0') {
      if (id[0] && id[0] === '0') {
        this.allUsersArr.forEach(allUser => {
          if (allUser) {
            tempRoleArr.push(allUser);
          }
        });
      } else {

        this.allUsersArr.forEach(allUser => {
          id.forEach(currId => {
            if (allUser.department && allUser.department._id) {
              if (allUser.department._id === currId) {
                tempRoleArr.push(allUser);
              }
            }
          });
        });

      }
      this.usersArr = tempRoleArr;
    } else {
      if (id[0] && id[0] === '0') {
        this.allUsersArr.forEach(allUser => {
          this.selectedRole.forEach(currId => {
            if (allUser.role && allUser.role._id) {
              if (allUser.role._id === currId) {
                tempRoleArr.push(allUser);
              }
            }
          });
        });
      } else {

        this.allUsersArr.forEach(allUser => {
          id.forEach(currId => {
            if (allUser.department && allUser.department._id) {
              if (allUser.department._id === currId) {
                tempDeptArr.push(allUser);
              }
            }
          });
        });

        let c: any[] = [];
        tempDeptArr.forEach(allUser => {
          this.selectedRole.forEach(roleId => {
            if (allUser.role && allUser.role._id) {
              if (allUser.role._id === roleId) {
                tempRoleArr.push(allUser);
              }
            }
          });
        });

      }
      this.usersArr = tempRoleArr;
    }

  }

  // Role change
  onRoleChange(id: any) {

    let tempDeptArr: any[] = [];
    const tempRoleArr: any[] = [];
    if (this.selectedDept[0] && this.selectedDept[0] === '0') {
      if (id[0] && id[0] === '0') {
        this.allUsersArr.forEach(allUser => {
          if (allUser) {
            tempRoleArr.push(allUser);
          }
        });
      } else {
        this.allUsersArr.forEach(allUser => {
          id.forEach(roleId => {
            if (allUser.role && allUser.role._id) {
              if (allUser.role._id === roleId) {
                tempRoleArr.push(allUser);
              }
            }
          });
        });


      }
      this.usersArr = tempRoleArr;
    } else {

      if (id[0] && id[0] === '0') {

        this.allUsersArr.forEach(allUser => {
          this.selectedDept.forEach(currId => {
            if (allUser.department && allUser.department._id) {
              if (allUser.department._id === currId) {
                tempRoleArr.push(allUser);
              }
            }
          });
        });
      } else {
        this.allUsersArr.forEach(allUser => {
          this.selectedDept.forEach(currId => {
            if (allUser.department && allUser.department._id) {
              if (allUser.department._id === currId) {
                tempDeptArr.push(allUser);
              }
            }
          });
        });

        tempDeptArr.forEach(allUser => {
          id.forEach(currId => {
            if (allUser.role && allUser.role._id) {
              if (allUser.role._id === currId) {
                tempRoleArr.push(allUser);
              }
            }
          });
        });


      }

      this.usersArr = tempRoleArr;
    }


  }

  // Open dailog
  openDialog() {
    let dialogDetails: IModalInfo;
    let pageContent;

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
    const dialogRef = this.dialog.open(GpAddMembersComponent, {
      width: '779px',
      height: '345px',
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.apiServices.logout().subscribe((data: any) => {
          localStorage.clear();
          this.route.navigate(['/login']);
        });
      }
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
