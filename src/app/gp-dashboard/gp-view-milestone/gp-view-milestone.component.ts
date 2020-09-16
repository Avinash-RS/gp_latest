import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { APIService } from 'src/app/services/api.service';
import { CommonService } from 'src/app/services/common.service';
import * as moment from 'moment';
import { formatDate, Location } from '@angular/common';
import { MatDialog, throwMatDuplicatedDrawerError } from '@angular/material';
import { IModalInfo } from 'src/app/Interface/model';
import { ModalInfoWithbuttonComponent } from 'src/app/shared/modal-info-withbutton/modal-info-withbutton.component';
import { Subscription } from 'rxjs';
import { GpErrorDialogComponent } from 'src/app/shared/gp-error-dialog/gp-error-dialog.component';
import { environment } from 'src/environments/environment';
import * as query from 'query-string';

@Component({
  selector: 'app-gp-view-milestone',
  templateUrl: './gp-view-milestone.component.html',
  styleUrls: ['./gp-view-milestone.component.scss']
})
export class GpViewMilestoneComponent implements OnInit, OnDestroy {

  BASE_IMAGE_URL = environment.Image_Base_Url;

  sub: Subscription;
  sub1: Subscription;
  ACL: any;
  addTaskForm: FormGroup;
  displayName: any;
  department: any;
  milestoneId: any;
  description: any;
  assign: any;
  links: any;
  estimate: any;
  dueDate: any;
  assignedTo: any;
  startDate: any; // To update the milestone view to the deleted content month view
  endDate: any; // To update the milestone view to the deleted content month view
  departmentid: any;
  ACLDepartmentId: string;
  ACLUserId: string;
  ownerId: any;
  linksView: string;
  ACLDepartmentName: any;
  dependencyShowArray: any;
  selectedStatus: any;
  status: { name: string; status: string; }[];
  constructor(
    private fb: FormBuilder,
    private route: Router,
    private apiServices: APIService,
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private commonServices: CommonService,
    private location: Location
  ) {
    // To read URL param
    this.sub1 = this.activatedRoute.paramMap.subscribe(params => {
      this.milestoneId = params.get('id');
      this.emptyField();
      this.teamSelection();
    });
    // Edit Form Controls
    this.addTaskForm = this.fb.group({
      description: [''],
      links: [''],
      estimate: [''],
      assignees: [''],
    });
  }

  ngOnInit() {

    // Edit Form Controls
    // this.teamSelection();
    this.ACLAccess();
    this.statusCodes();
  }

  ACLAccess() {
    let ACLArr;
    this.ACLDepartmentId = JSON.parse(localStorage.getItem('productAccess')).department ? JSON.parse(localStorage.getItem('productAccess')).department : '';
    this.ACLDepartmentName = JSON.parse(localStorage.getItem('productAccess')).departmentName ? JSON.parse(localStorage.getItem('productAccess')).departmentName : '';

    ACLArr = JSON.parse(localStorage.getItem('productAccess')).ACLaccess.milestone.toString();
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

  tooltipName(arr: any[]) {
    arr = arr.filter((item, i) => i !== 0);
    return arr.map((item) => item.firstName + ' ' + item.lastName).toString();
  }

  // Status codes
  statusCodes() {
    this.status = [
      { name: 'TO-DO', status: 'to-do' },
      { name: 'IN-PROGRESS', status: 'in-progress' },
      { name: 'DONE', status: 'done' },
    ];
  }

  // Status Change API
  StatusChange(val) {
    const lastStatus = this.selectedStatus;
    this.selectedStatus = val.name;
    const statuss = {
      status: val.status
    };

    this.apiServices.editMilestone(this.milestoneId, statuss).subscribe((data: any) => {
      const month = moment(JSON.parse(localStorage.getItem('productAccess')).Year + '-' + JSON.parse(localStorage.getItem('productAccess')).Month + '-' + '01' + ' 00:00:00');
      const apiDates = {
        startDate: month.startOf('month').format('YYYY-MM-DD'),
        endDate: month.endOf('month').format('YYYY-MM-DD')
      };
      this.apiServices.firstProductMapping.next(apiDates);
      this.commonServices.success('Status Updated...', '');
    }, (error) => {
      this.selectedStatus = lastStatus;
      this.commonServices.error('Status not Updated... Try Again', '');
    });
  }

  emptyField() {
    this.displayName = null;
    this.department = null;
    this.description = null;
    this.links = null;
    this.assignedTo = null;
    this.estimate = null;
  }

  teamSelection() {

    this.getDataById();

  }

  getDataById() {
    let milestoneData: any;
    this.assign = [];

    // To get milstone details
    this.sub = this.apiServices.viewMilestone(this.milestoneId).subscribe((data: any) => {
      milestoneData = data.data.milestone;
      this.displayName = milestoneData.displayName;
      this.department = milestoneData.department.displayName;
      this.departmentid = milestoneData.department._id;
      this.selectedStatus = milestoneData.status;

      this.ownerId = milestoneData.owner._id;

      const depend = milestoneData.dependency;
      // console.log('depend', depend);
      const dependDepat = milestoneData.dependantDepartment;
      const dependAssign = milestoneData.dependantUsers;
      // console.log('dependAs', dependAssign);
      depend.forEach(element => {
        dependDepat.forEach(ele => {
          if (element.department === ele._id) {
            element.departmentName = ele.displayName;
            element.departmentSlug = ele.slug;
          }
        });
      });

      let assig: any[] = [];

      depend.forEach(element => {
          element.assignedTo.forEach(elem => {
              assig = dependAssign.filter((datas: any) => {
                return element.assignedTo.some((item: any) => {
                  if (datas._id === item) {
                    return item;
                  }
                });
              });
              element.assignedTos = assig;
        });
      });
      this.dependencyShowArray = depend;


      this.description = milestoneData.description.includes('size="1"') ? milestoneData.description.replace('size="1"', 'size="2"') : milestoneData.description;
      this.links = milestoneData.attachements;
      this.links.forEach(element => {
        element.urlName = element.url;
        element.url = element.url.startsWith('http://') || element.url.startsWith('https://') ? `${element.url}` : `http://${element.url}`;

      });
      // this.links = milestoneData.attachements[0].url.startsWith('http://') || milestoneData.attachements[0].url.startsWith('https://') ? `${milestoneData.attachements[0].url}` : `https://${milestoneData.attachements[0].url}`;
      this.linksView = milestoneData.attachements[0].url;
      this.assignedTo = milestoneData.assignedTo;
      // Assigned to First name Last name
      milestoneData.assignedTo.forEach((element, i) => {
        this.assign.push(element.firstName + ' ' + element.lastName);
      });
      // Due date custom Format
      const format = 'DD MMM YYYY';
      const enddate = moment(milestoneData.endDate).format(format);
      this.dueDate = enddate;
      this.startDate = moment(milestoneData.startDate).format(format);

      // Estimate by calculating start and end date
      const endate = moment(milestoneData.endDate);
      const stdate = moment(milestoneData.startDate);
      this.estimate = endate.diff(stdate, 'days') === 0 ? 1 : endate.diff(stdate, 'days') + 1;

      // setting start date and end date of particular milestone when Navigating to particular milestone month when milestone id is hardcoded in url
      const forDashboardMiletsonestartDate = moment(milestoneData.startDate).format('YYYY-MM-DD').split('-');
      const months = moment(forDashboardMiletsonestartDate[0] + '-' + forDashboardMiletsonestartDate[1] + '-' + '01' + ' 00:00:00');
      const apiDates = {
        startDate: months.startOf('month').format('YYYY-MM-DD'),
        endDate: months.endOf('month').format('YYYY-MM-DD')
      };


      if (JSON.parse(localStorage.getItem('productAccess')).Month.toString() !== forDashboardMiletsonestartDate[1] || JSON.parse(localStorage.getItem('productAccess')).Year.toString() !== forDashboardMiletsonestartDate[0]) {
        // Product Access Local Storage
        localStorage.setItem(
          'productAccess', JSON.stringify({
            departmentName: JSON.parse(localStorage.getItem('productAccess')).departmentName,
            department: JSON.parse(localStorage.getItem('productAccess')).department,
            productId: JSON.parse(localStorage.getItem('productAccess')).productId,
            ACLaccess: JSON.parse(localStorage.getItem('productAccess')).ACLaccess,
            sprintMilestoneId: JSON.parse(localStorage.getItem('productAccess')).sprintMilestoneId,
            versionId: JSON.parse(localStorage.getItem('productAccess')).versionId,
            Month: forDashboardMiletsonestartDate[1],
            Year: forDashboardMiletsonestartDate[0]
          })
        );
        return this.apiServices.firstProductMapping.next(apiDates); // Subject for Milestone
      }





    }, (error) => {
      this.close();
    });
  }

  view(val) {
    this.route.navigate([`/p/${JSON.parse(localStorage.getItem('productAccess')).productId.toString()}/m/${val}/view`]);
  }

  edit() {
    this.route.navigate([`/p/${JSON.parse(localStorage.getItem('productAccess')).productId.toString()}/m/${this.milestoneId}/edit`]);
  }

  close() {
    this.sub.unsubscribe();
    this.route.navigate([`/p/${JSON.parse(localStorage.getItem('productAccess')).productId.toString()}/m`]);
  }

  delete() {
    const dialogMsg = {
      id: this.milestoneId,
      msg: 'milestone',
      milestoneStartDate: this.startDate
    };
    this.openDialog(dialogMsg);
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

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.sub1.unsubscribe();
  }

}
