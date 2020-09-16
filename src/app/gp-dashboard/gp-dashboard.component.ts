import { Component, OnInit, OnChanges } from '@angular/core';
import { APIService } from '../services/api.service';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-gp-dashboard',
  templateUrl: './gp-dashboard.component.html',
  styleUrls: ['./gp-dashboard.component.scss']
})
export class GpDashboardComponent implements OnInit, OnChanges {

  constructor(
    public apiServices: APIService,
    private activatedRoute: ActivatedRoute,
    private location: Location
  ) {
    // To read URL param
    this.activatedRoute.paramMap.subscribe(params => {
      let productUrlId = params.get('pid');

    });
  }
  ngOnInit() {



  }



  ngOnChanges() {
  }

}
