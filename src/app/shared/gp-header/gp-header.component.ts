import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { MatOption, MatDialog, TooltipPosition } from '@angular/material';
import { Router } from '@angular/router';
import { APIService } from 'src/app/services/api.service';
import { CommonService } from 'src/app/services/common.service';
import * as moment from 'moment';
import { IModalInfo } from 'src/app/Interface/model';
import { ModalInfoWithbuttonComponent } from '../modal-info-withbutton/modal-info-withbutton.component';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Location } from '@angular/common';
import { GpErrorDialogComponent } from '../gp-error-dialog/gp-error-dialog.component';

@Component({
  selector: 'app-gp-header',
  templateUrl: './gp-header.component.html',
  styleUrls: ['./gp-header.component.scss']
})
export class GpHeaderComponent implements OnInit, OnChanges {

  positionOptions: TooltipPosition[] = ['after', 'before', 'above', 'below', 'left', 'right'];
  position = this.positionOptions[1];

  @Input()
  productList1;

  @Input()
  selectedProduct;

  BASE_IMAGE_URL = environment.Image_Base_Url;

  selected;
  productList: any;
  userName: any;
  url: any;
  fName: any;
  lName: any;
  currUser: any;
  selectedTimezoneInput: any;
  APIlocation: any;
  APIphoneCodes: any;
  APIphoneNos: any;
  selectedProductTip;
  constructor(
    private route: Router,
    public dialog: MatDialog,
    public apiServices: APIService,
    public commonServices: CommonService,
    private location: Location
  ) { }

  ngOnInit() {
    this.getMyProfile();
    this.rxJsProfilePic();
  }

  ngOnChanges() {
    this.getProducts();
  }

  rxJsProfilePic() {
    let subscribe: Subscription;
    subscribe = this.apiServices.profilePicUpdate.subscribe((data: any) => {
      this.getMyProfile();
    });
    // subscribe.unsubscribe();
  }

  // Get my Profile
  getMyProfile() {
    this.apiServices.getMyProfile().subscribe((data: any) => {

      this.currUser = data.data;
      this.selectedTimezoneInput = data.data.user.timezone ? data.data.user.timezone : '';
      this.fName = data.data.user.firstName;
      this.lName = data.data.user.lastName;
      this.userName = data.data.user.firstName;
      this.APIlocation = this.currUser.user.location ? this.currUser.user.location : '';
      if (this.currUser.user.phoneNumber) {
        this.APIphoneCodes = this.currUser.user.phoneNumber.code ? this.currUser.user.phoneNumber.code : this.currUser.user.phoneNumber ? '' : '';
        this.APIphoneNos = this.currUser.user.phoneNumber ? this.currUser.user.phoneNumber.phNumber : '';
      } else {
        this.APIphoneCodes = '';
        this.APIphoneNos = '';
      }
      if (data.data.user.profileImageUrl) {
        this.url = data.data.user.profileImageUrl.startsWith('https://ik.imagekit.io/growthportal') ? data.data.user.profileImageUrl.replace('https://ik.imagekit.io/growthportal', '') : data.data.user.profileImageUrl;
      } else {
        this.url = data.data.user.profileImageUrl ? data.data.user.profileImageUrl : '';
      }

      // user profile local storage
      localStorage.setItem('userProfile', `${JSON.stringify({
        fName: this.fName, lName: this.lName, APIlocation: this.APIlocation,
        APIphoneCodes: this.APIphoneCodes, APIphoneNos: this.APIphoneNos, url: this.url, selectedTimezoneInput: this.selectedTimezoneInput,
        userId: this.currUser.user._id
      })}`);

      // this.url = data.data.user.profileImageUrl ? data.data.user.profileImageUrl : `https://ui-avatars.com/api/?name=${this.fName}+${this.lName}`;

    });
  }

  getProducts() {
    this.productList = this.productList1;
    this.productList.forEach(product => {
      if (product.product._id === this.selectedProduct) {
        this.selectedProductTip = product.product.displayName;
      }
    });
  }

  // For Logout
  logOut() {
    const dialogMsg = {
      msg: 'logout'
    };
    this.openDialog1(dialogMsg);
  }


  onProductChange(productId: any) {
    this.apiServices.sideNavActive.next(productId);
    this.apiServices.userListOnProductChange.next(productId);
    // Set a Start month to current month while changing product
    // Product Access Local Storage
    // localStorage.setItem(
    //   'productAccess', JSON.stringify({
    //     departmentName: JSON.parse(localStorage.getItem('productAccess')).departmentName,
    //     department: JSON.parse(localStorage.getItem('productAccess')).department,
    //     productId: JSON.parse(localStorage.getItem('productAccess')).productId,
    //     ACLaccess: JSON.parse(localStorage.getItem('productAccess')).ACLaccess,
    //     sprintMilestoneId: JSON.parse(localStorage.getItem('productAccess')).sprintMilestoneId,
    //     versionId: JSON.parse(localStorage.getItem('productAccess')).versionId,
    //     Month: (moment().month() + 1).toString(),
    //     Year: (moment().year()).toString()
    //   })
    // );


    this.apiServices.onProductChangeSubject.next(productId);
  }

  // For Profile Updation
  profile() {
    this.route.navigate([`/p/${JSON.parse(localStorage.getItem('productAccess')).productId.toString()}/profile`]);
  }

  backToDashboard() {
    this.route.navigate([`/p/${JSON.parse(localStorage.getItem('productAccess')).productId.toString()}/m`]);
  }

  // Open dailog // For logout dialog box
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


  // Open dailog
  openDialog() {
    let dialogDetails: IModalInfo;
    let pageContent;

    if (localStorage.getItem('reDirect') === 'true') {
      pageContent = "Project hasn't been setup yet. <br><br> Please Select a Different Product";
    } else {
      pageContent = "No Milestones Available in this Product. <br><br> You can create one in Dashboard or Select a Different Product.";
    }
    dialogDetails = {
      iconName: 'error',
      showCancel: false,
      content: pageContent,
      buttonText: 'Okay'
    };

    /**
     * Dialog modal window
     */
    // tslint:disable-next-line: one-variable-per-declaration
    const dialogRef = this.dialog.open(ModalInfoWithbuttonComponent, {
      width: '600px',
      height: '290px',
      data: dialogDetails
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Empty form field
        // back to Dashboard page
      }
    });
  }

}
