import { Component, OnInit, ViewChild, ElementRef, OnChanges } from '@angular/core';
import { APIService } from 'src/app/services/api.service';
import { CommonService } from 'src/app/services/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';

@Component({
  selector: 'app-gp-sprint-dashboard',
  templateUrl: './gp-sprint-dashboard.component.html',
  styleUrls: ['./gp-sprint-dashboard.component.scss']
})
export class GpSprintDashboardComponent implements OnInit, OnChanges {

  sub: Subscription;
  sub1: Subscription;
  sub2: Subscription;
  sub3: Subscription;
  sub4: Subscription;
  sub5: Subscription;
  sub6: Subscription;
  selected: any;

  version = 1.0;
  progressValue = 70;
  productId: any;
  inputData: any[];
  lastInputData: any[] = [];
  refreshPage: boolean;
  selectedVersion;
  // Temp
  showContent: any;
  passData: any;
  passDataArr: any;
  versionArr: any;
  sprintsArr: any;
  stories: any;

  //  @Input() inpuFData: this.inputData;
  @ViewChild('show', { static: false }) show: ElementRef;
  queryComing: number;
  queryComingFirst: number;
  showDashboard: boolean = false;
  productList: any;
  ACL: any;
  selectedProduct: any;
  scrollDown: boolean;
  sprintUrlId: string;

  constructor(
    public apiServices: APIService,
    public commonServices: CommonService,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private route: Router) {
    // To read URL param
    this.activatedRoute.paramMap.subscribe(params => {
      this.sprintUrlId = params.get('sid');
    });

  }

  ngOnInit() {


    this.sprintData();
    // Sprint Board Data Rxjs
    this.sprintReleases();
    this.particularMilestoneMapping();
    // Rx Js for displaying story board accordingly when navigating through sprints
    this.sprintBoardWhenNavigation();

  }

  // Rx Js for displaying story board accordingly when navigating through sprints
  sprintBoardWhenNavigation() {
    this.sub1 = this.apiServices.sprintBoardOnProductChange.subscribe((data: any) => {
      this.stories = [];
      this.storiesBoard(data);
    });
  }

  // Stories Board
  storiesBoard(milestoneId) {
    if (milestoneId) {
      this.sub2 = this.apiServices.storiesBoard(milestoneId).subscribe((data: any) => {

        if (data.data.tasks || data.data.users) {
          let taskUsers = data.data.users;
          let tasksArr = data.data.tasks;
          taskUsers = taskUsers.filter((element) => {
            return element.apps.length > 0;
          });
          let tempcheck: any[] = [];
          let newArrData = tasksArr.map((ele, i) => {
            taskUsers.map((item, j) => {
              let url = "";
              let fName = "";
              let lName = "";
              let condition = item.apps.map((itm => {
                let con1 = (String(itm.accountId).indexOf(ele.assignee) !== -1);
                let con2 = (String(itm.key).indexOf(ele.assignee) !== -1);
                if (con1 || con2) {
                  url = itm.avatarURL;
                  fName = item.user.firstName;
                  lName = item.user.lastName;
                  return true;
                } else {
                  return false;
                }
              }));
              if (condition.includes(true)) {
                ele['profileImageUrl'] = url;
                ele['fName'] = fName;
                ele['lName'] = lName;
                return ele;
              }
            });
            return ele;
          });



          let planned: any;
          let storiesArr = [{ title: 'Planned', items: [] }, { title: 'New', items: [] }];
          let taskArray = [{ title: 'Planned', items: [] }, { title: 'New', items: [] }];
          let subTaskArr = [{ title: 'Planned', items: [] }, { title: 'New', items: [] }];
          let bugArr = [{ title: 'Planned', items: [] }, { title: 'New', items: [] }];
          // tslint:disable-next-line: prefer-for-of
          for (let i = 0; i < tasksArr.length; i++) {
            if (tasksArr[i].type === 'story') {
              if (tasksArr[i].isNewTask === false) {
                // tslint:disable-next-line: no-unused-expression
                storiesArr[0].items.length < 10 ? storiesArr[0].items.push(tasksArr[i]) : '';
              }
              if (tasksArr[i].isNewTask === true) {
                storiesArr[1].items.length < 10 ? storiesArr[1].items.push(tasksArr[i]) : '';
              }
            }
            if (tasksArr[i].type === 'task') {
              if (tasksArr[i].isNewTask === false) {
                taskArray[0].items.length < 10 ? taskArray[0].items.push(tasksArr[i]) : '';
              }
              if (tasksArr[i].isNewTask === true) {
                taskArray[1].items.length < 10 ? taskArray[1].items.push(tasksArr[i]) : '';
              }
            }
            if (tasksArr[i].type === 'sub-task') {
              if (tasksArr[i].isNewTask === false) {
                subTaskArr[0].items.length < 10 ? subTaskArr[0].items.push(tasksArr[i]) : '';
              }
              if (tasksArr[i].isNewTask === true) {
                subTaskArr[1].items.length < 10 ? subTaskArr[1].items.push(tasksArr[i]) : '';
              }
            }
            if (tasksArr[i].type === 'bug') {
              if (tasksArr[i].isNewTask === false) {
                bugArr[0].items.length < 10 ? bugArr[0].items.push(tasksArr[i]) : '';
              }
              if (tasksArr[i].isNewTask === true) {
                bugArr[1].items.length < 10 ? bugArr[1].items.push(tasksArr[i]) : '';
              }
            }
          }
          this.passData = {
            stories: storiesArr,
            task: taskArray,
            subTask: subTaskArr,
            bug: bugArr
          };
          this.stories = this.passData;
        } else {
          let storiesArr = [{ title: 'Planned', items: [] }, { title: 'New', items: [] }];
          let taskArray = [{ title: 'Planned', items: [] }, { title: 'New', items: [] }];
          let subTaskArr = [{ title: 'Planned', items: [] }, { title: 'New', items: [] }];
          let bugArr = [{ title: 'Planned', items: [] }, { title: 'New', items: [] }];

          this.passData = {
            stories: storiesArr,
            task: taskArray,
            subTask: subTaskArr,
            bug: bugArr
          };
          this.stories = this.passData;
        }

      });
    } else {
      this.commonServices.error('No Milestone Id', '');
    }

  }

  // sprintData(dataProductId) {
  //   if (dataProductId) {

  //     this.sub3 = this.apiServices.sprintProgressBar(dataProductId).subscribe((data: any) => {
  //       this.versionArr = [];
  //       if (data.data.releases.length === 0) {
  //         this.showDashboard = false;
  //       } else {
  //         this.showDashboard = false;
  //       }

  //       if (this.showDashboard && this.sprintUrlId) {
  //         // Product Access Local Storage
  //         localStorage.setItem(
  //           'productAccess', JSON.stringify({
  //             departmentName: JSON.parse(localStorage.getItem('productAccess')).departmentName,
  //             department: JSON.parse(localStorage.getItem('productAccess')).department,
  //             productId: JSON.parse(localStorage.getItem('productAccess')).productId,
  //             ACLaccess: JSON.parse(localStorage.getItem('productAccess')).ACLaccess,
  //             sprintMilestoneId: data.data.releases[0].sprints[0].milestone,
  //             versionId: data.data.releases[0]._id.toString(),
  //             Month: JSON.parse(localStorage.getItem('productAccess')).Month,
  //             Year: JSON.parse(localStorage.getItem('productAccess')).Year
  //           })
  //         );
  //         if (this.location.path().endsWith('/m')) {
  //           // this.route.navigate([`/p/${JSON.parse(localStorage.getItem('productAccess')).productId.toString()}/m/${JSON.parse(localStorage.getItem('productAccess')).sprintMilestoneId.toString()}/sprints`]);
  //           // setTimeout(() => {
  //           //   window.scrollTo(0, document.querySelector(".card-wrapper").scrollHeight);
  //           // }, 0);
  //         }
  //         this.versionArr = data.data.releases;
  //         this.sprintsArr = data.data.releases;
  //         this.selectedVersion = data.data.releases[0]._id.toString();
  //         this.storiesBoard(data.data.releases[0].sprints[0].milestone);
  //       } else {
  //         this.versionArr = data.data.releases;
  //         this.sprintsArr = data.data.releases;
  //         this.particularMilestoneMap(JSON.parse(localStorage.getItem('productAccess')).sprintMilestoneId);
  //       }

  //     }, (error) => {
  //       if (error.status === 403) {
  //         localStorage.clear();
  //         this.route.navigate(['/login']);
  //       }
  //     });

  //   }

  // }


  // ProgressBar Datas
  sprintReleases() {
    // RxJs subject for updating Progress bar details on product change
    this.sub4 = this.apiServices.loadReleasesAPI.subscribe((productId: any) => {
      // this.sprintData(productId);
    });
  }

  sprintData() {
    this.sub3 = this.apiServices.sprintProgressBar(JSON.parse(localStorage.getItem('productAccess')).productId.toString()).subscribe((datas: any) => {

      this.versionArr = datas.data.releases;
      this.sprintsArr = datas.data.releases;
      if (!this.route.url.includes('/r')) {
        this.particularMilestoneMap(this.sprintUrlId);
      }
      if (this.route.url.includes('/r')) {
        this.versionArr.forEach(element => {
          if (this.sprintUrlId === element._id) {
            this.selectedVersion = element._id;
            element.sprints.forEach((ele, i) => {
              this.particularMilestoneMap(ele.milestone);
              localStorage.setItem('comments', 'Sprint');
              this.route.navigate([`/p/${JSON.parse(localStorage.getItem('productAccess')).productId.toString()}/m/${ele.milestone}/s/${this.selectedVersion}/comments`]);
            });
          }
        });
      }

    });
  }

  // Particular Milestone Mapping
  particularMilestoneMap(data) {
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.versionArr.length; i++) {
      // tslint: disable - next - line: prefer -for-of
      for (let j = 0; j < this.versionArr[i].sprints.length; j++) {
        if (this.versionArr[i].sprints[j].milestone === data) {
          this.showDashboard = true;

          this.stories = [];
          this.storiesBoard(data);
          // this.apiServices.sprintBoardOnProductChange.next(data);

          if (this.showDashboard) {
            setTimeout(() => {
              window.scrollTo(0, document.querySelector(".forScrollDown").scrollHeight);
              localStorage.removeItem('scrollDown');
            }, 1500);

            // Product Access Local Storage
            localStorage.setItem(
              'productAccess', JSON.stringify({
                departmentName: JSON.parse(localStorage.getItem('productAccess')).departmentName,
                department: JSON.parse(localStorage.getItem('productAccess')).department,
                productId: JSON.parse(localStorage.getItem('productAccess')).productId,
                ACLaccess: JSON.parse(localStorage.getItem('productAccess')).ACLaccess,
                sprintMilestoneId: data,
                versionId: this.versionArr[i]._id,
                Month: JSON.parse(localStorage.getItem('productAccess')).Month,
                Year: JSON.parse(localStorage.getItem('productAccess')).Year
              })
            );
            if (this.location.path().endsWith('/m')) {
              this.route.navigate([`/p/${JSON.parse(localStorage.getItem('productAccess')).productId.toString()}/m/${JSON.parse(localStorage.getItem('productAccess')).sprintMilestoneId.toString()}/s`]);
            }
            if (this.scrollDown) {
              setTimeout(() => {
                window.scrollTo(0, document.querySelector(".forScrollDown").scrollHeight);
                this.scrollDown = false;
              }, 10);
            }


          }
          this.sprintsArr = [this.versionArr[i]];
          this.selectedVersion = this.versionArr[i]._id;
        } else {

          let storiesArr = [{ title: 'Planned', items: [] }, { title: 'New', items: [] }];
          let taskArray = [{ title: 'Planned', items: [] }, { title: 'New', items: [] }];
          let subTaskArr = [{ title: 'Planned', items: [] }, { title: 'New', items: [] }];
          let bugArr = [{ title: 'Planned', items: [] }, { title: 'New', items: [] }];

          this.passData = {
            stories: storiesArr,
            task: taskArray,
            subTask: subTaskArr,
            bug: bugArr
          };
          // // Product Access Local Storage
          // localStorage.setItem(
          //   'productAccess', JSON.stringify({
          //     departmentName: JSON.parse(localStorage.getItem('productAccess')).departmentName,
          //     department: JSON.parse(localStorage.getItem('productAccess')).department,
          //     productId: JSON.parse(localStorage.getItem('productAccess')).productId,
          //     ACLaccess: JSON.parse(localStorage.getItem('productAccess')).ACLaccess,
          //     sprintMilestoneId: '',
          //     versionId: '',
          //     Month: JSON.parse(localStorage.getItem('productAccess')).Month,
          //     Year: JSON.parse(localStorage.getItem('productAccess')).Year
          //   })
          // );
          this.stories = this.passData;
        }
      }

      // ad
    }

  }
  // RxJs subject for Particular milestone mapping
  particularMilestoneMapping() {
    this.sub = this.apiServices.navigateToSprint.subscribe((data: any) => {

      // setTimeout(() => {
      //   window.scrollTo(0, document.querySelector(".card-wrapper").scrollHeight);
      // }, 0);
      this.scrollDown = true;
      this.particularMilestoneMap(data);
    });
  }


  onVersionChange(verId) {
    this.sprintsArr = [];
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.versionArr.length; i++) {
      if (this.versionArr[i]._id === verId) {

        if (this.showDashboard) {
          // Product Access Local Storage
          localStorage.setItem(
            'productAccess', JSON.stringify({
              departmentName: JSON.parse(localStorage.getItem('productAccess')).departmentName,
              department: JSON.parse(localStorage.getItem('productAccess')).department,
              productId: JSON.parse(localStorage.getItem('productAccess')).productId,
              ACLaccess: JSON.parse(localStorage.getItem('productAccess')).ACLaccess,
              sprintMilestoneId: this.versionArr[i].sprints[0].milestone ? this.versionArr[i].sprints[0].milestone : '',
              versionId: verId,
              Month: JSON.parse(localStorage.getItem('productAccess')).Month,
              Year: JSON.parse(localStorage.getItem('productAccess')).Year
            })
          );
          // if (this.location.path() === `/p/${JSON.parse(localStorage.getItem('productAccess')).productId.toString()}/m` || this.location.path().includes('/sprints')) {
          this.route.navigate([`/p/${JSON.parse(localStorage.getItem('productAccess')).productId.toString()}/m/${JSON.parse(localStorage.getItem('productAccess')).sprintMilestoneId.toString()}/s`]);
        }
        // }

        this.sprintsArr = [this.versionArr[i]];
        this.storiesBoard(this.versionArr[i].sprints[0].milestone);
      }
    }
  }

  shows() {
    try {
      this.show.nativeElement.scrollTop = this.show.nativeElement.scrollHeight;
    } catch (err) { }
  }

  comments(versionId) {
    localStorage.setItem('comments', 'Sprint');
    this.route.navigate([`/p/${JSON.parse(localStorage.getItem('productAccess')).productId.toString()}/m/${JSON.parse(localStorage.getItem('productAccess')).sprintMilestoneId.toString()}/s/${versionId}/comments`]);
    // this.route.navigate([`/p/${JSON.parse(localStorage.getItem('productAccess')).productId.toString()}/m/${versionId}/comments`]);
  }

  ngOnChanges() {
  }

}
