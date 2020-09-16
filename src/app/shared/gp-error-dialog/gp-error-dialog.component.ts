import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { APIService } from 'src/app/services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { Subscription } from 'rxjs';
import * as moment from 'moment';

@Component({
  selector: 'app-gp-error-dialog',
  templateUrl: './gp-error-dialog.component.html',
  styleUrls: ['./gp-error-dialog.component.scss']
})
export class GpErrorDialogComponent implements OnInit {
  msg: any;
  sub1: Subscription;
  deleteUserMsg: any;

  constructor(
    public dialogRef: MatDialogRef<GpErrorDialogComponent>,
    private apiServices: APIService,
    private route: Router,
    private activatedRoute: ActivatedRoute,
    private commonServices: CommonService,
    @Inject(MAT_DIALOG_DATA)
    public data
  ) { }

  ngOnInit() {
    this.msg = this.data.msg;
    if (this.data.alert === 'User Deactivated') {
      this.deleteUserMsg = 'Deactivate';
    } else {
      this.deleteUserMsg = 'Activate';
    }
  }

  confirm() {
    if (this.data.msg === 'comment') {
      this.apiServices.delComment(this.data.id).subscribe((data: any) => {
        this.commonServices.error('Comment Deleted', '');
        this.apiServices.forDeleteComment.next();
      });
      this.dialogRef.close();
    }

    if (this.data.msg === 'milestone') {
      this.sub1 = this.apiServices.deleteMilestone(this.data.id).subscribe((data: any) => {


        const month = moment(JSON.parse(localStorage.getItem('productAccess')).Year + '-' + JSON.parse(localStorage.getItem('productAccess')).Month + '-' + '01' + ' 00:00:00');
        const apiDates = {
          startDate: month.startOf('month').format('YYYY-MM-DD'),
          endDate: month.endOf('month').format('YYYY-MM-DD')
        };

        const forDashboardMiletsonestartDate = moment(apiDates.startDate).format('YYYY-MM-DD').split('-');
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

        // Subject triggers to update milestone
        this.apiServices.firstProductMapping.next(apiDates);
        this.commonServices.error('Milestone Deleted', '');
        this.sub1.unsubscribe();
        this.route.navigate([`/p/${JSON.parse(localStorage.getItem('productAccess')).productId.toString()}/m`]);
      });
      this.dialogRef.close();
    }

    if (this.data.msg === 'User') {
      this.apiServices.editMember(this.data.id, this.data.forDeActivateApiCall).subscribe((data: any) => {
        if (this.data.alert === 'User Deactivated') {
          this.commonServices.error(this.data.alert, '');
        } else {
          this.commonServices.success(this.data.alert, '');
        }
        this.apiServices.memberListRefresh.next();
      });
      this.dialogRef.close();
    }

    if (this.data.msg === 'logout') {
      this.apiServices.logout().subscribe((data: any) => {
        localStorage.clear();
        this.dialogRef.close();
        this.route.navigate(['/login']);
      });
    }
  }


}
