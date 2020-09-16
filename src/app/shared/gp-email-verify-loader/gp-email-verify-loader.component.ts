import { Component, OnInit } from '@angular/core';
import { IModalInfo } from 'src/app/Interface/model';
import { ModalInfoWithbuttonComponent } from '../modal-info-withbutton/modal-info-withbutton.component';
import { MatDialog } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { APIService } from 'src/app/services/api.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-gp-email-verify-loader',
  templateUrl: './gp-email-verify-loader.component.html',
  styleUrls: ['./gp-email-verify-loader.component.scss']
})
export class GpEmailVerifyLoaderComponent implements OnInit {

  emailId: any;
  constructor(
    public dialog: MatDialog,
    private route: Router,
    private apiService: APIService,
    private activatedRoute: ActivatedRoute,
    private commonServices: CommonService
  ) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      this.emailId = params.get('id');
    });

    this.apiService.verifyEmail(this.emailId).subscribe((data: any) => {
      this.openDialog();
    }, (error) => {
      this.errorDialog();
    });
  }

  // Open dailog
  openDialog() {
    let dialogDetails: IModalInfo;
    let pageContent;

    // tslint:disable-next-line: max-line-length
    pageContent = '<p>Your Email is successfully verified.</p> <p>Click on the okay button to redirect to Login page</p>';

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
    const dialogRef = this.dialog.open(ModalInfoWithbuttonComponent, {
      width: '661px',
      height: '328px',
      data: dialogDetails
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Empty form field
        //        this.emptyFormField();
        // back to loggin page
        //        this.backtoLogin();
        this.route.navigate([`/p/${JSON.parse(localStorage.getItem('productAccess')).productId.toString()}/m`]);
      }
    });
  }

  // Open dailog
  errorDialog() {
    let dialogDetails: IModalInfo;
    let pageContent;

    // tslint:disable-next-line: max-line-length
    pageContent = '<p>User Not Found</p>';

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
      width: '400px',
      height: '300px',
      data: dialogDetails
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Empty form field
        //        this.emptyFormField();
        // back to loggin page
        //        this.backtoLogin();
        this.route.navigate([`/p/${JSON.parse(localStorage.getItem('productAccess')).productId.toString()}/m`]);
      }
    });
  }


}
