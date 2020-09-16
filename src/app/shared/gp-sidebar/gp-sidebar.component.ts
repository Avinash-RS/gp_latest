import { Component, OnInit, OnChanges, OnDestroy, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { APIService } from 'src/app/services/api.service';
import { CommonService } from 'src/app/services/common.service';
import * as moment from 'moment';
import { TooltipPosition } from '@angular/material';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';

@Component({
  selector: 'app-gp-sidebar',
  templateUrl: './gp-sidebar.component.html',
  styleUrls: ['./gp-sidebar.component.scss']
})
export class GpSidebarComponent implements OnInit, OnDestroy, OnChanges {
  status: any;

  @Input()
  selectedProduct1;
  selectedProduct;

  positionOptions: TooltipPosition[] = ['after', 'before', 'above', 'below', 'left', 'right'];
  position = this.positionOptions[5];
  sub: Subscription;
  productId: any;
  showdash: boolean;

  constructor(
    private route: Router,
    private apiServices: APIService,
    private activatedRoute: ActivatedRoute,
    private commonServices: CommonService,
    private location: Location
  ) {
  }

  ngOnInit() {
    this.selectedProduct = this.selectedProduct1;
    this.sideNavActive();
  }

  ngOnChanges() {
    //  this.sideNavActive();
    this.selectedProduct = this.selectedProduct1;
  }

  // Rxjs sideNavActive to Enable Active Link while switching products
  sideNavActive() {
    this.apiServices.sideNavActive.subscribe((data: any) => {
      this.selectedProduct = data;
    });
  }

  ngOnDestroy() {
    this.sub ? this.sub.unsubscribe() : '';
  }

}
