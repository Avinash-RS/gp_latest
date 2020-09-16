import {
  Component, OnInit, ViewChild, ElementRef, Pipe,
  PipeTransform,
  AfterViewInit,
} from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { APIService } from 'src/app/services/api.service';
import { CommonService } from 'src/app/services/common.service';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { MatChipInputEvent, MatAutocompleteSelectedEvent } from '@angular/material';
import * as moment from 'moment';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { environment } from 'src/environments/environment';

export interface Linkarr {
  linking: any;
}

@Pipe({ name: 'ellipsis' })

export class EllipsisPipe implements PipeTransform {

  transform(lines: any): string {
    let list: string = '';
    // lines = lines.split(',');


    if (lines.length > 16) {
      list = lines.slice(0, 16) + '...';
    } else {
      list = lines;
    }
    return list;
  }
}

@Pipe({ name: 'date' })

export class datePipe implements PipeTransform {

  transform(lines: any): any {

    // Due date custom Format
    const format = 'DD MMM YYYY';
    const enddate = moment(lines).format(format);
    lines = enddate;
    return lines;
  }
}



@Component({
  selector: 'app-gp-add-tasks',
  templateUrl: './gp-add-tasks.component.html',
  styleUrls: ['./gp-add-tasks.component.scss']
})

export class GpAddTasksComponent implements OnInit, AfterViewInit {

  BASE_IMAGE_URL = environment.Image_Base_Url;


  assignedsTo: any[] = [];

  name = 'Angular 6';
  htmlContent = '';
  editContent = '';

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: 'auto',
    minHeight: '100px',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Enter text here...',
    defaultParagraphSeparator: '',
    defaultFontName: 'Montserrat',
    defaultFontSize: '2',
    fonts: [
      { class: 'montserrat', name: 'Montserrat' },
    ],
    uploadUrl: 'v1/image',
    sanitize: true,
    toolbarPosition: 'bottom',
    toolbarHiddenButtons: [
      ['bold', 'italic', 'underline', 'strikeThrough', 'superscript',
        'subscript', 'heading', 'fonts', 'insertImage', 'insertVideo',
        'insertHorizontalRule', 'remove', 'toggleEditorMode', 'indent', 'outdent', 'justifyRight', 'justifyFull', 'link', 'unlink',
        'ClearFormatting', 'backgroundColor', 'fontName', 'fontSize', 'removeFormat']
    ],
  };

  buttonText: any;
  milestoneId: any;
  editControls: boolean;
  editMilestoneData: any;
  showEngineeringFields = false;
  addTaskForm: FormGroup;
  productListArr: any;
  // selectedTeam;
  selectedTeam = JSON.parse(localStorage.getItem('productAccess')).department ? JSON.parse(localStorage.getItem('productAccess')).department : '';
  selectedTeamName = JSON.parse(localStorage.getItem('productAccess')).departmentName ? JSON.parse(localStorage.getItem('productAccess')).departmentName : '';
  selectedTeamACL = JSON.parse(localStorage.getItem('productAccess')).departmentName ? JSON.parse(localStorage.getItem('productAccess')).departmentName : '';
  selectedVersion;
  selectedSprint;
  myControl = new FormControl();

  userList: any;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = false;
  separatorKeysCodes = [ENTER, COMMA];

  fruitCtrl = new FormControl();
  statusCtrl = new FormControl();
  dependencyCtrl = new FormControl();

  filteredFruits: Observable<any[]>;
  fruits = [];

  allFruits = [];

  @ViewChild('fruitInput', { static: true }) fruitInput: ElementRef;
  dateValidation: string;
  sprints: any;
  versions: any;
  JiraStartDate: any;
  showJiraStartDate: boolean;
  JiraEndDate: any;
  showJiraEndDate: boolean;
  showEditPage: boolean;
  displayName: any;
  startDate: any;
  endDate: any;
  description: any;
  links: any;
  linkarr: Linkarr[];
  showAddTask: boolean;
  AssigneeText;
  showRemoveIcon: boolean;
  MilestoneDependencies: any[] = [];
  dependencyArray: any[] = [];
  dependencyShowArray: any[] = [];
  staticMilestoneDependencies: any[];
  dependencyInput;
  showEmpty: boolean;
  assigneeInput;
  showEmptyAssignee: boolean;
  allAccessUserFirstProduct: any;
  status: any;
  statuss: { name: string; status: string; }[];
  forRemoveDependencies: any[];
  constructor(
    private fb: FormBuilder,
    private route: Router,
    private apiServices: APIService,
    private activatedRoute: ActivatedRoute,
    private commonServices: CommonService
  ) {
    this.selectedTeam = this.selectedTeamName === 'All' ? '' : this.selectedTeam;
    // Get Users
    this.statusCodes();
    this.getUsers();
    // To read URL param
    this.activatedRoute.paramMap.subscribe(params => {
      this.milestoneId = params.get('mid');
      if (this.milestoneId !== null) {
        this.getMilestone();
        this.editControls = true;
        this.buttonText = 'UPDATE';
        this.showEditPage = true;
      } else {
        this.showEditPage = true;
        this.editControls = false;
        this.buttonText = 'ADD TASK';
      }
    });
  }

  ngOnInit() {

    // To get all products
    this.getDepartment();


    // Get Sprints and Versions
    this.getSprintVersion();

    // Login Form Controls
    // this.teamSelection(this.selectedTeam);

    // Dependecy start
    const dependecies = JSON.parse(localStorage.getItem('forDependecy')).data.milestones;
    let map = dependecies.map((ele) => {
      return ele.map((element) => {
        this.MilestoneDependencies.push(element);
      });
    });
    this.forRemoveDependencies = this.MilestoneDependencies.filter((data: any) => data._id !== this.milestoneId);

    this.MilestoneDependencies = this.MilestoneDependencies.filter((data: any) => data._id !== this.milestoneId);
    this.staticMilestoneDependencies = this.MilestoneDependencies;

    if (this.MilestoneDependencies.length === 0) {
      this.showEmpty = true;
    } else {
      this.showEmpty = false;
    }
    // Dependecy end
  }

  tooltipName(arr: any[]) {
    arr = arr.filter((item, i) => i !== 0);
    return arr.map((item) => item.firstName + ' ' + item.lastName).toString();
  }


  clickedAssignee(val) {
    // const a = document.getElementById("assign");
    // a.className = a.className.replace(/\b show\b/g, "");
    // document.getElementById("assignInput").removeAttribute("data-toggle");

    const user = this.userList.filter((ele) => ele._id === val);
    this.assignedsTo.push(user[0]);

    this.allFruits = this.allFruits.filter((data: any) => data._id !== val);
    this.userList = this.userList.filter((data: any) => data._id !== val);
  }
  search(event) {
    let val = [];
    // this.allFruits = this.userList;
    this.userList.forEach(ele => {
      if (ele.firstName.toLowerCase().startsWith(event.target.value.toLowerCase())) {
        val.push(ele);
      }
    });
    if (val.length === 0) {
      this.showEmptyAssignee = true;
    } else {
      this.showEmptyAssignee = false;
    }

    this.allFruits = val;
    if (val.length === 0) {
      // this.allFruits = this.userList;
    }
  }
  removeAssignee(i, val) {
    // tslint:disable-next-line: deprecation
    event.stopPropagation();
    // const filter = this.assignedsTo.filter((item) => item._id !== i);
    this.userList.push(val);
    this.allFruits.push(val);
    const filter = this.assignedsTo.splice(i, 1);
  }

  AssigneeDropdown() {
    document.getElementById("assignInput").setAttribute("data-toggle", "dropdown");
    document.getElementById("assignInput").focus();
  }

  // Dependency
  clickedDependency(val) {
    if (this.editControls) {
      val.assignedTos = val.assignedTo;
    }

    this.dependencyShowArray.push(val);
    this.dependencyArray.push(val._id);
    this.MilestoneDependencies = this.MilestoneDependencies.filter((data: any) => data ? data._id !== val._id : '');
    this.staticMilestoneDependencies = this.staticMilestoneDependencies.filter((data: any) => data ? data._id !== val._id : '');


    this.dependencyInput = '';
    const a = document.getElementById("depe");
    a.className = a.className.replace(/\b show\b/g, "");
    document.getElementById("drop").removeAttribute("data-toggle");
  }
  searchDependency(event) {
    if (event.keyCode === 27) {
      const a = document.getElementById("depe");
      a.className = a.className.replace(/\b show\b/g, "");
    }

    if (event.target.value.length === 1) {
      if (!document.getElementById("drop").hasAttribute("data-toggle")) {
        document.getElementById("drop").setAttribute("data-toggle", "dropdown");
        document.getElementById('drop').click();
      }
    }
    if (event.target.value.length === 0) {
      if (!document.getElementById("drop").hasAttribute("data-toggle")) {
        document.getElementById("drop").setAttribute("data-toggle", "dropdown");
        document.getElementById('drop').click();
      }
    }


    let val = [];

    // this.allFruits = this.MilestoneDependencies;
    this.staticMilestoneDependencies.forEach(ele => {
      if (ele && (ele.displayName.toLowerCase().startsWith(event.target.value.toLowerCase()) || ele.department.displayName.toLowerCase().startsWith(event.target.value.toLowerCase()))) {
        val.push(ele);
      }
    });
    if (val.length === 0) {
      this.showEmpty = true;
    } else {
      this.showEmpty = false;
    }
    this.MilestoneDependencies = val;
    if (val.length === 0) {
      // this.allFruits = this.userList;
    }
  }
  removeDependency(i, val) {
    // tslint:disable-next-line: deprecation
    event.stopPropagation();
    // let a = document.getElementById("depe");
    // a.className = a.className.replace(/\bshow\b/g, "");
    // document.getElementById("drop").removeAttribute("data-toggle");
    // const filter = this.assignedsTo.filter((item) => item._id !== i);

    if (this.editControls) {
      const hi = this.forRemoveDependencies.filter((data: any) => data._id === val._id);
      this.MilestoneDependencies.push(hi[0]);
      this.staticMilestoneDependencies.push(val[0]);
      const filter = this.dependencyShowArray.splice(i, 1);
    } else {
      this.MilestoneDependencies.push(val);
      this.staticMilestoneDependencies.push(val);
      const filter = this.dependencyShowArray.splice(i, 1);

    }

  }


  // create item field values
  get linkPoint() {
    return this.addTaskForm.get('linkarr') as FormArray;
  }
  createItem() {
    return this.fb.group({ name: null, url: null });
  }

  // // form fields
  // get f() { return this.addTaskForm.controls; }

  // Adding to the FormArray
  addItem(): void {
    this.linkPoint.push(this.createItem());
  }

  deleteLinks(index) {
    this.linkPoint.removeAt(index);
  }

  // Status codes
  statusCodes() {
    this.statuss = [
      { name: 'TO-DO', status: 'to-do' },
      { name: 'IN-PROGRESS', status: 'in-progress' },
      { name: 'DONE', status: 'done' },
    ];
  }

  // Status Change API
  StatusChange(val) {
    this.status = val.status;
  }

  teamSelection(team?: any) {
    this.selectedTeam = team;

    if (this.productListArr !== undefined) {
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < this.productListArr.length; i++) {
        if (this.productListArr[i]._id === team && this.productListArr[i].displayName === 'Engineering') {

          this.showEngineeringFields = true;
          break;
        } else {
          this.showEngineeringFields = false;
        }
      }
    } else {
    }
    if (this.showEngineeringFields === true) {
      // Login Form Controls
      if (this.editControls === false) {
        this.addTaskForm = this.fb.group({
          productName: [this.selectedTeam, [Validators.required]],
          title: ['', [Validators.required]],
          versions: ['', [Validators.required]],
          sprints: ['', [Validators.required]],
          startDate: ['', [Validators.required]],
          endDate: ['', [Validators.required]],
          description: ['', [Validators.required]],
          // assignees: [''],
          linkarr: this.fb.array([this.fb.group({ name: '', url: '' })])
        });
      } else {
        this.addTaskForm = this.fb.group({
          productName: [this.selectedTeam, [Validators.required]],
          title: ['', [Validators.required]],
          versions: ['', [Validators.required]],
          sprints: ['', [Validators.required]],
          startDate: ['', [Validators.required]],
          endDate: ['', [Validators.required]],
          // status: ['', [Validators.required]],
          description: ['', [Validators.required]],
          // assignees: [''],
          linkarr: this.fb.array([this.fb.group({ name: '', url: '' })])
        }),
          setTimeout(() => {
            this.setValueForEngineering();
          }, 1000);
      }
    } else {
      // Login Form Controls
      if (this.editControls === false) {
        this.addTaskForm = this.fb.group({
          productName: [this.selectedTeam, [Validators.required]],
          title: ['', [Validators.required]],
          startDate: ['', [Validators.required]],
          endDate: ['', [Validators.required]],
          description: ['', [Validators.required]],
          //  assignees: [''],
          linkarr: this.fb.array([this.fb.group({ name: '', url: '' })])
        });
      }
      if (this.editControls) {
        this.addTaskForm = this.fb.group({
          productName: [this.selectedTeam, [Validators.required]],
          title: ['', [Validators.required]],
          startDate: ['', [Validators.required]],
          endDate: ['', [Validators.required]],
          // status: ['', [Validators.required]],
          description: ['', [Validators.required]],
          //  assignees: [''],
          linkarr: this.fb.array([])
        }),
          setTimeout(() => {
            this.setVal();
          }, 0);
      }

    }
  }
  // patch value for product Name
  productPatchValue() {
    this.addTaskForm.patchValue(
      {
        productName: [this.selectedTeam, [Validators.required]]
      });
  }
  // Set value
  setVal() {
    this.showEditPage = true;
    this.addTaskForm.patchValue(
      {
        productName: this.selectedTeam ? this.selectedTeam : null,
        title: this.displayName ? this.displayName : null,
        startDate: this.startDate ? this.startDate : null,
        endDate: this.endDate ? this.endDate : null,
        // status: this.status ? this.status : null,
        description: this.description ? this.description : null,
        // linkarr: this.fb.array([{name: }])
        //  assignees: [''],
        linkarr: this.links ? this.setExpenseCategories() : null

        // this.linkPoint.push(this.fb.group({ name: '', url: '' }));

      });
  }

  setLinksss() {
    if (this.links) {
      // this.fb.group({ name: '', url: '' });
      if (this.links.length > 0) {
        this.links.forEach(element => {
          if (element && element.name && element.url) {
            this.fb.group({ name: element.name, url: element.url });
          }
        });
      }
    }
  }

  setExpenseCategories() {
    // this.linkPoint = [];

    this.links.forEach(ele => {
      if (this.linkPoint.length < this.links.length) {

        this.linkPoint.push(
          this.fb.group({
            name: ele.name,
            url: ele.url
          })
        );
      }

    });
  }
  // Set value
  setValueForEngineering() {
    this.showEditPage = true;
    this.addTaskForm.setValue(
      {
        productName: this.selectedTeam,
        title: this.displayName,
        versions: this.selectedVersion,
        sprints: this.selectedSprint,
        startDate: this.startDate,
        endDate: this.endDate,
        // status: this.status ? this.status : null,
        description: this.description,
        //  assignees: [''],
        linkarr: this.links
      }
    );
  }

  // Add and Edit milestone
  taskCrudSubmit() {
    // tslint:disable-next-line: prefer-const
    // To get Assignees user id
    const assignedTo: any[] = [];
    this.assignedsTo.forEach(item => {
      if (item._id) {
        assignedTo.push(item._id);
      }
    });

    const dependency: any[] = [];
    this.dependencyShowArray.forEach(element => {
      if (element._id) {
        dependency.push(element._id);
      }
    });

    // Change Date format to yyyy-mm-dd and date Validation
    const momentDate = new Date(this.addTaskForm.value.startDate);
    const startDate = moment(momentDate).format('YYYY-MM-DD');
    const momentDate1 = new Date(this.addTaskForm.value.endDate);
    const endDate = moment(momentDate1).format('YYYY-MM-DD');
    if (momentDate.getTime() > momentDate1.getTime()) {
      this.dateValidation = 'End date cannot be lower than start date';
    } else {
      const attachements = this.addTaskForm.value.linkarr;
      const apps = [
        {
          name: 'JiraApp',
          data: {
            version: this.selectedVersion,
            sprint: this.selectedSprint
          }
        }
      ];
      let createMilestone;
      if (this.showEngineeringFields === true) {
        createMilestone = {
          displayName: this.addTaskForm.value.title,
          product: JSON.parse(localStorage.getItem('productAccess')).productId.toString(),
          startDate,
          endDate,
          status: 'to-do',
          department: this.addTaskForm.value.productName,
          attachements,
          description: this.addTaskForm.value.description,
          assignedTo,
          dependency,
          apps
        };
      } else {
        createMilestone = {
          displayName: this.addTaskForm.value.title,
          product: JSON.parse(localStorage.getItem('productAccess')).productId.toString(),
          startDate,
          endDate,
          department: this.addTaskForm.value.productName,
          attachements,
          status: this.status,
          description: this.addTaskForm.value.description,
          assignedTo,
          dependency,
        };
      }

      if (this.editControls === true) {
        // Edit Milestone API
        this.apiServices.editMilestone(this.milestoneId, createMilestone).subscribe((data: any) => {
          this.commonServices.success('Milestone Updated Successfully', '');
          // Subject triggers to update milestone
          // To set Start and End date as 1 and (31 or 30)
          const startD = createMilestone.startDate.split('-');
          const endD = createMilestone.endDate.split('-');
          // Product Access Local Storage
          localStorage.setItem(
            'productAccess', JSON.stringify({
              departmentName: JSON.parse(localStorage.getItem('productAccess')).departmentName,
              department: JSON.parse(localStorage.getItem('productAccess')).department,
              productId: JSON.parse(localStorage.getItem('productAccess')).productId,
              ACLaccess: JSON.parse(localStorage.getItem('productAccess')).ACLaccess,
              sprintMilestoneId: JSON.parse(localStorage.getItem('productAccess')).sprintMilestoneId,
              versionId: JSON.parse(localStorage.getItem('productAccess')).versionId,
              Month: startD[1],
              Year: startD[0]
            })
          );

          const month = moment(startD[0] + '-' + startD[1] + '-' + '01' + ' 00:00:00');
          const apiDates = {
            startDate: month.startOf('month').format('YYYY-MM-DD'),
            endDate: month.endOf('month').format('YYYY-MM-DD')
          };
          this.apiServices.firstProductMapping.next(apiDates);
          this.route.navigate([`/p/${JSON.parse(localStorage.getItem('productAccess')).productId.toString()}/m/${this.milestoneId}/view`]);
        });
      } else {
        // Create Milestone API
        this.apiServices.createMilestone(createMilestone).subscribe((data: any) => {
          this.commonServices.success('Milestone Successfully created', '');
          // Subject triggers to update milestone
          // To set Start and End date as 1 and (31 or 30)
          const startD = createMilestone.startDate.split('-');
          const endD = createMilestone.endDate.split('-');
          // Product Access Local Storage
          localStorage.setItem(
            'productAccess', JSON.stringify({
              departmentName: JSON.parse(localStorage.getItem('productAccess')).departmentName,
              department: JSON.parse(localStorage.getItem('productAccess')).department,
              productId: JSON.parse(localStorage.getItem('productAccess')).productId,
              ACLaccess: JSON.parse(localStorage.getItem('productAccess')).ACLaccess,
              sprintMilestoneId: JSON.parse(localStorage.getItem('productAccess')).sprintMilestoneId,
              versionId: JSON.parse(localStorage.getItem('productAccess')).versionId,
              Month: startD[1],
              Year: startD[0]
            })
          );

          const month = moment(startD[0] + '-' + startD[1] + '-' + '01' + ' 00:00:00');
          const apiDates = {
            startDate: month.startOf('month').format('YYYY-MM-DD'),
            endDate: month.endOf('month').format('YYYY-MM-DD')
          };
          this.apiServices.firstProductMapping.next(apiDates);
          // this.apiServices.loadReleasesAPI.next(JSON.parse(localStorage.getItem('productAccess')).productId.toString());
          this.route.navigate([`/p/${JSON.parse(localStorage.getItem('productAccess')).productId.toString()}/m`]);
        });

      }
    }
  }

  // Get All Department
  getDepartment() {
    this.apiServices.getDepartments().subscribe((data: any) => {
      // this.productListArr = data.data.departments;
      this.allAccessUserFirstProduct = data.data.departments[1].displayName !== 'All' ? data.data.departments[1]._id : data.data.departments[2]._id;
      this.productListArr = data.data.departments.filter((item, i) => (item.displayName !== 'All') ? item : null);

    });
  }

  // Get Sprints
  getSprint() {
    this.apiServices.getSprints().subscribe((data: any) => {
      this.sprints = data.data.sprints;
    });
  }

  // Get Versions
  getVersion() {
    this.apiServices.getVersions().subscribe((data: any) => {
      this.versions = data.data.versions;
    });
  }

  onSprintGetting(sprintId) {
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.sprints.length; i++) {
      if (this.sprints[i]._id === sprintId) {
        if (this.sprints[i].startDate) {
          this.JiraStartDate = this.sprints[i].startDate;
          this.showJiraStartDate = true;
        } else {
          this.JiraStartDate = '';
          this.showJiraStartDate = false;
        }
        if (this.sprints[i].endDate) {
          this.JiraEndDate = this.sprints[i].endDate;
          this.showJiraEndDate = true;
        } else {
          this.JiraEndDate = '';
          this.showJiraEndDate = false;
        }
      }
    }
    this.addTaskForm.patchValue(
      {
        startDate: this.JiraStartDate,
        endDate: this.JiraEndDate,
      }
    );
  }

  // Get Sprint and Versions
  getSprintVersion() {
    this.apiServices.getVersionSprints().subscribe((data: any) => {
      this.versions = data.data.releases.version;
      this.sprints = data.data.releases.sprint;
      this.showAddTask = true;
      this.teamSelection(this.selectedTeam);

    });
  }


  // Get users for Assignees
  getUsers() {
    let use: any[] = [];
    this.apiServices.getUsersOnTeam().subscribe((data: any) => {
      this.userList = data.data.users;
      this.userList.forEach(element => {
        if (element.isActive === true) {
          use.push(element.user);
        }
      });
      this.userList = use;
      this.allFruits = use;

      if (this.allFruits.length === 0) {
        this.showEmptyAssignee = true;
      } else {
        this.showEmptyAssignee = false;
      }

    });
  }


  // For Update

  // GetMilestone Details
  getMilestone() {
    this.apiServices.viewMilestone(this.milestoneId).subscribe((data: any) => {
      this.editMilestoneData = data.data.milestone;
      this.displayName = this.editMilestoneData.displayName;
      this.startDate = this.editMilestoneData.startDate;
      this.endDate = this.editMilestoneData.endDate;
      this.status = this.editMilestoneData.status;
      this.description = this.editMilestoneData.description;
      this.links = this.editMilestoneData.attachements;
      this.selectedTeam = this.editMilestoneData.department._id;

      const depend = this.editMilestoneData.dependency;
      const dependDepat = this.editMilestoneData.dependantDepartment;
      const dependAssign = this.editMilestoneData.dependantUsers;

      depend.forEach(element => {
        dependDepat.forEach(ele => {
          if (element.department === ele._id) {
            element.department = {
              displayName: ele.displayName,
              slug: ele.slug,
              _id: ele._id
            };
          }
        });
      });

      let assig: any[] = [];

      depend.forEach(element => {
        element.assignedTo.forEach(elem => {
          assig = dependAssign.filter((datas: any) => {
            return element.assignedTo.some((item: any) => {
              if (datas._id === item) {
                return item;
              }
            });
          });
          element.assignedTos = assig;
        });
      });

      this.dependencyShowArray = depend;

      this.dependencyShowArray.forEach((element, i) => {
        this.MilestoneDependencies.forEach((ele, j) => {
          if (element._id === ele._id) {
            this.MilestoneDependencies.splice(j, 1);
          }
        });
      });


      if (this.editMilestoneData.department.displayName === 'Engineering') {
        this.showEngineeringFields = true;
        this.selectedSprint = this.editMilestoneData.apps[0].data.sprint;
        this.selectedVersion = this.editMilestoneData.apps[0].data.version;
      } else {
        this.showEngineeringFields = false;
      }
      const tempFruit = [];
      this.editMilestoneData.assignedTo.forEach((element, i) => {
        tempFruit.push(element);
      });
      this.assignedsTo = tempFruit;

      this.allFruits.forEach((element, i) => {
        this.assignedsTo.forEach((ele) => {
          if (element._id === ele._id) {
            this.allFruits.splice(i, 1);
          }
        });
      });


      this.teamSelection(this.selectedTeam);
    });
  }

  close() {
    this.route.navigate([`/p/${JSON.parse(localStorage.getItem('productAccess')).productId.toString()}/m`]);
  }

  ngAfterViewInit() {
    setTimeout(() => {
      console.clear();
    }, 2000);
  }
}
