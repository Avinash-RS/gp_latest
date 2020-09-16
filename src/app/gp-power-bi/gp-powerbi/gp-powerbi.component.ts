import { Component, OnInit, OnChanges } from '@angular/core';
import { APIService } from 'src/app/services/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-gp-powerbi',
  templateUrl: './gp-powerbi.component.html',
  styleUrls: ['./gp-powerbi.component.scss']
})
export class GpPowerbiComponent implements OnInit, OnChanges {
  powerBI: SafeResourceUrl;
  powerBIURL: any;

  constructor(
    public apiServices: APIService,
    private route: Router,
    public commonServices: CommonService,
    private activatedRoute: ActivatedRoute,
    public sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.powerBIURL = localStorage.getItem('reportURL');
    this.powerBI = this.sanitizer.bypassSecurityTrustResourceUrl(localStorage.getItem('reportURL'));
    this.power();
  }

  ngOnChanges() {
  }

  // Rxjs
  power() {
    this.apiServices.powerBI.subscribe((data: any) => {
      this.powerBIURL = data;
      this.powerBI = this.sanitizer.bypassSecurityTrustResourceUrl(data);
    });
  }

}
