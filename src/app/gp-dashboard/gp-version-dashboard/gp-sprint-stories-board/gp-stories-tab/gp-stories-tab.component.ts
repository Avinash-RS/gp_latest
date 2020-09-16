import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { APIService } from 'src/app/services/api.service';
import { CommonService } from 'src/app/services/common.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-gp-stories-tab',
  templateUrl: './gp-stories-tab.component.html',
  styleUrls: ['./gp-stories-tab.component.scss']
})
export class GpStoriesTabComponent implements OnInit, OnChanges {


  @Input()
  data;
  label;
  selectedTabIndex = 0;

  @Input()
  type;

  categ = this.type;

  public scrollbarOptions = { axis: 'y', theme: 'minimal-dark' };

  constructor(
    public apiServices: APIService,
    public commonServices: CommonService,
    private activatedRoute: ActivatedRoute,
    private route: Router

  ) { }

  ngOnInit() {
  }

  ngOnChanges() {
  }

  storiesBoard() {
    // localStorage.setItem('type', this.type);
    // localStorage.setItem('type1', this.selectedTabIndex.toString());
    this.route.navigate([`/p/${JSON.parse(localStorage.getItem('productAccess')).productId.toString()}/m/${JSON.parse(localStorage.getItem('productAccess')).sprintMilestoneId.toString()}/t/${this.type}/f/${this.selectedTabIndex.toString()}/detail-board`]);
  }

  onTabChanged(tab) {
    this.selectedTabIndex = tab;
  }

}
