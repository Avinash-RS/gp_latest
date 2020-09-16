import { Component, OnInit, OnChanges, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { APIService } from '../services/api.service';
import * as versioning from '../../../package.json';
import {
  Router, ActivatedRoute, NavigationStart, NavigationEnd,
  NavigationCancel, NavigationError, Event, ResolveEnd, RouterOutlet, ActivationStart
} from '@angular/router';
import * as moment from 'moment';
import { Location } from '@angular/common';
import { CommonService } from '../services/common.service';


@Component({
  selector: 'app-gp-main-dashboard',
  templateUrl: './gp-main-dashboard.component.html',
  styleUrls: ['./gp-main-dashboard.component.scss']
})
export class GpMainDashboardComponent implements OnInit, OnChanges, AfterViewInit {

  showDialog = false;
  redirection: boolean;
  version: any;
  productList;
  selected;
  productId: any;
  selectedProduct;
  selectedProduct1;
  productList1;
  showNavIcon = true;
  urlProductId;
  afterBaseUrlPath;
  slicePath;
  afterPidPath;
  apiDates: { startDate: string; endDate: string; };
  localStorageMonth: any;
  localStorageYear: any;
  sprintMilestoneId: any;
  powerBIURL: any;
  constructor(
    public apiServices: APIService,
    private route: Router,
    public commonServices: CommonService,
    private location: Location,
    private activatedRoute: ActivatedRoute,
  ) {
    this.onProductChange();
    this.getProducts();

    // To read URL param
    this.activatedRoute.paramMap.subscribe(params => {
      let productUrlId = params.get('pid');
    });

  }

  ngOnInit() {

    this.afterBaseUrlPath = this.location.path().slice(3);
    const slicePath = this.afterBaseUrlPath.search('/');
    this.afterPidPath = this.afterBaseUrlPath.substring(slicePath);
    if (this.slicePath !== -1) {
      this.urlProductId = this.afterBaseUrlPath.substring(0, slicePath);
    } else {
      this.urlProductId = null;
    }

    this.version = versioning.version;
    // this.sideNavActive();

  }

  getProducts() {
    this.apiServices.productList().subscribe((data: any) => {
      this.productList = data.data.products;
      this.productList1 = data.data.products;

      if (sessionStorage.getItem('commentUrl')) {
        sessionStorage.removeItem('commentUrl');
        let apiDates;
        apiDates = {
          startDate: moment().startOf('month').format('YYYY-MM-DD'),
          endDate: moment().endOf('month').format('YYYY-MM-DD')
        };
        const forDashboardMiletsonestartDate = moment(apiDates.startDate).format('YYYY-MM-DD').split('-');
        const localStorageMonth = forDashboardMiletsonestartDate[1];
        const localStorageYear = forDashboardMiletsonestartDate[0];

        this.selected = this.productList[0].product._id;
        this.powerBIURL = this.productList[0].product.reportURL;
        this.apiServices.powerBI.next(this.powerBIURL);
        localStorage.setItem('reportURL', this.powerBIURL);
        this.selectedProduct = this.selected;
        let permissions;
        let role;
        let dept;
        dept = this.productList[0].users[0].department._id;
        permissions = this.productList[0].users[0].department.displayName;
        const deptName = this.productList[0].users[0].department.displayName;
        role = this.productList[0].users[0].role.permissions;
        let productAccess;
        let milestoneAccess;
        let commentAccess;
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
            departmentName: deptName,
            department: dept,
            productId: this.productList[0].product._id,
            ACLaccess: { product: productAccess, milestone: milestoneAccess, comment: commentAccess },
            sprintMilestoneId: '',
            versionId: '',
            Month: localStorageMonth,
            Year: localStorageYear
          })
        );

        this.route.navigate([`/p/${this.selectedProduct}/m`]);
        this.selectedProduct1 = this.selectedProduct;
        // this.apiServices.loadReleasesAPI.next(this.selected);
        // this.apiServices.firstProductMapping.next(apiDates); // Subject for Milestone

      }
      if (!this.urlProductId) {
        let apiDates;
        apiDates = {
          startDate: moment().startOf('month').format('YYYY-MM-DD'),
          endDate: moment().endOf('month').format('YYYY-MM-DD')
        };
        const forDashboardMiletsonestartDate = moment(apiDates.startDate).format('YYYY-MM-DD').split('-');
        const localStorageMonth = forDashboardMiletsonestartDate[1];
        const localStorageYear = forDashboardMiletsonestartDate[0];

        this.selected = this.productList[0].product._id;
        this.powerBIURL = this.productList[0].product.reportURL;
        this.apiServices.powerBI.next(this.powerBIURL);
        localStorage.setItem('reportURL', this.powerBIURL);


        this.selectedProduct = this.selected;
        let permissions;
        let role;
        let dept;
        dept = this.productList[0].users[0].department._id;
        permissions = this.productList[0].users[0].department.displayName;
        const deptName = this.productList[0].users[0].department.displayName;
        role = this.productList[0].users[0].role.permissions;
        let productAccess;
        let milestoneAccess;
        let commentAccess;
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
            departmentName: deptName,
            department: dept,
            productId: this.productList[0].product._id,
            ACLaccess: { product: productAccess, milestone: milestoneAccess, comment: commentAccess },
            sprintMilestoneId: '',
            versionId: '',
            Month: localStorageMonth,
            Year: localStorageYear
          })
        );

        this.route.navigate([`/p/${this.selectedProduct}/m`]);
        this.selectedProduct1 = this.selectedProduct;
        // this.apiServices.loadReleasesAPI.next(this.selected);
        // this.apiServices.firstProductMapping.next(apiDates); // Subject for Milestone

      } else {
        let apiDates;
        // apiDates = {
        //   startDate: moment().startOf('month').format('YYYY-MM-DD'),
        //   endDate: moment().endOf('month').format('YYYY-MM-DD')
        // };
        const month = moment(JSON.parse(localStorage.getItem('productAccess')).Year.toString() + '-' + JSON.parse(localStorage.getItem('productAccess')).Month.toString() + '-' + '01' + ' 00:00:00');
        apiDates = {
          startDate: month.startOf('month').format('YYYY-MM-DD'),
          endDate: month.endOf('month').format('YYYY-MM-DD')
        };

        const forDashboardMiletsonestartDate = moment(apiDates.startDate).format('YYYY-MM-DD').split('-');

        this.localStorageMonth = forDashboardMiletsonestartDate[1];
        this.localStorageYear = forDashboardMiletsonestartDate[0];

        this.elseMethodCalling();
      }
    });

  }

  elseMethodCalling() {
    // localStorage.removeItem('sprintRoute');
    const productId = this.urlProductId;
    let productAccess;
    let milestoneAccess;
    let commentAccess;
    // this.selected = JSON.parse(localStorage.getItem('productAccess')).productId.toString();
    this.selected = this.urlProductId;
    this.selectedProduct = this.selected;
    let permissions;
    let role;
    let dept;
    const user = this.productList.find(ele => ele.product._id === this.urlProductId);

    let deptName;
    if (user) {
      let productDetails;
      productDetails = user.users;
      this.powerBIURL = user.product.reportURL;
      this.apiServices.powerBI.next(this.powerBIURL);
      localStorage.setItem('reportURL', this.powerBIURL);

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
    } else {
      this.apiServices.logout().subscribe((data: any) => {
        localStorage.clear();
        this.route.navigate(['/login']);
        this.commonServices.error('user not found', '');
      });
    }

    // Product Access Local Storage
    localStorage.setItem(
      'productAccess', JSON.stringify({
        departmentName: deptName,
        department: dept,
        productId,
        ACLaccess: { product: productAccess, milestone: milestoneAccess, comment: commentAccess },
        sprintMilestoneId: this.sprintMilestoneId ? this.sprintMilestoneId : '',
        versionId: JSON.parse(localStorage.getItem('productAccess')).versionId ? JSON.parse(localStorage.getItem('productAccess')).versionId : '',
        Month: this.localStorageMonth,
        Year: this.localStorageYear
      })
    );

    this.route.navigate([this.route.url]);
    this.selectedProduct1 = this.selectedProduct;

  }

  onProductChange() {
    this.apiServices.onProductChangeSubject.subscribe((productId: any) => {
      this.urlProductId = productId;

      this.apiServices.productList().subscribe((data: any) => {
        this.productList = data.data.products;
        this.productList1 = data.data.products;
        let apiDates;

        // const month = moment(JSON.parse(localStorage.getItem('productAccess')).Year.toString() + '-' + JSON.parse(localStorage.getItem('productAccess')).Month.toString() + '-' + '01' + ' 00:00:00');
        // apiDates = {
        //   startDate: month.startOf('month').format('YYYY-MM-DD'),
        //   endDate: month.endOf('month').format('YYYY-MM-DD')
        // };

        apiDates = {
          startDate: moment().startOf('month').format('YYYY-MM-DD'),
          endDate: moment().endOf('month').format('YYYY-MM-DD')
        };
        const forDashboardMiletsonestartDate = moment(apiDates.startDate).format('YYYY-MM-DD').split('-');
        const localStorageMonth = forDashboardMiletsonestartDate[1];
        const localStorageYear = forDashboardMiletsonestartDate[0];


        this.selected = this.urlProductId;
        this.selectedProduct = this.selected;
        let permissions;
        let role;
        let dept;
        let deptName;
        let productAccess;
        let milestoneAccess;
        let commentAccess;
        const user = this.productList.find(ele => ele.product._id === this.urlProductId);
        if (user) {
          let productDetails;
          productDetails = user.users;
          this.powerBIURL = user.product.reportURL;
          this.apiServices.powerBI.next(this.powerBIURL);
          localStorage.setItem('reportURL', this.powerBIURL);

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
        } else {
          console.error("user not found");
        }

        // Product Access Local Storage
        localStorage.setItem(
          'productAccess', JSON.stringify({
            departmentName: deptName,
            department: dept,
            productId: this.urlProductId,
            ACLaccess: { product: productAccess, milestone: milestoneAccess, comment: commentAccess },
            sprintMilestoneId: '',
            versionId: '',
            Month: localStorageMonth,
            Year: localStorageYear
          })
        );

        const afterBaseUrlPath = this.location.path().slice(3);
        const slicePath = afterBaseUrlPath.search('/');
        const afterPidPath = afterBaseUrlPath.substring(slicePath);

        this.selectedProduct1 = this.selectedProduct;

        // if (this.urlProductId) {
        if (afterPidPath.startsWith('/t')) {
          this.route.navigate([`/p/${this.urlProductId}/t`]);
          return this.apiServices.memberListRefresh.next();
        }
        if (afterPidPath.startsWith('/powerBI')) {
          this.route.navigate([`/p/${this.urlProductId}/powerBI`]);
        } else {
          this.route.navigate([`/p/${this.urlProductId}/m`]);
          // this.apiServices.loadReleasesAPI.next(this.selectedProduct);
          return this.apiServices.firstProductMapping.next(apiDates); // Subject for Milestone
        }

      });
    });
  }

  ngOnChanges() {
  }

  ngAfterViewInit() {
  }
}
