import { Component, OnInit, Input, OnChanges, OnDestroy, AfterContentChecked } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-gp-sprint-launchdate',
  templateUrl: './gp-sprint-launchdate.component.html',
  styleUrls: ['./gp-sprint-launchdate.component.scss']
})
export class GpSprintLaunchdateComponent implements OnInit, OnChanges, OnDestroy {

  @Input()
  sprints;
  releaseDate: any;
  releaseMonth: any;
  remainingDays: any;
  alreadyRelease: boolean = false;
  todayRelease: boolean = false;
  showRelease: boolean = false;
  notProvided: boolean = false;

  constructor() { }

  ngOnInit() {
    this.alreadyRelease = false;
    this.todayRelease = false;
    this.showRelease = false;
    this.notProvided = false;
    this.ngOnChanges();
  }

  ngOnChanges() {
    this.alreadyRelease = false;
    this.todayRelease = false;
    this.showRelease = false;
    this.notProvided = false;
    if (this.sprints[0].releaseDate !== undefined && this.sprints[0].releaseDate !== null) {
      let re = new Date(this.sprints[0].releaseDate);
      let today = new Date();
      if (re < today) {
        this.alreadyRelease = true;
        // Due date custom Format
        const format = 'MMMM DD YYYY';
        const releasedate = moment(this.sprints[0].releaseDate).format(format);
        const final = releasedate.split(' ');
        this.releaseMonth = final[0];
        this.releaseDate = final[1];
        this.remainingDays = 'Launched';
      } else {
        this.alreadyRelease = false;
      }
      if (re === today) {
        this.todayRelease = true;
        // Due date custom Format
        const format = 'MMMM DD YYYY';
        const releasedate = moment(this.sprints[0].releaseDate).format(format);
        const final = releasedate.split(' ');
        this.releaseMonth = final[0];
        this.releaseDate = final[1];
        this.remainingDays = 'Today';
      } else {
        this.todayRelease = false;
      }
      if (re > today) {
        this.showRelease = true;
        const diff = re.getTime() - today.getTime();
        this.remainingDays = Math.round(diff / (1000 * 3600 * 24));

        // Due date custom Format
        const format = 'MMMM DD YYYY';
        const releasedate = moment(this.sprints[0].releaseDate).format(format);
        const final = releasedate.split(' ');
        this.releaseMonth = final[0];
        this.releaseDate = final[1];

      } else {
        this.showRelease = false;
      }
    }

    if (this.sprints[0].releaseDate === undefined || this.sprints[0].releaseDate === null) {
      this.notProvided = true;
    } else {
      this.notProvided = false;
    }
  }

  ngOnDestroy() {
  }
}
