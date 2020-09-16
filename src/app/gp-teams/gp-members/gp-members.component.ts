import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { APIService } from 'src/app/services/api.service';
import { CommonService } from 'src/app/services/common.service';
import { MatDialog } from '@angular/material';
import { IModalInfo } from 'src/app/Interface/model';
import { GpAddMembersComponent } from '../gp-add-members/gp-add-members.component';
import * as moment from 'moment-timezone';
import { GpErrorDialogComponent } from 'src/app/shared/gp-error-dialog/gp-error-dialog.component';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-gp-members',
  templateUrl: './gp-members.component.html',
  styleUrls: ['./gp-members.component.scss']
})
export class GpMembersComponent implements OnInit, OnChanges {

  BASE_IMAGE_URL = environment.Image_Base_Url;

  @Input() users;
  ACLDepartmentId: string;
  ACLUserId: string;
  ACL: { list: string; edit: string; get: string; create: string; delete: string; };

  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private route: Router,
    private apiServices: APIService,
    private activatedRoute: ActivatedRoute,
    private commonServices: CommonService
  ) { }

  ngOnInit() {

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


  ngOnChanges() {
    for (const currElement of this.users) {
      if (currElement.user.timezone) {
        currElement.user.timezone = moment().tz(currElement.user.timezone).format('hh : mm : ss a z');
      }
    }
  }

  editUser(id: any) {
    this.openDialog(id);
  }
  deActivateUser(id: any, active: any) {

    let forDeActivateApiCall;
    let msg;
    if (active === true) {
      forDeActivateApiCall = {
        isActive: false
      };
      msg = 'User Deactivated';
    } else {
      forDeActivateApiCall = {
        isActive: true
      };
      msg = 'User Activated';
    }
    const dialogMsg = {
      id,
      msg: 'User',
      alert: msg,
      forDeActivateApiCall
    };
    this.openDialog1(dialogMsg);
  }

  // Open dailog
  openDialog(id) {
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
      data: id
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

  // Open dailog
  openDialog1(id) {
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
    const dialogRef = this.dialog.open(GpErrorDialogComponent, {
      width: '350px',
      height: '150px',
      autoFocus: false,
      data: id
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

}
