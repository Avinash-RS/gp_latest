import { Component, OnInit, OnChanges, OnDestroy, ElementRef, NgZone, ViewChild, Input, AfterViewInit } from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { FormBuilder, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { APIService } from 'src/app/services/api.service';
import { MatDialog } from '@angular/material';
import { CommonService } from 'src/app/services/common.service';
import { IModalInfo } from 'src/app/Interface/model';
import { GpAddMembersComponent } from 'src/app/gp-teams/gp-add-members/gp-add-members.component';
import { GpErrorDialogComponent } from 'src/app/shared/gp-error-dialog/gp-error-dialog.component';
import * as moment from 'moment';
import { Observable, Subscription } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { MentionConfig, MentionDirective } from 'angular-mentions';
import { MentionOnSearchTypes } from 'ng-zorro-antd/mention';

declare var $: any;
declare var tinymce: any;


export interface User {
  name: string;
  id: string;
}
export interface Tags {
  name: string;
  id: string;
  username: string;
}


@Component({
  selector: 'app-gp-comments',
  templateUrl: './gp-comments.component.html',
  styleUrls: ['./gp-comments.component.scss']
})

export class GpCommentsComponent implements OnInit, AfterViewInit, OnDestroy {

  // @Input() htmlContents: string;
  // @ViewChild(MentionDirective, { static: true }) mention: MentionDirective;


  sub: Subscription;

  complexItems: any;
  sprintVersionsFinalArray: any[];
  mentionConfig: MentionConfig;
  // mentionConfig;
  tagsList: any[] = [];
  check: any;

  // name = 'Angular 6';
  // htmlContent = '';
  // editContent = '';

  // config: AngularEditorConfig = {
  //   editable: true,
  //   spellcheck: true,
  //   height: '10rem',
  //   minHeight: '10rem',
  //   placeholder: 'Enter text here...',
  //   translate: 'no',
  //   defaultParagraphSeparator: 'p',
  //   defaultFontName: 'Montserrat',
  //   defaultFontSize: '2',
  //   toolbarPosition: 'bottom',

  //   toolbarHiddenButtons: [
  //     ['bold', 'italic', 'underline', 'strikeThrough', 'superscript',
  //       'subscript', 'heading', 'fonts', 'insertImage', 'insertVideo',
  //       'insertHorizontalRule', 'remove', 'toggleEditorMode', 'indent', 'outdent', 'justifyRight', 'justifyFull', 'link', 'unlink',
  //       'ClearFormatting', 'backgroundColor', 'fontName', 'removeFormat']
  //   ],
  // };


  milestoneId: string;
  commentListArr: any;
  htmlStr: string;
  editOption: boolean;
  editId: any;
  allUsersArr: any;
  aclAccessBoolean = false;

  // Show TextArea to Eliminate Undefined Error
  showTextArea = false;


  myControl = new FormControl();
  options: User[] = [
    { name: 'Mary', id: '0' },
    { name: 'Shelley', id: '1' },
    { name: 'Igor', id: '2' }
  ];
  filteredOptions: Observable<User[]>;
  milestoneAPI: any;
  ACLDepartmentId: string;
  ACLUserId: string;
  ACL: { list: string; edit: string; get: string; create: string; delete: string; };
  sub7: any;

  // Ant mentions
  notValue = 'No Suggestions Found';
  htmlContent: any;
  loadTrue = true;
  editContent: any;
  webFrameworks = [
    // { name: 'Growth Admin - User', fname: 'growth', lname: 'admin', type: 'JavaScript' },
    // { name: 'Angular', type: 'JavaScript' },
    // { name: 'Laravel', type: 'PHP' },
    // { name: 'Flask', type: 'Python' },
    // { name: 'Django', type: 'Python' }
  ];
  suggestions: any[] = [];
  tags = [
    // { name: 'avi', type: '01' },
    // { name: 'ram', type: '02' },
    // { name: 'san', type: '03' },
    // { name: 'arun', type: '04' },
    // { name: 'sath', type: '05' }
  ];

  nzPrefix: any[] = [];

  // Ant Tags list assign

  valueWith = (data: { name: string; username: string; type: string, value: string }) => {
    if (data.type === 'User') {
      const splits = `${data.username.replace(/\s/gi, "")}`;
      // tslint:disable-next-line: no-string-literal
      const tag = { type: `${data['type']}`, name: `@${splits}`, reference: `${data['value']}` };
      this.tagsList.push(tag);
      return splits;
    }
    if (data.type === 'Milestone') {
      const splits = `${data.username.replace(/\s/gi, "")}`;
      // tslint:disable-next-line: no-string-literal
      const tag = { type: `${data['type']}`, name: `#${splits}`, reference: `${data['value']}` };
      this.tagsList.push(tag);
      return splits;
    }
    if (data.type === 'Sprint') {
      const splits = `${data.username.replace(/\s/gi, "")}`;
      // tslint:disable-next-line: no-string-literal
      const tag = { type: `${data['type']}`, name: `#${splits}`, reference: `${data['value']}` };
      this.tagsList.push(tag);
      return splits;
    }
  }



  constructor(
    private fb: FormBuilder,
    private route: Router,
    private apiServices: APIService,
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private commonServices: CommonService,
    // tslint:disable-next-line: variable-name
    private _elementRef: ElementRef, private _zone: NgZone
  ) {

    // To read URL param
    this.activatedRoute.paramMap.subscribe(params => {
      // For Milestone Comments
      if (localStorage.getItem('comments') === 'Milestone') {
        this.milestoneId = params.get('id');
      } else {
        this.milestoneId = params.get('scid');
      }
    });
  }

  ngOnInit() {

    this.ACLAccess();

    // For Milestone Comments
    if (localStorage.getItem('comments') === 'Milestone') {
      // Check whether this comment is in particular month milestone
      this.particularMonthMilestone();
    }

    this.getUsers();

    this.commentList();

    // Rx js Delete Comment
    this.deleteCommentRxjs();

    // this.getSprintsVersions();

  }

  // Ant Mentions

  onSelect({ value, prefix }: MentionOnSearchTypes): void {
    this.suggestions = prefix === '@' ? this.webFrameworks : this.tags;
  }

  getId(value: any) {
  }


  ACLAccess() {
    let ACLArr;
    this.ACLDepartmentId = JSON.parse(localStorage.getItem('productAccess')).department ? JSON.parse(localStorage.getItem('productAccess')).department : '';
    ACLArr = JSON.parse(localStorage.getItem('productAccess')).ACLaccess.comment.toString();
    this.ACLUserId = localStorage.getItem('userProfile') ? JSON.parse(localStorage.getItem('userProfile')).userId : '';
    ACLArr = ACLArr.split(',');
    this.ACL = {
      list: '', edit: '', get: '', create: '', delete: ''
    };
    ACLArr.forEach(element => {
      if (element.includes('list:')) {
        this.ACL.list = element.replace(/^list:/gi, '');
      }
      if (element.includes('edit:')) {
        this.ACL.edit = element.replace(/^edit:/gi, '');
      }
      if (element.includes('get:')) {
        this.ACL.get = element.replace(/^get:/gi, '');
      }
      if (element.includes('create:')) {
        this.ACL.create = element.replace(/^create:/gi, '');
      }
      if (element.includes('delete:')) {
        this.ACL.delete = element.replace(/^delete:/gi, '');
      }
    });
  }


  ngAfterViewInit() {
  }


  // format = (item: any) => {

  //   // tslint:disable-next-line: no-string-literal
  //   if (`${item['type']}` === 'Sprint' || `${item['type']}` === 'Milestone') {
  //     // tslint:disable-next-line: no-string-literal
  //     const splits = `${item['username'].replace(/\s/gi, "")}`;
  //     // tslint:disable-next-line: no-string-literal
  //     const tag = { type: `${item['type']}`, name: `#${splits}`, reference: `${item['value']}` };
  //     this.tagsList.push(tag);
  //     return `#${splits}`;
  //   }
  //   // tslint:disable-next-line: no-string-literal
  //   if (`${item['type']}` === 'User') {
  //     // tslint:disable-next-line: no-string-literal
  //     const tag = { type: `${item['type']}`, name: `@${item['username']}`, reference: `${item['value']}` };
  //     this.tagsList.push(tag);
  //     // tslint:disable-next-line: no-string-literal
  //     return `@${item['username']}`;
  //   }

  // }


  // Rx js Delete Comment
  deleteCommentRxjs() {
    this.apiServices.forDeleteComment.subscribe((data: any) => {
      this.commentList();
    });
  }

  // Check whether this comment is in particular month milestone
  particularMonthMilestone() {
    this.sub7 = this.apiServices.viewMilestone(this.milestoneId).subscribe((data: any) => {
      const startDate = data.data.milestone.startDate;

      // setting start date and end date of particular milestone when Navigating to particular milestone month when milestone id is hardcoded in url
      const forDashboardMiletsonestartDate = moment(startDate).format('YYYY-MM-DD').split('-');
      const months = moment(forDashboardMiletsonestartDate[0] + '-' + forDashboardMiletsonestartDate[1] + '-' + '01' + ' 00:00:00');
      const apiDates = {
        startDate: months.startOf('month').format('YYYY-MM-DD'),
        endDate: months.endOf('month').format('YYYY-MM-DD')
      };


      if (JSON.parse(localStorage.getItem('productAccess')).Month.toString() !== forDashboardMiletsonestartDate[1] || JSON.parse(localStorage.getItem('productAccess')).Year.toString() !== forDashboardMiletsonestartDate[0]) {
        // Product Access Local Storage
        localStorage.setItem(
          'productAccess', JSON.stringify({
            departmentName: JSON.parse(localStorage.getItem('productAccess')).departmentName,
            department: JSON.parse(localStorage.getItem('productAccess')).department,
            productId: JSON.parse(localStorage.getItem('productAccess')).productId,
            ACLaccess: JSON.parse(localStorage.getItem('productAccess')).ACLaccess,
            sprintMilestoneId: JSON.parse(localStorage.getItem('productAccess')).sprintMilestoneId,
            versionId: JSON.parse(localStorage.getItem('productAccess')).versionId,
            Month: forDashboardMiletsonestartDate[1],
            Year: forDashboardMiletsonestartDate[0]
          })
        );
        return this.apiServices.firstProductMapping.next(apiDates); // Subject for Milestone
      }

    });
  }

  commentList() {
    this.apiServices.CommentList(this.milestoneId).subscribe((data: any) => {
      this.commentListArr = data.data.comments.reverse();
      this.commentListArr = this.commentListArr.map(element => {
        if (element.updatedAt) {
          element.updatedAt = moment(element.updatedAt).format('lll');
        }
        if (element.tags.length > 0) {
          element.tags.forEach(ele => {
            if (ele.type) {
              const myval = String(element.formatedString)
                .split(' ')
                .map((item: any) => {
                  if (String(item)[0] === "@") {
                    return `<span class="comment-user-color"><b>${item}</b></span>`;
                  }
                  if (String(item)[0] === "#") {
                    return `<span class="comment-sprint-color"><b>${item}</b></span>`;
                  }
                  return item;
                })
                .toString()
                .replace(/,/gi, ' ');
              element.formatedString = myval;
            }

          });
        }
        return element;

      });
    });
  }

  submit() {
    if (this.htmlContent.replace(/\n/gi, " ").trim().length > 0) {
      const tags = this.tagsList;
      // Filtering duplicate from dropdown click Tags (Final)
      const uniqueTags = tags.filter((tag, index) => {
        // tslint:disable-next-line: variable-name
        const _tag = JSON.stringify(tag);
        return index === tags.findIndex(obj => {
          return JSON.stringify(obj) === _tag;
        });
      });
      this.tagsList = uniqueTags;

      const tagsNew: any[] = [];
      const splits = this.htmlContent.replace(/\n/gi, " ").split(' ');

      // Filtering Matching Tags (Final)
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < this.tagsList.length; i++) {
        // tslint:disable-next-line: prefer-for-of
        for (let j = 0; j < splits.length; j++) {
          if (splits[j].includes(this.tagsList[i].name)) {
            tagsNew.push(this.tagsList[i]);
          }
        }
      }
      // Filtering Duplicate Tags (Final)
      const uniqueTagsFinal = tagsNew.filter((tag, index) => {
        // tslint:disable-next-line: variable-name
        const _tag = JSON.stringify(tag);
        return index === tagsNew.findIndex(obj => {
          return JSON.stringify(obj) === _tag;
        });
      });
      this.tagsList = uniqueTagsFinal;
      const apiFormat = this.htmlContent.replace(/\n/gi, "<br>");

      const forApi = {
        formatedString: apiFormat,
        type: localStorage.getItem('comments'),
        reference: this.milestoneId,
        tags: this.tagsList
      };

      this.apiServices.addComments(forApi).subscribe((data: any) => {
        this.commonServices.success('Comment Added Successfully', '');
        this.htmlContent = '';
        this.commentList();
      });
    } else {
      this.htmlContent = this.htmlContent.replace(/\n/gi, " ").trim();
      this.commonServices.error('Please provide a valid comment to submit', '');
    }
  }

  editUpdate() {
    if (this.editContent.replace(/\n/gi, " ").trim().length > 0) {
      const tags = this.tagsList;
      // Filtering duplicate from dropdown click Tags (Final)
      const uniqueTags = tags.filter((tag, index) => {
        // tslint:disable-next-line: variable-name
        const _tag = JSON.stringify(tag);
        return index === tags.findIndex(obj => {
          return JSON.stringify(obj) === _tag;
        });
      });
      this.tagsList = uniqueTags;

      const tagsNew: any[] = [];
      // const apiFormat = this.htmlContent.replace(/\n/gi, "<br/>");
      const splits = this.editContent.replace(/\n/gi, " ").split(' ');

      // Filtering Matching Tags (Final)
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < this.tagsList.length; i++) {
        // tslint:disable-next-line: prefer-for-of
        for (let j = 0; j < splits.length; j++) {
          if (splits[j].includes(this.tagsList[i].name)) {
            tagsNew.push(this.tagsList[i]);
          }
        }
      }
      // Filtering Duplicate Tags (Final)
      const uniqueTagsFinal = tagsNew.filter((tag, index) => {
        // tslint:disable-next-line: variable-name
        const _tag = JSON.stringify(tag);
        return index === tagsNew.findIndex(obj => {
          return JSON.stringify(obj) === _tag;
        });
      });
      this.tagsList = uniqueTagsFinal;

      const apiFormat = this.editContent.replace(/\n/gi, "<br>");

      const forApi = {
        formatedString: apiFormat,
        type: localStorage.getItem('comments'),
        reference: this.milestoneId,
        tags: this.tagsList
      };

      this.apiServices.editComment(this.editId, forApi).subscribe((data: any) => {
        this.commonServices.success('Comment Updated', '');
        this.editOption = false;
        this.editContent = '';
        this.htmlContent = '';
        this.commentList();
      });
    } else {
      this.editContent = this.editContent.replace(/\n/gi, " ").trim();
      this.commonServices.error('Please provide a valid comment to update', '');
    }

  }

  cancel() {
    this.htmlContent = '';
  }

  editCancel() {
    this.editOption = false;
    this.commentList();
  }

  edit(id) {
    let editArr: any;
    this.editOption = true;
    let run: boolean;
    this.editId = id;
    this.commentListArr.forEach(element => {
      if (element._id === id) {
        // const apiFormat = this.editContent.replace(/\n/gi, "<br>");

        const editContent = element.formatedString.replace(/<br>/gi, "\n");
        this.editContent = editContent.replace(/<[^>]*>?/gm, '');
        editArr = element.tags;
        run = true;
      } else {
        run = false;
      }
    });
    // C
    const usersArray: any[] = [];
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < editArr.length; i++) {
      if (editArr[i].type === "User") {
        editArr[i].referenceI = `${editArr[i].reference._id}`;
        editArr[i].name = editArr[i].reference.firstName && editArr[i].reference.lastName ? `@${editArr[i].reference.firstName}${editArr[i].reference.lastName.slice(0, 1)}` : '';
        // editArr[i].type = `${editArr[i].type}`;

        delete editArr[i].from;
        delete editArr[i].to;
        delete editArr[i].reference;
        // delete editArr[i].reference.firstName;
        // delete editArr[i].reference.lastName;
        usersArray.push(editArr[i]);
      }
      if (editArr[i].type === "Sprint") {
        editArr[i].referenceI = `${editArr[i].reference._id}`;
        const splits = `${editArr[i].reference.name.replace(/\s/gi, "")}`;

        editArr[i].name = `#${splits}`;
        // editArr[i].type = `${editArr[i].type}`;

        delete editArr[i].from;
        delete editArr[i].to;
        delete editArr[i].reference;
        // delete editArr[i].reference.firstName;
        // delete editArr[i].reference.lastName;
        usersArray.push(editArr[i]);
      }
      if (editArr[i].type === "Milestone") {
        editArr[i].referenceI = `${editArr[i].reference._id}`;
        const splits = `${editArr[i].reference.displayName.replace(/\s/gi, "")}`;

        editArr[i].name = `#${splits}`;
        // editArr[i].type = `${editArr[i].type}`;

        delete editArr[i].from;
        delete editArr[i].to;
        delete editArr[i].reference;
        // delete editArr[i].reference.firstName;
        // delete editArr[i].reference.lastName;
        usersArray.push(editArr[i]);
      }
    }

    const editTagsArray: any[] = [];
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < usersArray.length; i++) {
      if (usersArray[i]) {
        usersArray[i].type = `${usersArray[i].type}`;
        usersArray[i].name = `${usersArray[i].name}`;
        usersArray[i].reference = `${usersArray[i].referenceI}`;
        delete usersArray[i].referenceI;

        editTagsArray.push(usersArray[i]);
      }
    }
    this.tagsList = editTagsArray;
  }

  delete(id) {
    const dialogMsg = {
      id,
      msg: 'comment'
    };
    this.openDialog(dialogMsg);
  }

  close() {
    if (localStorage.getItem('comments') === 'Milestone') {
      this.route.navigate([`/p/${JSON.parse(localStorage.getItem('productAccess')).productId.toString()}/m`]);
    } else {
      this.route.navigate([`/p/${JSON.parse(localStorage.getItem('productAccess')).productId.toString()}/m/${JSON.parse(localStorage.getItem('productAccess')).sprintMilestoneId.toString()}/s`]);
    }
  }

  getUsers() {
    const usersArray: any = [];
    this.sub = this.apiServices.getUsersOnTeam().subscribe((data: any) => {
      this.allUsersArr = data.data.users;

      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < this.allUsersArr.length; i++) {
        if (this.allUsersArr[i]) {
          this.allUsersArr[i].user.username = `${this.allUsersArr[i].user.firstName}${this.allUsersArr[i].user.lastName.slice(0, 1)}`;
          this.allUsersArr[i].user.name = `${this.allUsersArr[i].user.firstName} ${this.allUsersArr[i].user.lastName} - User`;
          this.allUsersArr[i].user.value = this.allUsersArr[i].user._id;
          this.allUsersArr[i].user.type = 'User';

          delete this.allUsersArr[i].user.firstName;
          delete this.allUsersArr[i].user.lastName;
          delete this.allUsersArr[i].user.location;
          delete this.allUsersArr[i].user.phoneNumber;
          delete this.allUsersArr[i].user.profileImageUrl;
          delete this.allUsersArr[i].user.timezone;
          delete this.allUsersArr[i].user.email;
          delete this.allUsersArr[i].user._id;


          usersArray.push(this.allUsersArr[i].user);
        }
      }

      // Sprints versions APi start

      let sprintVersionsFinalArr: any[] = [];
      const sprintsArr: any[] = [];
      const versonsArr: any[] = [];
      // tslint:disable-next-line: no-shadowed-variable
      this.apiServices.getVersionSprints().subscribe((data: any) => {
        const sprintVersionsArr = data.data.releases;
        // this.allUsersArr = data.data.users;

        for (let i = 0; i < sprintVersionsArr.sprint.length; i++) {
          if (sprintVersionsArr.sprint[i]) {
            sprintVersionsArr.sprint[i].username = `${sprintVersionsArr.sprint[i].name}`;
            sprintVersionsArr.sprint[i].name = `${sprintVersionsArr.sprint[i].name} - Sprint`;
            sprintVersionsArr.sprint[i].value = sprintVersionsArr.sprint[i]._id;
            sprintVersionsArr.sprint[i].type = 'Sprint';

            delete sprintVersionsArr.sprint[i].endDate;
            delete sprintVersionsArr.sprint[i].product;
            delete sprintVersionsArr.sprint[i].startDate;
            delete sprintVersionsArr.sprint[i].traceBackId;
            delete sprintVersionsArr.sprint[i]._id;


            sprintsArr.push(sprintVersionsArr.sprint[i]);
          }
        }

        for (let i = 0; i < sprintVersionsArr.version.length; i++) {
          if (sprintVersionsArr.version[i]) {
            sprintVersionsArr.version[i].username = `${sprintVersionsArr.version[i].name}`;
            sprintVersionsArr.version[i].name = `${sprintVersionsArr.version[i].name} - Versions`;
            sprintVersionsArr.version[i].value = sprintVersionsArr.version[i]._id;
            sprintVersionsArr.version[i].type = 'Sprint';

            delete sprintVersionsArr.version[i].endDate;
            delete sprintVersionsArr.version[i].product;
            delete sprintVersionsArr.version[i].startDate;
            delete sprintVersionsArr.version[i].traceBackId;
            delete sprintVersionsArr.version[i]._id;


            versonsArr.push(sprintVersionsArr.version[i]);
          }
        }
        sprintVersionsFinalArr = sprintsArr.concat(versonsArr);

        // Milestone Api Calling start

        let milestoneArr: any = [];
        this.apiServices.getAllMilestonesForComment().subscribe((data: any) => {
          this.milestoneAPI = data.data;
          for (let i = 0; i < this.milestoneAPI.milestones.length; i++) {
            if (this.milestoneAPI.milestones[i]) {
              this.milestoneAPI.milestones[i].username = `${this.milestoneAPI.milestones[i].displayName}`;
              this.milestoneAPI.milestones[i].name = `${this.milestoneAPI.milestones[i].displayName} - Milestone`;
              this.milestoneAPI.milestones[i].value = this.milestoneAPI.milestones[i]._id;
              this.milestoneAPI.milestones[i].type = 'Milestone';

              delete this.milestoneAPI.milestones[i].displayName;
              delete this.milestoneAPI.milestones[i]._id;


              milestoneArr.push(this.milestoneAPI.milestones[i]);
            }
          }
          let concatArray = sprintVersionsFinalArr.concat(milestoneArr);

          const temp: Tags = usersArray;
          this.complexItems = usersArray;
          this.sprintVersionsFinalArray = concatArray;

          // Ant Mentions Assign
          this.webFrameworks = this.complexItems;
          this.tags = this.sprintVersionsFinalArray;

          if (this.complexItems && this.sprintVersionsFinalArray) {

            // Set Timeout to eliminate Mentions Undefined Error in Console
            this.showTextArea = true;

            // this.mentionConfig = {
            //   mentions: [
            //     {
            //       items: this.complexItems,
            //       labelKey: `${'name'}`,
            //       triggerChar: '@',
            //       // maxItems: 5,
            //       mentionSelect: this.format
            //     },
            //     {
            //       items: this.sprintVersionsFinalArray,
            //       labelKey: `${'name'}`,
            //       triggerChar: '#',
            //       // maxItems: 5,
            //       mentionSelect: this.format
            //     }
            //   ]
            // };
          }

        });


        // Milestone Api calling End


      });
      // Sprint Versions APi end

    });
  }

  createEnter(event) {
    if (event.keyCode === 13 && !event.shiftKey) {
      this.submit();
    }
  }
  editEnter(event) {
    if (event.keyCode === 13 && !event.shiftKey) {
      this.editUpdate();
    }
  }


  // Open dailog
  openDialog(id) {
    let dialogDetails: IModalInfo;
    let pageContent;

    dialogDetails = {
      iconName: 'success',
      showCancel: false,
      content: pageContent,
      buttonText: 'Okay'
    };

    /**
     * Dialog modal window
     */
    // tslint:disable-next-line: one-variable-per-declaration
    const dialogRef = this.dialog.open(GpErrorDialogComponent, {
      width: '350px',
      height: '150px',
      autoFocus: false,
      data: id
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        localStorage.clear();
        this.apiServices.logout().subscribe((data: any) => {
          localStorage.clear();
          this.route.navigate(['/login']);
        });
      }
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    // tslint:disable-next-line: no-unused-expression
    this.sub7 ? this.sub7.unsubscribe() : '';
  }

}
