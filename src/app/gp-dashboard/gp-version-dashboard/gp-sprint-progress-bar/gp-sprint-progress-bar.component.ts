import { Component, OnInit, Input, OnChanges } from '@angular/core';
import * as moment from 'moment';
import { APIService } from 'src/app/services/api.service';
import { CommonService } from 'src/app/services/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-gp-sprint-progress-bar',
  templateUrl: './gp-sprint-progress-bar.component.html',
  styleUrls: ['./gp-sprint-progress-bar.component.scss']
})
export class GpSprintProgressBarComponent implements OnInit, OnChanges {

  @Input()
  sprints;
  progressValue;
  sprintList: any;
  nextId: any;
  sprintListTs: any;
  sprintListId: any;
  sprintEndDate: any;
  sprintStartDate: any;
  disableLeftIcon = true;
  disableRightIcon = false;
  totalIssues: any;
  totalDone: any;
  totalHrs: any;
  loggedHrs: any;
  showFutureSprint: boolean;

  constructor(
    public apiServices: APIService,
    public commonServices: CommonService,
    private activatedRoute: ActivatedRoute,
    private route: Router,
    private location: Location
  ) {
  }

  ngOnInit() {
    // setInterval(() => {
    //   this.setValue();
    // }, 100);
  }

  ngOnChanges() {
    this.progressData();
  }

  progressData() {

    const tempId = JSON.parse(localStorage.getItem('productAccess')).sprintMilestoneId;
    for (let i = 0; i < this.sprints[0].sprints.length; i++) {
      if (this.sprints[0].sprints[i].milestone === tempId) {
        this.sprintList = this.sprints[0].sprints[i].name;
        this.sprintListId = this.sprints[0].sprints[i].milestone;
        this.totalIssues = this.sprints[0].sprints[i].totalIssues;
        this.totalDone = this.sprints[0].sprints[i].totalDone;
        this.totalHrs = Math.round(this.sprints[0].sprints[i].totalEstimateHrs * 100) / 100;
        this.loggedHrs = Math.round(this.sprints[0].sprints[i].totalWorkLogsHrs * 100) / 100;
        this.sprintStartDate = this.sprints[0].sprints[i].startDate;
        this.sprintEndDate = this.sprints[0].sprints[i].endDate;
        this.progressValue = (this.sprints[0].sprints[i].totalDone / this.sprints[0].sprints[i].totalIssues) * 100;
        if (isNaN(this.progressValue)) {
          this.progressValue = 0;
        }
        // Due date custom Format
        const format = 'MMM DD';
        const startdate = moment(this.sprintStartDate).format(format);
        this.sprintStartDate = startdate;
        const enddate = moment(this.sprintEndDate).format(format);
        this.sprintEndDate = enddate;

        if (this.sprintStartDate == 'Invalid date' && this.sprintEndDate == 'Invalid date') {
          this.showFutureSprint = true;
        } else {
          this.showFutureSprint = false;
        }

      } else {
      }
    }
    if (this.sprints[0].sprints.length <= 1) {
      this.disableLeftIcon = true;
      this.disableRightIcon = true;
    } else {
      this.disableLeftIcon = false;
      this.disableRightIcon = false;
    }
    this.sprintListTs = this.sprints[0].sprints;
    if (this.sprintListId === this.sprints[0].sprints[0].milestone) {
      this.disableLeftIcon = true;
    }
    const check = this.sprintListTs.length - 1;
    if (this.sprintListId === this.sprintListTs[check].milestone) {
      this.disableRightIcon = true;
    }


  }

  switchLeft(sprintId) {
    this.progressValue = 0;
    this.disableRightIcon = false;
    for (let i = 0; i < this.sprintListTs.length; i++) {
      if (this.sprintListTs[i].milestone === sprintId) {
        this.sprintListId = this.sprintListTs[i - 1].milestone;
        if (this.sprints[0].sprints[0].milestone === this.sprintListId) {
          this.disableLeftIcon = true;
        }
        this.sprintList = this.sprintListTs[i - 1].name;
        this.sprintStartDate = this.sprintListTs[i - 1].startDate;
        this.sprintEndDate = this.sprintListTs[i - 1].endDate;
        this.totalIssues = this.sprintListTs[i - 1].totalIssues;
        this.totalDone = this.sprintListTs[i - 1].totalDone;
        this.totalHrs = Math.round(this.sprintListTs[i - 1].totalEstimateHrs * 100) / 100;
        this.loggedHrs = Math.round(this.sprintListTs[i - 1].totalWorkLogsHrs * 100) / 100;
        this.progressValue = (this.sprintListTs[i - 1].totalDone / this.sprintListTs[i - 1].totalIssues) * 100;
        if (isNaN(this.progressValue)) {
          this.progressValue = 0;
        }
        // Due date custom Format
        const format = 'DD MMM';
        const startdate = moment(this.sprintStartDate).format(format);
        this.sprintStartDate = startdate;
        const enddate = moment(this.sprintEndDate).format(format);
        this.sprintEndDate = enddate;
        if (this.sprintStartDate == 'Invalid date' && this.sprintEndDate == 'Invalid date') {
          this.showFutureSprint = true;
        } else {
          this.showFutureSprint = false;
        }
        this.apiServices.sprintBoardOnProductChange.next(this.sprintListId);

        // Product Access Local Storage
        localStorage.setItem(
          'productAccess', JSON.stringify({
            departmentName: JSON.parse(localStorage.getItem('productAccess')).departmentName,
            department: JSON.parse(localStorage.getItem('productAccess')).department,
            productId: JSON.parse(localStorage.getItem('productAccess')).productId,
            ACLaccess: JSON.parse(localStorage.getItem('productAccess')).ACLaccess,
            sprintMilestoneId: this.sprintListId,
            versionId: JSON.parse(localStorage.getItem('productAccess')).versionId,
            Month: JSON.parse(localStorage.getItem('productAccess')).Month,
            Year: JSON.parse(localStorage.getItem('productAccess')).Year
          })
        );
        // if (this.location.path() === `/p/${JSON.parse(localStorage.getItem('productAccess')).productId.toString()}/m` || this.location.path().includes('/sprints')) {
        this.route.navigate([`/p/${JSON.parse(localStorage.getItem('productAccess')).productId.toString()}/m/${JSON.parse(localStorage.getItem('productAccess')).sprintMilestoneId.toString()}/s`]);
        // }

      } else {
      }
    }
  }
  switchRight(sprintId) {
    this.progressValue = 0;
    this.disableLeftIcon = false;
    for (let i = 0; i < this.sprintListTs.length; i++) {
      if (this.sprintListTs[i].milestone === sprintId) {
        const check = this.sprintListTs.length - 2;
        if (this.sprintListTs[i].milestone === this.sprintListTs[check].milestone) {
          this.disableRightIcon = true;
        }
        this.sprintListId = this.sprintListTs[i + 1].milestone;
        this.sprintList = this.sprintListTs[i + 1].name;
        this.sprintStartDate = this.sprintListTs[i + 1].startDate;
        this.sprintEndDate = this.sprintListTs[i + 1].endDate;
        this.totalIssues = this.sprintListTs[i + 1].totalIssues;
        this.totalDone = this.sprintListTs[i + 1].totalDone;
        this.totalHrs = Math.round(this.sprintListTs[i + 1].totalEstimateHrs * 100) / 100;
        this.loggedHrs = Math.round(this.sprintListTs[i + 1].totalWorkLogsHrs * 100) / 100;
        this.progressValue = (this.sprintListTs[i + 1].totalDone / this.sprintListTs[i + 1].totalIssues) * 100;
        if (isNaN(this.progressValue)) {
          this.progressValue = 0;
        }
        // Due date custom Format
        const format = 'DD MMM';
        const startdate = moment(this.sprintStartDate).format(format);
        this.sprintStartDate = startdate;
        const enddate = moment(this.sprintEndDate).format(format);
        this.sprintEndDate = enddate;
        if (this.sprintStartDate == 'Invalid date' && this.sprintEndDate == 'Invalid date') {
          this.showFutureSprint = true;
        } else {
          this.showFutureSprint = false;
        }

        this.apiServices.sprintBoardOnProductChange.next(this.sprintListId);

        // Product Access Local Storage
        localStorage.setItem(
          'productAccess', JSON.stringify({
            departmentName: JSON.parse(localStorage.getItem('productAccess')).departmentName,
            department: JSON.parse(localStorage.getItem('productAccess')).department,
            productId: JSON.parse(localStorage.getItem('productAccess')).productId,
            ACLaccess: JSON.parse(localStorage.getItem('productAccess')).ACLaccess,
            sprintMilestoneId: this.sprintListId,
            versionId: JSON.parse(localStorage.getItem('productAccess')).versionId,
            Month: JSON.parse(localStorage.getItem('productAccess')).Month,
            Year: JSON.parse(localStorage.getItem('productAccess')).Year
          })
        );
        // if (this.location.path() === `/p/${JSON.parse(localStorage.getItem('productAccess')).productId.toString()}/m` || this.location.path().includes('/sprints')) {
        this.route.navigate([`/p/${JSON.parse(localStorage.getItem('productAccess')).productId.toString()}/m/${JSON.parse(localStorage.getItem('productAccess')).sprintMilestoneId.toString()}/s`]);
        // }

      } else {
      }
    }
  }
}
