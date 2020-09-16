import { Component, OnInit, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-gp-sprint-stories-board',
  templateUrl: './gp-sprint-stories-board.component.html',
  styleUrls: ['./gp-sprint-stories-board.component.scss']
})
export class GpSprintStoriesBoardComponent implements OnInit, OnChanges {

  tabChange = true;

  @Input()
  stories;
  storiesData: any;
  tasks: any;
  subTasks: any;
  bugs: any;

  @Input()
  type;


  constructor() { }

  ngOnInit() {
  }
  ngOnChanges() {
    if (this.stories) {
    this.storiesData = this.stories.stories;
    this.tasks = this.stories.task;
    this.subTasks = this.stories.subTask;
    this.bugs = this.stories.bug;
    }
  }

  toggleTab() {
    this.tasks = this.stories.task;
    this.tabChange = !this.tabChange;
  }

}
