import { Component, OnInit } from '@angular/core';
import { APIService } from 'src/app/services/api.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-gp-email-verfier',
  templateUrl: './gp-email-verfier.component.html',
  styleUrls: ['./gp-email-verfier.component.scss']
})
export class GpEmailVerfierComponent implements OnInit {

  constructor(private apiService: APIService, private commonServices: CommonService) { }

  ngOnInit() {
  }

  resendVerficationCode() {
    this.apiService.resendVerficationToken().subscribe((data: any) => {
      this.commonServices.success('Email has been sent with the verification link', '');
    });
  }

}
