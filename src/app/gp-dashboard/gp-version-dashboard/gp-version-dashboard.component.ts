import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit, OnChanges, AfterViewChecked, OnDestroy } from '@angular/core';
import { APIService } from 'src/app/services/api.service';
import { CommonService } from 'src/app/services/common.service';
import * as moment from 'moment';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSelect } from '@angular/material';
import { trigger } from '@angular/animations';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';
import { isArray } from 'util';
import * as query from 'query-string';



@Component({
  selector: 'app-gp-version-dashboard',
  templateUrl: './gp-version-dashboard.component.html',
  styleUrls: ['./gp-version-dashboard.component.scss']
})
export class GpVersionDashboardComponent implements OnInit, AfterViewInit, AfterViewChecked, OnChanges, OnDestroy {

  sub: Subscription;
  sub1: Subscription;
  sub2: Subscription;
  sub3: Subscription;
  sub4: Subscription;
  sub5: Subscription;
  sub6: Subscription;
  selected: any;

  version = 1.0;
  progressValue = 70;
  productId: any;
  inputData: any[];
  lastInputData: any[] = [];
  refreshPage: boolean;
  selectedVersion;
  // Temp
  showContent: any;
  passData: any;
  passDataArr: any;
  versionArr: any;
  sprintsArr: any;
  stories: any;

  //  @Input() inpuFData: this.inputData;
  @ViewChild('show', { static: false }) show: ElementRef;
  queryComing: number;
  queryComingFirst: number;
  showDashboard: boolean = false;
  productList: any;
  ACL: any;
  selectedProduct: any;
  scrollDown: boolean;
  receivedChildEmittedFilterArr: any;
  constructor(
    public apiServices: APIService,
    public commonServices: CommonService,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private route: Router) {

  }

  ngAfterViewInit() {

  }

  ngOnInit() {
    // tslint:disable-next-line: no-string-literal
    MatSelect['decorators'][0].args[0].animations[0] = trigger('transformPanel', []);


    this.firstProductMapping();
    // Cut start
    // Sprint Board Data Rxjs
    // this.sprintReleases();
    // this.particularMilestoneMapping();
    // // Rx Js for displaying story board accordingly when navigating through sprints
    // this.sprintBoardWhenNavigation();
    // Cut End
    this.queryMap();

    this.ACLAccess();

    if (localStorage.getItem('triggerComment')) {
      this.route.navigate([`${localStorage.getItem('triggerComment')}`]);
      localStorage.removeItem('triggerComment');
    }

  }

  ACLAccess() {
    let ACLArr;
    if (JSON.parse(localStorage.getItem('productAccess')).ACLaccess.milestone) {
      ACLArr = JSON.parse(localStorage.getItem('productAccess')).ACLaccess.milestone.toString();
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
  }


  queryMap() {
    // this.activatedRoute
    //   .queryParams
    //   .subscribe(params => {
    //     // Defaults to 0 if no query param provided.
    //     this.queryComing = +params['page'] || 0;
    //   });
    let endDate = JSON.parse(localStorage.getItem('productAccess')).Month.toString();
    const month = moment(JSON.parse(localStorage.getItem('productAccess')).Year.toString() + '-' + endDate + '-' + '01' + ' 00:00:00');
    const apiDates = {
      startDate: month.startOf('month').format('YYYY-MM-DD'),
      endDate: month.endOf('month').format('YYYY-MM-DD')
    };
    this.getMilestone(apiDates.startDate, apiDates.endDate);
    // this.sprintData(JSON.parse(localStorage.getItem('productAccess')).productId.toString());
  }

  ngOnChanges() {

    //    this.shows();
  }

  ngAfterViewChecked(): void {
    //    this.shows();
  }


  // Rx js Subject for updating milestone from add, edit and delete
  // Switch betweeen months
  firstProductMapping() {
    this.sub5 = this.apiServices.firstProductMapping.subscribe((data: any) => {
      this.getMilestone(data.startDate, data.endDate);
    });
  }

  // Filtered Assignees Milestone
  getFilterArray(Arr: any) {
    const arrF = { assignedTo: Arr };
    const arrFilter = query.stringify(arrF);

    this.receivedChildEmittedFilterArr = arrFilter;
    // console.log(this.receivedChildEmittedFilterArr);

    let endDate = JSON.parse(localStorage.getItem('productAccess')).Month.toString();
    const month = moment(JSON.parse(localStorage.getItem('productAccess')).Year.toString() + '-' + endDate + '-' + '01' + ' 00:00:00');
    const apiDates = {
      startDate: month.startOf('month').format('YYYY-MM-DD'),
      endDate: month.endOf('month').format('YYYY-MM-DD')
    };
    if (Arr[0] === '0') {
      return this.getMilestone(apiDates.startDate, apiDates.endDate);
    }
    if (Arr.length === 0) {
      setTimeout(() => {
        this.inputData = [];
      }, 2000);
      this.getMilestone('2050-01-01', '2050-01-29');
      // return this.inputData = [];
    } else {
      return this.getFilterdAssigneeMilestone(apiDates.startDate, apiDates.endDate, this.receivedChildEmittedFilterArr);
    }
  }

  // Get milestone by month
  getFilterdAssigneeMilestone(startDate, endDate, filterArray) {
    if (JSON.parse(localStorage.getItem('productAccess')).productId.toString()) {
      this.sub6 = this.apiServices.getAllMilestonebyAssignees(JSON.parse(localStorage.getItem('productAccess')).productId.toString(), startDate, endDate, filterArray).subscribe((data: any) => {
        this.refreshPage = true;
        let dataMap = data.data.milestones.map(item => {
          return item.map(itm => {
            const [year, month, date] = itm.startDate.slice(0, 10).split('-');
            itm.startDate = { year, month: Number(month).toString(), date: Number(date).toString() };
            const [eY, eM, eD] = itm.endDate.slice(0, 10).split('-');
            itm.endDate = { year: eY, month: Number(eM).toString(), date: Number(eD).toString() };
            // itm.startDate = { year, month, date };
            //   const [eY, eM, eD] = itm.endDate.slice(0, 10).split('-');
            //   itm.endDate = { year: eY, month: eM, date: eD };
            const startDate = moment([year, month, date]);
            const endDate = moment([eY, eM, eD]);
            // for defining width for the widget
            item['width'] = `${(endDate.diff(startDate, 'days') + 1)}`;
            // for defining where it should stay on the chart
            return itm;
          });
        });
        this.inputData = dataMap;
      }, (error) => {
        if (error.status === 403) {
          this.apiServices.logout().subscribe((data: any) => {
            localStorage.clear();
            this.route.navigate(['/login']);
          });
        }
      });

    }
  }


  // Get milestone by month
  getMilestone(startDate, endDate) {
    if (JSON.parse(localStorage.getItem('productAccess')).productId.toString()) {

      this.sub6 = this.apiServices.getAllMilestone(JSON.parse(localStorage.getItem('productAccess')).productId.toString(), startDate, endDate).subscribe((data: any) => {
        this.refreshPage = true;
        localStorage.setItem('forDependecy', JSON.stringify(data));
        let dataMap = data.data.milestones.map(item => {
          return item.map(itm => {
            const [year, month, date] = itm.startDate.slice(0, 10).split('-');
            itm.startDate = { year, month: Number(month).toString(), date: Number(date).toString() };
            const [eY, eM, eD] = itm.endDate.slice(0, 10).split('-');
            itm.endDate = { year: eY, month: Number(eM).toString(), date: Number(eD).toString() };
            // itm.startDate = { year, month, date };
            //   const [eY, eM, eD] = itm.endDate.slice(0, 10).split('-');
            //   itm.endDate = { year: eY, month: eM, date: eD };
            const startDate = moment([year, month, date]);
            const endDate = moment([eY, eM, eD]);
            // for defining width for the widget
            item['width'] = `${(endDate.diff(startDate, 'days') + 1)}`;
            // for defining where it should stay on the chart
            return itm;
          });
        });
        this.inputData = dataMap;
      }, (error) => {
        if (error.status === 403) {
          this.apiServices.logout().subscribe((data: any) => {
            localStorage.clear();
            this.route.navigate(['/login']);
          });
        }
      });

    }
  }

  comments(versionId) {
    localStorage.setItem('comments', 'Sprint');
    this.route.navigate([`/p/${JSON.parse(localStorage.getItem('productAccess')).productId.toString()}/m/${versionId}/comments`]);
  }

  ngOnDestroy() {
    this.sub ? this.sub.unsubscribe() : '';
    this.sub1 ? this.sub1.unsubscribe() : '';
    this.sub2 ? this.sub2.unsubscribe() : '';
    this.sub3 ? this.sub3.unsubscribe() : '';
    this.sub4 ? this.sub4.unsubscribe() : '';
    this.sub5 ? this.sub5.unsubscribe() : '';
    if (this.refreshPage) {
      this.sub6 ? this.sub6.unsubscribe() : '';
    }

  }

}
