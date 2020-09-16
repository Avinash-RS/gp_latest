import { Component, OnInit, OnChanges, AfterViewInit } from '@angular/core';
import { APIService } from 'src/app/services/api.service';
import { CommonService } from 'src/app/services/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { IModalInfo } from 'src/app/Interface/model';
import { ModalInfoWithbuttonComponent } from 'src/app/shared/modal-info-withbutton/modal-info-withbutton.component';
import { MatDialog } from '@angular/material';
@Component({
  selector: 'app-gp-sprint-detail-board',
  templateUrl: './gp-sprint-detail-board.component.html',
  styleUrls: ['./gp-sprint-detail-board.component.scss']
})
export class GpSprintDetailBoardComponent implements OnInit, AfterViewInit {

  selected = ['0'];
  versionArr: any;
  sprintsArr: any[];
  selectedSprint: any;
  selectedType: any;
  sprintStartDate: any;
  sprintEndDate: any;
  types: any;
  storiesArray: any;
  showStories: boolean;
  toDo: any;
  inProgress: any;
  completed: any;
  showErrorText: any;
  showToDoErrorText: any;
  showInProgressErrorText: any;
  showCompletedErrorText: any;
  wholeTasks: any;
  currentStoryId: any;
  allStory0TasksDone: any;
  allStory0TasksInProgress: any;
  allStory0TasksToDo: any;
  allStory1TasksDone: any;
  allStory1TasksInProgress: any;
  allStory1TasksToDo: any;
  allStoryTasksDone: any;
  allStoryTasksInProgress: any;
  allStoryTasksToDo: any;
  selectedIndex: any = null;
  showFutureSprint: boolean;
  public scrollbarOptions = { axis: 'yx', theme: 'minimal-dark' };
  activeAll = true;
  assigneeList: any[] = [];
  noMilestoneShow: any;
  routeType: any;
  routeFilterType: string;
  routeSprintMilestoneId: string;
  routeProductId: string;


  constructor(
    public apiServices: APIService,
    public commonServices: CommonService,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    private route: Router
  ) {
    this.activatedRoute.paramMap.subscribe(params => {
      this.routeType = params.get('tid');
      this.routeFilterType = params.get('fid');
      this.routeSprintMilestoneId = params.get('sid');
      this.routeProductId = params.get('pid');
    });
    this.SelType();
  }

  ngOnInit() {
    this.types = [
      { name: 'All', id: '2' },
      { name: 'New', id: '1' },
      { name: 'Planned', id: '0' }
    ];

    this.DetailedBoardData();
  }

  ngAfterViewInit() {

  }

  // ProgressBar Datas
  DetailedBoardData() {
    // RxJs subject for updating Progress bar details on product change
    this.apiServices.sprintProgressBar(this.routeProductId).subscribe((data: any) => {
      if (data.data.releases.length === 0) {
        this.noMilestoneShow = 'true';
      } else {
        this.noMilestoneShow = 'false';
      }
      this.versionArr = data.data.releases;
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < this.versionArr.length; i++) {
        // tslint:disable-next-line: prefer-for-of
        for (let j = 0; j < this.versionArr[i].sprints.length; j++) {
          if (this.versionArr[i].sprints[j].milestone === this.routeSprintMilestoneId) {
            this.sprintsArr = this.versionArr[i].sprints;
            this.selectedSprint = this.versionArr[i].sprints[j].milestone;
            this.sprintStartDate = this.versionArr[i].sprints[j].startDate;
            this.sprintEndDate = this.versionArr[i].sprints[j].endDate;

            // Product Access Local Storage
            localStorage.setItem(
              'productAccess', JSON.stringify({
                departmentName: JSON.parse(localStorage.getItem('productAccess')).departmentName,
                department: JSON.parse(localStorage.getItem('productAccess')).department,
                productId: JSON.parse(localStorage.getItem('productAccess')).productId,
                ACLaccess: JSON.parse(localStorage.getItem('productAccess')).ACLaccess,
                sprintMilestoneId: this.routeSprintMilestoneId,
                versionId: this.versionArr[i]._id,
                Month: JSON.parse(localStorage.getItem('productAccess')).Month,
                Year: JSON.parse(localStorage.getItem('productAccess')).Year
              })
            );
            // Due date custom Format
            const format = 'DD MMM';
            const startdate = moment(this.sprintStartDate).format(format);
            this.sprintStartDate = startdate;
            const enddate = moment(this.sprintEndDate).format(format);
            this.sprintEndDate = enddate;
            if (this.sprintStartDate === 'Invalid date' && this.sprintEndDate === 'Invalid date') {
              this.showFutureSprint = true;
            } else {
              this.showFutureSprint = false;
            }

            this.storiesBoard(this.selectedSprint);


          } else {
          }
        }
      }
    });
  }

  SelType() {
    if (this.routeType !== 'story') {
      this.showStories = false;
    } else {
      this.showStories = true;
    }
    this.selectedType = this.routeFilterType;
  }

  onSprintChange(sprintMilestoneId) {
    this.selectedIndex = 'AllStories';
    this.activeAll = true;
    this.currentStoryId = undefined;
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.sprintsArr.length; i++) {
      if (this.sprintsArr[i].milestone === sprintMilestoneId) {
        this.selectedSprint = this.sprintsArr[i].milestone;
        this.sprintStartDate = this.sprintsArr[i].startDate;
        this.sprintEndDate = this.sprintsArr[i].endDate;

        // Due date custom Format
        const format = 'DD MMM';
        const startdate = moment(this.sprintStartDate).format(format);
        this.sprintStartDate = startdate;
        const enddate = moment(this.sprintEndDate).format(format);
        this.sprintEndDate = enddate;
        if (this.sprintStartDate === 'Invalid date' && this.sprintEndDate === 'Invalid date') {
          this.showFutureSprint = true;
        } else {
          this.showFutureSprint = false;
        }
        // Product Access Local Storage
        localStorage.setItem(
          'productAccess', JSON.stringify({
            departmentName: JSON.parse(localStorage.getItem('productAccess')).departmentName,
            department: JSON.parse(localStorage.getItem('productAccess')).department,
            productId: JSON.parse(localStorage.getItem('productAccess')).productId,
            ACLaccess: JSON.parse(localStorage.getItem('productAccess')).ACLaccess,
            sprintMilestoneId,
            versionId: JSON.parse(localStorage.getItem('productAccess')).versionId,
            Month: JSON.parse(localStorage.getItem('productAccess')).Month,
            Year: JSON.parse(localStorage.getItem('productAccess')).Year
          })
        );
        this.route.navigate([`/p/${JSON.parse(localStorage.getItem('productAccess')).productId.toString()}/m/${JSON.parse(localStorage.getItem('productAccess')).sprintMilestoneId.toString()}/t/${this.routeType}/f/${this.routeFilterType}/detail-board`]);

        this.storiesBoard(this.selectedSprint);
      }
    }
  }

  onTypeChange(type1) {
    if (this.routeType === 'story') {
      if (this.currentStoryId === undefined) {
        this.selectedType = type1;
        // this.storiesBoard(this.selectedSprint);
        this.wholeTasksMethod();
      } else {
        this.selectedType = type1;
        this.particularStoryTasks(this.currentStoryId);
      }
    } else {
      this.selectedType = type1;
      // this.storiesBoard(this.selectedSprint);
      this.wholeTasksMethod();
    }
  }

  // particularStoryTasks
  particularStoryTasks(findParentId) {
    this.activeAll = false;
    this.selectedIndex = findParentId;
    if (findParentId === 'AllStories') {
      this.activeAll = true;
      // For Task Array
      // if (this.selectedType === '0') {
      //   this.toDo = this.allStory0TasksToDo;
      //   this.inProgress = this.allStory0TasksInProgress;
      //   this.completed = this.allStory0TasksDone;
      // }
      // if (this.selectedType === '1') {
      //   this.toDo = this.allStory1TasksToDo;
      //   this.inProgress = this.allStory1TasksInProgress;
      //   this.completed = this.allStory1TasksDone;
      // }
      // if (this.selectedType === '2') {
      //   this.toDo = this.allStoryTasksToDo;
      //   this.inProgress = this.allStoryTasksInProgress;
      //   this.completed = this.allStoryTasksDone;
      // }
      this.currentStoryId = undefined;
      // this.storiesBoard(this.selectedSprint);
      this.wholeTasksMethod();
    } else {
      this.currentStoryId = findParentId;
      const allParentArr: any = [];
      const tasksArr = this.wholeTasks;
      const particularStoryTasksArr: any = [];
      const subTaskPlannedArr: any = { 'subTaskToDo': [], 'subTaskInProgress': [], 'subTaskDone': [] };
      const subTaskNewArr: any = { 'subTaskToDo': [], 'subTaskInProgress': [], 'subTaskDone': [] };
      const subTaskAllArr: any = { 'subTaskToDo': [], 'subTaskInProgress': [], 'subTaskDone': [] };

      for (let i = 0; i < tasksArr.length; i++) {
        if (tasksArr[i].parent !== null && tasksArr[i].parent !== '') {
          allParentArr.push(tasksArr[i]);
        }
      }

      for (let i = 0; i < allParentArr.length; i++) {
        if (allParentArr[i].parent === findParentId) {
          particularStoryTasksArr.push(allParentArr[i]);
        }
      }

      for (let i = 0; i < particularStoryTasksArr.length; i++) {
        // For Stories Dependency Filter

        if (particularStoryTasksArr[i].type === 'subtask' || particularStoryTasksArr[i].type === 'task' || particularStoryTasksArr[i].type === 'bug') {
          if (particularStoryTasksArr[i].status === 'to-do') {
            subTaskAllArr.subTaskToDo.push(particularStoryTasksArr[i]);
          }
          if (particularStoryTasksArr[i].status === 'in-progress') {
            subTaskAllArr.subTaskInProgress.push(particularStoryTasksArr[i]);
          }
          if (particularStoryTasksArr[i].status === 'done') {
            subTaskAllArr.subTaskDone.push(particularStoryTasksArr[i]);
          }
          if (particularStoryTasksArr[i].status === 'qa-verified') {
            subTaskAllArr.subTaskDone.push(particularStoryTasksArr[i]);
          }
          if (particularStoryTasksArr[i].isNewTask === false) {
            if (particularStoryTasksArr[i].status === 'to-do') {
              subTaskPlannedArr.subTaskToDo.push(particularStoryTasksArr[i]);
            }
            if (particularStoryTasksArr[i].status === 'in-progress') {
              subTaskPlannedArr.subTaskInProgress.push(particularStoryTasksArr[i]);
            }
            if (particularStoryTasksArr[i].status === 'done') {
              subTaskPlannedArr.subTaskDone.push(particularStoryTasksArr[i]);
            }
            if (particularStoryTasksArr[i].status === 'qa-verified') {
              subTaskPlannedArr.subTaskDone.push(particularStoryTasksArr[i]);
            }

          }
          if (particularStoryTasksArr[i].isNewTask === true) {
            if (particularStoryTasksArr[i].status === 'to-do') {
              subTaskNewArr.subTaskToDo.push(particularStoryTasksArr[i]);
            }
            if (particularStoryTasksArr[i].status === 'in-progress') {
              subTaskNewArr.subTaskInProgress.push(particularStoryTasksArr[i]);
            }
            if (particularStoryTasksArr[i].status === 'done') {
              subTaskNewArr.subTaskDone.push(particularStoryTasksArr[i]);
            }
            if (particularStoryTasksArr[i].status === 'qa-verified') {
              subTaskNewArr.subTaskDone.push(particularStoryTasksArr[i]);
            }
          }
        }

      }
      // To Know which type we are in
      if (this.routeType === 'story') {
        // For Task Array
        if (this.selectedType === '0') {
          this.toDo = subTaskPlannedArr.subTaskToDo;
          this.inProgress = subTaskPlannedArr.subTaskInProgress;
          this.completed = subTaskPlannedArr.subTaskDone;
        }
        if (this.selectedType === '1') {
          this.toDo = subTaskNewArr.subTaskToDo;
          this.inProgress = subTaskNewArr.subTaskInProgress;
          this.completed = subTaskNewArr.subTaskDone;
        }
        if (this.selectedType === '2') {
          this.toDo = subTaskAllArr.subTaskToDo;
          this.inProgress = subTaskAllArr.subTaskInProgress;
          this.completed = subTaskAllArr.subTaskDone;
        }
      }

      if (this.toDo.length === 0) {
        this.showToDoErrorText = true;
      } else {
        this.showToDoErrorText = false;
      }
      if (this.inProgress.length === 0) {
        this.showInProgressErrorText = true;
      } else {
        this.showInProgressErrorText = false;
      }
      if (this.completed.length === 0) {
        this.showCompletedErrorText = true;
      } else {
        this.showCompletedErrorText = false;
      }

    }
  }
  // Stories Board
  storiesBoard(milestoneId) {
    this.apiServices.storiesBoard(milestoneId).subscribe((data: any) => {

      // Assignee Check Start
      if (data.data.tasks || data.data.users) {

        let taskUsers = data.data.users;
        let tasksArr = data.data.tasks;
        taskUsers = taskUsers.filter((element) => {
          return element.apps.length > 0;
        });
        let tempcheck: any[] = [];

        taskUsers.forEach((element) => {
          element.apps.forEach(ele => {
            if (ele.avatarURL) {
              tempcheck.push(ele);
            }
          });
        });
        this.assigneeList = tempcheck;

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


        // Assignee Check end
        this.wholeTasks = tasksArr;
        this.wholeTasksMethod();



      } else {
        this.toDo = [];
        this.inProgress = [];
        this.completed = [];
        this.storiesArray = [];
        if (this.toDo.length === 0) {
          this.showToDoErrorText = true;
        } else {
          this.showToDoErrorText = false;
        }
        if (this.inProgress.length === 0) {
          this.showInProgressErrorText = true;
        } else {
          this.showInProgressErrorText = false;
        }
        if (this.completed.length === 0) {
          this.showCompletedErrorText = true;
        } else {
          this.showCompletedErrorText = false;
        }
      }
    });
  }

  wholeTasksMethod() {
    // const tasksArr = data.data.tasks;
    // this.wholeTasks = tasksArr;
    const tasksArr = this.wholeTasks;
    const storiesPlannedArr: any = [];
    const storiesNewArr: any = [];
    const storiesAllArr: any = [];

    const taskPlannedArr: any = { 'taskToDo': [], 'taskInProgress': [], 'taskDone': [] };
    const taskNewArr: any = { 'taskToDo': [], 'taskInProgress': [], 'taskDone': [] };
    const taskAllArr: any = { 'taskToDo': [], 'taskInProgress': [], 'taskDone': [] };

    // tslint:disable-next-line: object-literal-key-quotes
    const bugPlannedArr: any = { 'bugToDo': [], 'bugInProgress': [], 'bugDone': [] };
    const bugNewArr: any = { 'bugToDo': [], 'bugInProgress': [], 'bugDone': [] };
    const bugAllArr: any = { 'bugToDo': [], 'bugInProgress': [], 'bugDone': [] };

    const subTaskPlannedArr: any = { 'subTaskToDo': [], 'subTaskInProgress': [], 'subTaskDone': [] };
    const subTaskNewArr: any = { 'subTaskToDo': [], 'subTaskInProgress': [], 'subTaskDone': [] };
    const subTaskAllArr: any = { 'subTaskToDo': [], 'subTaskInProgress': [], 'subTaskDone': [] };
    const allParentArr: any = [];

    for (let i = 0; i < tasksArr.length; i++) {
      if (tasksArr[i].parent !== null && tasksArr[i].parent !== '') {
        allParentArr.push(tasksArr[i]);
      }
    }
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < tasksArr.length; i++) {

      // For All stories Filter
      // Planned Stories
      // if (tasksArr[i].type === 'story' && localStorage.getItem('type1') === '0') {
      if (tasksArr[i].type === 'story') {
        storiesAllArr.push(tasksArr[i]);
        if (tasksArr[i].isNewTask === false) {
          storiesPlannedArr.push(tasksArr[i]);
        }
        if (tasksArr[i].isNewTask === true) {
          storiesNewArr.push(tasksArr[i]);
        }
      }
      // }

      // // New Stories
      // if (tasksArr[i].type === 'story' && localStorage.getItem('type1') === '1') {
      //   if (tasksArr[i].type === 'story' && tasksArr[i].isNewTask === true) {
      //     storiesAllArr.push(tasksArr[i]);
      //     if (tasksArr[i].isNewTask === false) {
      //       storiesPlannedArr.push(tasksArr[i]);
      //     }
      //     if (tasksArr[i].isNewTask === true) {
      //       storiesNewArr.push(tasksArr[i]);
      //     }
      //   }
      // }


      // For Stories Dependency Filter

      if (tasksArr[i].parent) {

        if (tasksArr[i].type === 'subtask' || tasksArr[i].type === 'task' || tasksArr[i].type === 'bug') {
          if (tasksArr[i].status === 'to-do') {
            subTaskAllArr.subTaskToDo.push(tasksArr[i]);
          }
          if (tasksArr[i].status === 'in-progress') {
            subTaskAllArr.subTaskInProgress.push(tasksArr[i]);
          }
          if (tasksArr[i].status === 'done') {
            subTaskAllArr.subTaskDone.push(tasksArr[i]);
          }
          if (tasksArr[i].status === 'qa-verified') {
            subTaskAllArr.subTaskDone.push(tasksArr[i]);
          }
          if (tasksArr[i].isNewTask === false) {
            if (tasksArr[i].status === 'to-do') {
              subTaskPlannedArr.subTaskToDo.push(tasksArr[i]);
            }
            if (tasksArr[i].status === 'in-progress') {
              subTaskPlannedArr.subTaskInProgress.push(tasksArr[i]);
            }
            if (tasksArr[i].status === 'done') {
              subTaskPlannedArr.subTaskDone.push(tasksArr[i]);
            }
            if (tasksArr[i].status === 'qa-verified') {
              subTaskPlannedArr.subTaskDone.push(tasksArr[i]);
            }

          }
          if (tasksArr[i].isNewTask === true) {
            if (tasksArr[i].status === 'to-do') {
              subTaskNewArr.subTaskToDo.push(tasksArr[i]);
            }
            if (tasksArr[i].status === 'in-progress') {
              subTaskNewArr.subTaskInProgress.push(tasksArr[i]);
            }
            if (tasksArr[i].status === 'done') {
              subTaskNewArr.subTaskDone.push(tasksArr[i]);
            }
            if (tasksArr[i].status === 'qa-verified') {
              subTaskNewArr.subTaskDone.push(tasksArr[i]);
            }

          }
        }
      }

      // For bug Filter

      if (tasksArr[i].type === 'bug') {
        if (tasksArr[i].status === 'to-do') {
          bugAllArr.bugToDo.push(tasksArr[i]);
        }
        if (tasksArr[i].status === 'in-progress') {
          bugAllArr.bugInProgress.push(tasksArr[i]);
        }
        if (tasksArr[i].status === 'done') {
          bugAllArr.bugDone.push(tasksArr[i]);
        }
        if (tasksArr[i].status === 'qa-verified') {
          bugAllArr.bugDone.push(tasksArr[i]);
        }

        if (tasksArr[i].isNewTask === false) {
          if (tasksArr[i].status === 'to-do') {
            bugPlannedArr.bugToDo.push(tasksArr[i]);
          }
          if (tasksArr[i].status === 'in-progress') {
            bugPlannedArr.bugInProgress.push(tasksArr[i]);
          }
          if (tasksArr[i].status === 'done') {
            bugPlannedArr.bugDone.push(tasksArr[i]);
          }
          if (tasksArr[i].status === 'qa-verified') {
            bugPlannedArr.bugDone.push(tasksArr[i]);
          }
        }
        if (tasksArr[i].isNewTask === true) {
          if (tasksArr[i].status === 'to-do') {
            bugNewArr.bugToDo.push(tasksArr[i]);
          }
          if (tasksArr[i].status === 'in-progress') {
            bugNewArr.bugInProgress.push(tasksArr[i]);
          }
          if (tasksArr[i].status === 'done') {
            bugNewArr.bugDone.push(tasksArr[i]);
          }
          if (tasksArr[i].status === 'qa-verified') {
            bugNewArr.bugDone.push(tasksArr[i]);
          }
        }
      }

      // For Task Filter
      if (tasksArr[i].type === 'task') {
        if (tasksArr[i].status === 'to-do') {
          taskAllArr.taskToDo.push(tasksArr[i]);
        }
        if (tasksArr[i].status === 'in-progress') {
          taskAllArr.taskInProgress.push(tasksArr[i]);
        }
        if (tasksArr[i].status === 'done') {
          taskAllArr.taskDone.push(tasksArr[i]);
        }
        if (tasksArr[i].status === 'qa-verified') {
          taskAllArr.taskDone.push(tasksArr[i]);
        }
        if (tasksArr[i].isNewTask === false) {
          if (tasksArr[i].status === 'to-do') {
            taskPlannedArr.taskToDo.push(tasksArr[i]);
          }
          if (tasksArr[i].status === 'in-progress') {
            taskPlannedArr.taskInProgress.push(tasksArr[i]);
          }
          if (tasksArr[i].status === 'done') {
            taskPlannedArr.taskDone.push(tasksArr[i]);
          }
          if (tasksArr[i].status === 'qa-verified') {
            taskPlannedArr.taskDone.push(tasksArr[i]);
          }

        }
        if (tasksArr[i].isNewTask === true) {
          if (tasksArr[i].status === 'to-do') {
            taskNewArr.taskToDo.push(tasksArr[i]);
          }
          if (tasksArr[i].status === 'in-progress') {
            taskNewArr.taskInProgress.push(tasksArr[i]);
          }
          if (tasksArr[i].status === 'done') {
            taskNewArr.taskDone.push(tasksArr[i]);
          }
          if (tasksArr[i].status === 'qa-verified') {
            taskNewArr.taskDone.push(tasksArr[i]);
          }

        }
      }
    }

    // To Know which type we are in
    if (this.routeType === 'story') {
      // For Task Array
      if (this.selectedType === '0') {
        this.toDo = subTaskPlannedArr.subTaskToDo;
        this.inProgress = subTaskPlannedArr.subTaskInProgress;
        this.completed = subTaskPlannedArr.subTaskDone;
        this.allStory0TasksToDo = subTaskPlannedArr.subTaskToDo;
        this.allStory0TasksInProgress = subTaskPlannedArr.subTaskInProgress;
        this.allStory0TasksDone = subTaskPlannedArr.subTaskDone;
      }
      if (this.selectedType === '1') {
        this.toDo = subTaskNewArr.subTaskToDo;
        this.inProgress = subTaskNewArr.subTaskInProgress;
        this.completed = subTaskNewArr.subTaskDone;
        this.allStory1TasksToDo = subTaskNewArr.subTaskToDo;
        this.allStory1TasksInProgress = subTaskNewArr.subTaskInProgress;
        this.allStory1TasksDone = subTaskNewArr.subTaskDone;
      }
      if (this.selectedType === '2') {
        this.toDo = subTaskAllArr.subTaskToDo;
        this.inProgress = subTaskAllArr.subTaskInProgress;
        this.completed = subTaskAllArr.subTaskDone;
        this.allStoryTasksToDo = subTaskAllArr.subTaskToDo;
        this.allStoryTasksInProgress = subTaskAllArr.subTaskInProgress;
        this.allStoryTasksDone = subTaskAllArr.subTaskDone;
      }
    }

    // To Know which type we are in
    if (this.routeType === 'story') {
      // For stories Array
      if (this.selectedType === '0') {
        this.storiesArray = storiesAllArr;
      }
      if (this.selectedType === '1') {
        this.storiesArray = storiesAllArr;
      }
      if (this.selectedType === '2') {
        this.storiesArray = storiesAllArr;
      }
    }

    // To Know which type we are in
    if (this.routeType === 'task') {
      // For Task Array
      if (this.selectedType === '0') {
        this.toDo = taskPlannedArr.taskToDo;
        this.inProgress = taskPlannedArr.taskInProgress;
        this.completed = taskPlannedArr.taskDone;
      }
      if (this.selectedType === '1') {
        this.toDo = taskNewArr.taskToDo;
        this.inProgress = taskNewArr.taskInProgress;
        this.completed = taskNewArr.taskDone;
      }
      if (this.selectedType === '2') {
        this.toDo = taskAllArr.taskToDo;
        this.inProgress = taskAllArr.taskInProgress;
        this.completed = taskAllArr.taskDone;
      }
    }

    // To Know which type we are in
    if (this.routeType === 'bugs') {
      // For Bug Array
      if (this.selectedType === '0') {
        this.toDo = bugPlannedArr.bugToDo;
        this.inProgress = bugPlannedArr.bugInProgress;
        this.completed = bugPlannedArr.bugDone;
      }
      if (this.selectedType === '1') {
        this.toDo = bugNewArr.bugToDo;
        this.inProgress = bugNewArr.bugInProgress;
        this.completed = bugNewArr.bugDone;
      }
      if (this.selectedType === '2') {
        this.toDo = bugAllArr.bugToDo;
        this.inProgress = bugAllArr.bugInProgress;
        this.completed = bugAllArr.bugDone;
      }
    }
    if (this.toDo.length === 0) {
      this.showToDoErrorText = true;
    } else {
      this.showToDoErrorText = false;
    }
    if (this.inProgress.length === 0) {
      this.showInProgressErrorText = true;
    } else {
      this.showInProgressErrorText = false;
    }
    if (this.completed.length === 0) {
      this.showCompletedErrorText = true;
    } else {
      this.showCompletedErrorText = false;
    }
  }

  backToDashboard() {
    this.route.navigate([`/p/${JSON.parse(localStorage.getItem('productAccess')).productId.toString()}/m/${JSON.parse(localStorage.getItem('productAccess')).sprintMilestoneId.toString()}/s`]);
  }

}
