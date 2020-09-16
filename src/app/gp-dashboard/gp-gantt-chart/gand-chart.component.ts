import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnChanges,
  Pipe,
  PipeTransform,
  EventEmitter,
  Output,
  OnDestroy
} from "@angular/core";
import * as moment from "moment";
import gandData from "./data";
import weakData from "./weekData";
import { Router, ActivatedRoute } from "@angular/router";
import { APIService } from "src/app/services/api.service";
import { CommonService } from "src/app/services/common.service";
import { MatDialog, MatSnackBarRef } from "@angular/material";
import { IModalInfo } from "src/app/Interface/model";
import { ModalInfoWithbuttonComponent } from "src/app/shared/modal-info-withbutton/modal-info-withbutton.component";
import { environment } from "src/environments/environment";
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';

@Pipe({ name: 'tooltipList' })

export class TooltipListPipe implements PipeTransform {

  transform(lines: any): string {

    let list: string = '';
    lines = lines.split(',');
    if (lines) {
      lines.forEach(line => {
        list += '• ' + line + '\n';
      });
    }

    return list;
  }
}

@Component({
  selector: "app-gand-chart",
  templateUrl: "./gand-chart.component.html",
  styleUrls: ["./gand-chart.component.scss"]
})
export class GandChartComponent implements OnInit, OnChanges, OnDestroy {
  BASE_IMAGE_URL = environment.Image_Base_Url;

  public scrollbarOptions = { axis: "y", theme: "minimal-dark" };

  @Output() EmittedFilterArray = new EventEmitter<any>();
  @ViewChild("dates", { read: true, static: false }) elementView: ElementRef;

  refreshPage: boolean = true;
  dateDataSource: DateInterface[] = gandData;
  showStartDate = false;
  showEndDate = false;
  weekData: any[] = [];
  ganduChart = "0px";
  cellWidth = "0px";
  dayWidth = "0px";
  weeksInMonthCount: number = 0;
  filterValue: any[] = [];
  selectedGnatt: any[] = ['all'];
  filterValueUser: any[] = [];
  filterValueCode: any[] = [];
  selectedGnattCode: any[] = ['all'];
  selectedGnattUser: any[] = ['all'];
  departmentVaraties = [];
  startDate = {
    date: "",
    month: "",
    year: ""
  };
  eleWidths = {
    product: "",
    design: "",
    engineering: "",
    marketing: "",
    business: "",
    funding: ""
  };
  public showEmpty: boolean = false;
  months: string[] = [
    "",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
    "Jan"
  ];
  bigMonths: string[] = [
    "",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];
  legend: any[] = [
    {
      department: "Product",
      background: "#b19b61"
    },
    {
      department: "Design",
      background: "#61b17a"
    },
    {
      department: "Engineering",
      background: "#db7979"
    },
    {
      department: "Marketing",
      background: "#66bae0"
    },
    {
      department: "Business Development",
      background: "#f0bf64"
    },
    {
      department: "Funding",
      background: "#616db1"
    },
    {
      department: "Customer Support",
      background: "#9B61B1"
    },
    {
      department: "Sales",
      background: "#B18361"
    },
    {
      department: "HR",
      background: "#93D3C8"
    }
  ];
  @Input() inputData: any[];
  showDefault: boolean;
  ACL: any;
  showGnattData: boolean;
  unDefined: boolean;
  minDate: Date;
  maxDate: Date;
  disableRightIcon = false;
  disableLeftIcon = false;
  activeUsers: any[];
  selectedLocalValue: any[] = [];
  staticInputData: any[];
  rxjsSub: Subscription;
  unSelectAll: boolean;
  statusCodeArr: { name: string; status: string; }[];

  constructor(
    public route: Router,
    public apiServices: APIService,
    public dialog: MatDialog,
    public activateRouter: ActivatedRoute,
    private commonServices: CommonService,
    private location: Location
  ) {
    // Set the minimum to January 1st 20 years in the past and December 31st a year in the future.
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 20, 0, 1);
    this.maxDate = new Date(2100, 11, 31);
  }

  ngOnInit() {
    this.getDepartments();
    this.getUsers();
    // rxjs user list on product change
    this.onProductChangeUsersList();

    this.statusCodes();
  }

  // Rxjs

  onProductChangeUsersList() {
    this.rxjsSub = this.apiServices.userListOnProductChange.subscribe((dat: any) => {

      this.apiServices.getUsersOnTeamOnGnatt(dat).subscribe((data: any) => {
        const isActiveUsers: any[] = [];
        // isActiveUsers = data.data.users;
        data.data.users.forEach(element => {
          if (element.isActive === true) {
            isActiveUsers.push(element.user);
          }
        });

        this.activeUsers = isActiveUsers;
        this.filterValueUser = ['0'];
        this.activeUsers.forEach(element => {
          this.filterValueUser.push(element._id);
        });
        this.selectedGnattUser = ['all'];
        this.statusCodes();
        this.getDepartments();


        //   this.departmentVaraties = data.data.departments.filter((item, i) => (item.slug !== 'all') ? item : null);
        //   this.filterValue = ['0'];
        //   this.departmentVaraties.forEach(element => {
        //     this.filterValue.push(element.slug);
        //   });
        //   this.selectedGnatt = ['all'];
      });

    });
  }

  datePickerChange(event: any) {
    const forDashboardMiletsonestartDate = moment(event._d).format('YYYY-MM-DD').split('-');
    const localStorageMonth = forDashboardMiletsonestartDate[1];
    const localStorageYear = forDashboardMiletsonestartDate[0];

    this.fromDatePicker(localStorageMonth, localStorageYear);
  }

  fromDatePicker(m: any, y: any) {
    this.initNumberOfDaysAndDayWidth();
    this.inputData = null;
    this.showGnattData = false;
    this.startDate["month"] = `${Number(m)}`;
    this.startDate["year"] = `${Number(y)}`;
    const month = moment(this.startDate.year + '-' + this.startDate.month + '-' + '01' + ' 00:00:00');
    const apiDates = {
      startDate: month.startOf("month").format("YYYY-MM-DD"),
      endDate: month.endOf("month").format("YYYY-MM-DD")
    };
    const forDashboardMiletsonestartDate = moment(apiDates.startDate).format('YYYY-MM-DD').split('-');
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

    this.apiServices.firstProductMapping.next(apiDates);
  }

  ACLAccess() {
    let ACLArr;
    if (JSON.parse(localStorage.getItem('productAccess')).ACLaccess.milestone) {
      ACLArr = JSON.parse(localStorage.getItem('productAccess')).ACLaccess.milestone.toString();
      ACLArr = ACLArr.split(',');
      this.ACL = {
        list: "",
        edit: "",
        get: "",
        create: "",
        delete: ""
      };
      ACLArr.forEach(element => {
        if (element.includes("list:")) {
          this.ACL.list = element.replace(/^list:/gi, "");
        }
        if (element.includes("edit:")) {
          this.ACL.edit = element.replace(/^edit:/gi, "");
        }
        if (element.includes("get:")) {
          this.ACL.get = element.replace(/^get:/gi, "");
        }
        if (element.includes("create:")) {
          this.ACL.create = element.replace(/^create:/gi, "");
        }
        if (element.includes("delete:")) {
          this.ACL.delete = element.replace(/^delete:/gi, "");
        }
      });
    }
  }

  // Open dailog
  openDialog() {
    let dialogDetails: IModalInfo;
    let pageContent;

    pageContent =
      "No Milestones Available in this Product. <br><br> You can create one in Dashboard or Select a Different Product.";
    dialogDetails = {
      iconName: "error",
      showCancel: false,
      content: pageContent,
      buttonText: "Okay"
    };

    /**
     * Dialog modal window
     */
    // tslint:disable-next-line: one-variable-per-declaration
    const dialogRef = this.dialog.open(ModalInfoWithbuttonComponent, {
      width: "600px",
      height: "290px",
      data: dialogDetails
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Empty form field
        // back to Dashboard page
      }
    });
  }

  // For Editing the MileStone
  editTab(milestoneId, deptName?: any) {
    event.stopPropagation();
    // tslint:disable-next-line: no-unused-expression
    this.route.navigate([`/p/${JSON.parse(localStorage.getItem('productAccess')).productId.toString()}/m/${milestoneId}/view`]);
  }

  // For Editing the MileStone
  editTabs(milestoneId, deptName?: any) {
    event.stopPropagation();
    this.route.navigate([`/p/${JSON.parse(localStorage.getItem('productAccess')).productId.toString()}/m/${milestoneId}/s`]);
    this.apiServices.navigateToSprint.next(milestoneId);
  }
  viewDependency(milestoneId, deptName?: any) {
    event.stopPropagation();
    this.route.navigate([`/p/${JSON.parse(localStorage.getItem('productAccess')).productId.toString()}/m/${milestoneId}/view`]);
  }
  commentTab(milestoneId) {
    event.stopPropagation();
    localStorage.setItem('comments', 'Milestone');
    this.route.navigate([`/p/${JSON.parse(localStorage.getItem('productAccess')).productId.toString()}/m/${milestoneId}/comments`]);
  }

  // ngAfterViewInit() {
  //   console.log('NgAfterviewinit');
  //   this.showGnattData = false;
  //   this.initFun();
  // }
  ngOnChanges() {
    // console.log('Ngonchanges');
    // console.log(this.inputData);
    if (!this.inputData) {
      this.inputData = [];
      this.unDefined = true;
    } else {
      this.unDefined = false;
    }
    this.showGnattData = false;
    this.initFun();
    this.ACLAccess();
    this.weekData = this.calculateFun();
    this.disableLeftIcon = false;
    this.disableRightIcon = false;
    this.dateRestriction();
  }

  dateRestriction() {
    if (`${JSON.parse(localStorage.getItem('productAccess')).Month.toString()}` === '12' && `${JSON.parse(localStorage.getItem('productAccess')).Year.toString()}` === '2100') {
      this.disableRightIcon = true;
    }
    if (`${JSON.parse(localStorage.getItem('productAccess')).Month.toString()}` === '01' && `${JSON.parse(localStorage.getItem('productAccess')).Year.toString()}` === '2000') {
      this.disableLeftIcon = true;
    }
  }

  initFun() {
    // setTimeout(() => {
    this.weeksInMonthCount = Number(
      this.weeksInMonthFun(
        Number(this.startDate.year.replace("px", '')),
        Number(this.startDate.month.replace("px", ''))
      )
    );
    if (this.inputData && this.inputData.length === 0) {
      this.showDefault = true;
      this.ganduChart = `${(window.innerWidth / 100) * 90}px`;
      const cellWidthCalc = () => {
        // const WeekCalcy = Number(this.startDate.date) > 29 ? 5 : 4;
        // const weekWidth =
        //   Number(this.ganduChart.replace(/px/gi, "")) / WeekCalcy;
        // let day = new Date();

        const numberofDays =
          Number(this.ganduChart.replace("px", "")) /
          Number(
            moment(
              `${JSON.parse(localStorage.getItem('productAccess')).Month.toString()}-${JSON.parse(localStorage.getItem('productAccess')).Year.toString()}`,
              "MM-YYYY"
            ).daysInMonth()
          );
        const weekWidth = numberofDays;
        return `${weekWidth}px`;
      };
      const dayWidthCalc = () => {
        const numberofDays =
          Number(this.ganduChart.replace("px", "")) /
          Number(
            moment(
              `${JSON.parse(localStorage.getItem('productAccess')).Month.toString()}-${JSON.parse(localStorage.getItem('productAccess')).Year.toString()}`,
              "MM-YYYY"
            ).daysInMonth()
          );
        // const dayCalc = `${Number(this.cellWidth.replace(/px/gi, "")) / 7}px`;
        return numberofDays + "px";
      };
      // cell width refers to week width
      this.cellWidth = cellWidthCalc();
      // day width refers to day with
      this.dayWidth = dayWidthCalc();
      this.startDate = {
        date: "1",
        month: JSON.parse(localStorage.getItem('productAccess')).Month.toString(),
        year: JSON.parse(localStorage.getItem('productAccess')).Year.toString()
      };
    }
    // }, 0);
    if (this.inputData && this.inputData.length === 0) {
      // this.openDialog();
      this.showEmpty = true;
    } else {
      this.showEmpty = false;
    }
    if (this.inputData) {
      setTimeout(() => {
        this.startDate = {
          date: this.inputData[0]
            ? this.inputData[0][0]["startDate"]["date"]
            : "",
          month: JSON.parse(localStorage.getItem('productAccess')).Month.toString(),
          year: JSON.parse(localStorage.getItem('productAccess')).Year.toString()
        };
        this.ganduChart = `${(window.innerWidth / 100) * 90}px`;
        const cellWidthCalc = () => {
          const WeekCalcy = Number(this.startDate.date) > 29 ? 5 : 4;
          const weekWidth =
            Number(this.ganduChart.replace(/px/gi, "")) / WeekCalcy;
          return `${weekWidth}px`;
        };
        // const dayWidthCalc = () => {
        //   const dayCalc = `${Number(this.cellWidth.replace(/px/gi, "")) / 7}px`;
        //   return dayCalc;
        // };
        // cell width refers to week width
        // this.cellWidth = cellWidthCalc();
        // day width refers to day with
        // this.dayWidth = dayWidthCalc();
        // converting data for inputData
        // let tempAssigneeArray: string[] = [];
        this.inputData = this.inputData.map(items => {
          let date1;
          let date2;
          // tslint:disable-next-line: max-line-length

          return items.map(item => {
            // this.selectedLocalValue = [...this.selectedLocalValue, ...item.assignedTo.map((ele) => ele._id)];
            // if (Number(JSON.parse(localStorage.getItem('productAccess')).Month.toString()) > item['startDate']['month']) {
            // tslint:disable-next-line: max-line-length
            // if (Number(JSON.parse(localStorage.getItem('productAccess')).Month.toString()) > item['startDate']['month']) {
            // tslint:disable-next-line: max-line-length
            if (
              moment(
                `${JSON.parse(localStorage.getItem('productAccess')).Month.toString()}/${JSON.parse(localStorage.getItem('productAccess')).Year.toString()}`,
                "M/YYYY"
              ).isAfter(
                moment(
                  `${item["startDate"]["month"]}/${item["startDate"]["year"]}`,
                  "M/YYYY"
                )
              )
            ) {
              this.showStartDate = true;
              date1 = `${Number(JSON.parse(localStorage.getItem('productAccess')).Month)}/${
                item.startDate["date"]
                }/${item["startDate"]["year"]}`;
              //            date1 = `${item['startDate']['month']}/${item['startDate']['date']}/${item['startDate']['year']}`;
            } else {
              this.showStartDate = false;
              date1 = `${item["startDate"]["month"]}/${item["startDate"]["date"]}/${item["startDate"]["year"]}`;
            }
            // if (item['endDate']['month'] > Number(JSON.parse(localStorage.getItem('productAccess')).Month.toString())) {
            // tslint:disable-next-line: max-line-length
            if (
              moment(
                `${JSON.parse(localStorage.getItem('productAccess')).Month.toString()}/${JSON.parse(localStorage.getItem('productAccess')).Year.toString()}`,
                "M/YYYY"
              ).isBefore(
                moment(
                  `${item["endDate"]["month"]}/${item["endDate"]["year"]}`,
                  "M/YYYY"
                )
              )
            ) {
              date2 = `${Number(
                JSON.parse(localStorage.getItem('productAccess')).Month
              )}/${moment().daysInMonth()}/${Number(
                JSON.parse(localStorage.getItem('productAccess')).Year
              )}`;
              //            date2 = `${item['endDate']['month']}/${item['endDate']['date']}/${item['endDate']['year']}`;
            } else {
              date2 = `${item["endDate"]["month"]}/${item["endDate"]["date"]}/${item["endDate"]["year"]}`;
            }

            // for defining width for the widget
            // item["width"] = `${this.dateCalculate(date1, date2) *
            //   Number(this.dayWidth.replace(/px/gi, "")) -
            //   Number(this.dayWidth.replace(/px/gi, "")) +
            //   Number(String(this.dayWidth).replace('px', ''))}px`;
            // for defining where it should stay on the chart
            /**
             * for definig where to start the widget
             */
            if (this.showStartDate === true) {
              item["marginLeft"] = `${Number(
                this.dayWidth.replace(/px/gi, "")
              ) *
                1 -
                Number(this.dayWidth.replace(/px/gi, ""))}px`;
              //            item['width'] = `${(date2.split('/')[1]) * Number(this.dayWidth.replace(/px/gi, '')) - Number(this.dayWidth.replace(/px/gi, ''))}px`;
              item["width"] = `${date2.split("/")[1] *
                Number(this.dayWidth.replace(/px/gi, "")) -
                Number(this.dayWidth.replace(/px/gi, "")) +
                Number(String(this.dayWidth).replace('px', ''))}px`;
            } else {
              if (moment(`${JSON.parse(localStorage.getItem('productAccess')).Year.toString()}-${JSON.parse(localStorage.getItem('productAccess')).Month.toString()}`, "YYYY-MM").daysInMonth() === 31) {
                // for defining width for the widget
                item["width"] = `${this.dateCalculate(date1, date2) *
                  Number(this.dayWidth.replace(/px/gi, "")) -
                  Number(this.dayWidth.replace(/px/gi, "")) +
                  (Number(String(this.dayWidth).replace('px', '')) * 2)}px`;
                item["marginLeft"] = `${Number(
                  this.dayWidth.replace(/px/gi, "")
                ) *
                  Number(item.startDate["date"])
                  - Number(this.dayWidth.replace(/px/gi, ""))
                  }px`;
              }
              if (moment(`${JSON.parse(localStorage.getItem('productAccess')).Year.toString()}-${JSON.parse(localStorage.getItem('productAccess')).Month.toString()}`, "YYYY-MM").daysInMonth() === 30) {
                // for defining width for the widget
                item["width"] = `${this.dateCalculate(date1, date2) *
                  Number(this.dayWidth.replace(/px/gi, "")) -
                  Number(this.dayWidth.replace(/px/gi, "")) +
                  (Number(String(this.dayWidth).replace('px', '')))}px`;
                item["marginLeft"] = `${Number(
                  this.dayWidth.replace(/px/gi, "")
                ) *
                  Number(item.startDate["date"])
                  - Number(this.dayWidth.replace(/px/gi, ""))
                  }px`;
              }
              if (moment(`${JSON.parse(localStorage.getItem('productAccess')).Year.toString()}-${JSON.parse(localStorage.getItem('productAccess')).Month.toString()}`, "YYYY-MM").daysInMonth() === 29) {
                // for defining width for the widget
                item["width"] = `${this.dateCalculate(date1, date2) *
                  Number(this.dayWidth.replace(/px/gi, "")) -
                  Number(this.dayWidth.replace(/px/gi, ""))}px`;
                item["marginLeft"] = `${Number(
                  this.dayWidth.replace(/px/gi, "")
                ) *
                  Number(item.startDate["date"])
                  - Number(this.dayWidth.replace(/px/gi, ""))
                  }px`;
              }
              if (moment(`${JSON.parse(localStorage.getItem('productAccess')).Year.toString()}-${JSON.parse(localStorage.getItem('productAccess')).Month.toString()}`, "YYYY-MM").daysInMonth() === 28) {
                // for defining width for the widget
                item["width"] = `${this.dateCalculate(date1, date2) *
                  Number(this.dayWidth.replace(/px/gi, "")) -
                  Number(this.dayWidth.replace(/px/gi, "")) -
                  (Number(String(this.dayWidth).replace('px', '')))}px`;
                item["marginLeft"] = `${Number(
                  this.dayWidth.replace(/px/gi, "")
                ) *
                  Number(item.startDate["date"])
                  - Number(this.dayWidth.replace(/px/gi, ""))
                  }px`;
              }
            }
            this.showGnattData = true;
            console.log(this.inputData);

            return item;
          });
        });
        this.staticInputData = this.inputData;
      }, 0);
    }
    this.initNumberOfDaysAndDayWidth();

  }

  numberToArr(num: number) {
    const arr = Array(num)
      .fill(0)
      .map((x, i) => i);
    return arr;
  }

  calculateFun() {
    let resultData = [];
    let endYear = 2100
    for (let startYear = 2000; startYear <= endYear; startYear++) {
      let firstIn = startYear;
      let yearRow = [];
      let monthArr = [];
      yearRow.push(firstIn)
      for (var i = 1; i <= 12; i++) {
        let days = moment(`${startYear}-${i}`, "YYYY-MM").daysInMonth()
        monthArr.push(days)
      }
      yearRow.push(monthArr)
      resultData.push(yearRow)
    }
    return resultData
  }

  daysToWeeks(num: number) {
    // const weka = Math.floor(num / 7);
    // const reminder = num % 7 > 0 ? 1 : 0;
    // return weka + reminder;
    // const weeks = moment(`${this.startDate.month}-${this.startDate.year}`,"MM-YY").
    return 0;
  }

  datysFinder() {
    const monthData = [];
    const curentDate = new Date();
    curentDate.setFullYear(curentDate.getFullYear() + 5);
    for (let year = 2000; year <= curentDate.getFullYear(); year++) {
      const d = [];
      for (let month = 1; month <= 12; month++) {
        const date = new Date(year, month, 0).getDate();
        d.push(date);
      }
      const y = [year, d];
      monthData.push(y);
    }
  }

  weeksInMonthFun(year: any, month: any) {
    let y = year || this.startDate.year;
    let m = month || this.startDate.month;

    let date = new Date(y, m - 1, 1);
    let day = date.getDay();
    let numDaysInMonth = new Date(y, m, 0).getDate();
    return Math.ceil((numDaysInMonth + day) / 7);
    // return weeksInMonth;
  }

  weakFromTo(n: any, m: any, y: any) {
    let arrayItem = [];
    let date = new Date();
    date.setMonth(m);
    date.setFullYear(y);
    const weeksInMonth = this.weeksInMonthFun(y, m);
    // let lastDate =
    let startDate: string = "";
    let endDate: string = "";
    let value = "";
    for (let i = 0; i < weeksInMonth; i++) {
      let dayCount = 7;
      startDate = `${moment(`01-${m}-${y}`, "DD-MM-YYYY").format(
        "MMM"
      )} ${moment(`01-${m}-${y}`, "DD-MM-YYYY")
        .add("weeks", i)
        .startOf("week")
        .format("DD")}`;
      endDate = `${moment(`01-${m}-${y}`, "DD-MM-YYYY").format("MMM")} ${moment(
        `01-${m}-${y}`,
        "DD-MM-YYYY"
      )
        .add("weeks", i)
        .endOf("week")
        .format("DD")}`;
      let lastItem = weeksInMonth - 1;
      if (i == 0) {
        startDate = `${moment(`01-${m}-${y}`, "DD-MM-YYYY").format(
          "MMM"
        )}  ${moment(`01-${m}-${y}`, "DD-MM-YYYY")
          .startOf("month")
          .format("DD")}`;
        let star = moment(`01-${m}-${y}`, "DD-MM-YYYY")
          .startOf("month")
          .format("DD");
        let calc = Number(endDate.split(" ")[1]) - Number(star) + 1;
        dayCount = calc;
      }

      let dateOne = moment(`01-${m}-${y}`, "DD-MM-YYYY")
        .add("weeks", i)
        .startOf("week")
        .format("DD");
      let dateTwo = moment(`01-${m}-${y}`, "DD-MM-YYYY")
        .add("weeks", i)
        .endOf("week")
        .format("DD");

      if (i != 0) {
        if (dateOne > dateTwo) {
          endDate = `${moment(`${m}-${y}`, "MM-YYYY").format("MMM")} ${moment(
            `01-${m}-${y}`,
            "DD-MM-YYYY"
          )
            .endOf("month")
            .format("DD")}`;
          value = `${startDate} - ${endDate}`;
        }
      }
      value = `${startDate} - ${endDate}`;
      arrayItem.push({
        dayCount: dayCount == 0 ? 1 : dayCount,
        value
      });
    }

    let start = String(
      arrayItem[arrayItem.length - 1].value.split(" - ")[0]
    ).split(" ")[1];
    // let end = String(arrayItem[arrayItem.length-1].value.split(" - ")[1]).split(' ')[1];
    if (Number(start) < 20) {
      arrayItem.splice(arrayItem.length - 1, 1);
    }
    let forLastAdd = arrayItem[arrayItem.length - 1].value.split(" - ");
    let leftPart = forLastAdd[0].split(/ /g)[1];
    let rightPart = forLastAdd[1].split(/ /g)[1];

    let lastCalc = rightPart - leftPart == 0 ? 1 : rightPart - leftPart;
    arrayItem[arrayItem.length - 1].dayCount = leftPart === rightPart ? 1 : lastCalc + 1;
    return arrayItem[n];
  }

  // showCondition(m, y) {
  //   // let month = m;
  //   // let year = y;
  //   // if (
  //   //   month+1 === this.startDate['month'] ||
  //   //   month-1 === this.startDate['month'] ||
  //   //   month === this.startDate['month']
  //   //   ) {

  //   // }
  //   return true
  // }

  forOneDay(str: string) {
    let calc = str.split(/ - /);
    if (calc[0].replace(/ /g, '') === calc[1].replace(/ /g, '')) {
      let value = str.replace(/-/, '');
      return value;
    }
    return str;
  }

  numberOfDaysInThisMonth() {
    let m = this.startDate.month;
    let y = this.startDate.year;
    let date = moment(`${m}-${y}`, "MM-YY").daysInMonth();
    return date;
  }

  initNumberOfDaysAndDayWidth() {
    const m = this.startDate.month;
    const y = this.startDate.year;
    const totalDays = moment(`${m}-${y}`, "MM-YY").daysInMonth()
    // this.ganduChart = (window.innerWidth / 100) * 90 + "px";
    this.dayWidth = String(Number(this.ganduChart.replace('px', '')) / totalDays) + "px";
    return this.dayWidth;
  }


  monthSwitchLeft(m: number, y: number) {
    this.initNumberOfDaysAndDayWidth();
    this.inputData = null;
    this.showGnattData = false;
    // this.weekData = [];
    // if (y >= 2019) {
    if (m > 1) {
      this.startDate["month"] = `${Number(this.startDate["month"]) - 1}`;
    } else {
      this.startDate["month"] = `12`;
      // if (y > 2019) {
      this.startDate["year"] = `${Number(this.startDate["year"]) - 1}`;
      // }
    }
    const month = moment(this.startDate.year + '-' + this.startDate.month + '-' + '01' + ' 00:00:00');
    const apiDates = {
      startDate: month.startOf("month").format("YYYY-MM-DD"),
      endDate: month.endOf("month").format("YYYY-MM-DD")
    };
    const forDashboardMiletsonestartDate = moment(apiDates.startDate).format('YYYY-MM-DD').split('-');
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

    this.apiServices.firstProductMapping.next(apiDates);
    // }
  }


  currentWeekHighlight(week: string) {
    let weekValue = week.split(/ - /);
    let firstDay = weekValue[0];
    let machinDate = new Date();
    let date = moment(`${machinDate.getDate()}-${machinDate.getMonth() + 1}-${machinDate.getFullYear()}`, "DD-MM-YYYY");
    let result = date.startOf("week").format("MM DD").split(' ');
    let month = this.months[Number(result[0])];
    let finalResult = `${month} ${result[1]}`;
    if (firstDay == finalResult) {
      return 'curent-week';
    }
  }

  monthSwitchRight(m: any, y: any) {
    this.initNumberOfDaysAndDayWidth();
    this.inputData = null;
    this.showGnattData = false;
    const da = new Date();
    da.setFullYear(da.getFullYear() + 4);
    if (y <= Number(da)) {
      if (m <= 11) {
        this.startDate["month"] = `${Number(this.startDate["month"]) + 1}`;
      } else {
        this.startDate["month"] = `${1}`;
        this.startDate["year"] = `${Number(this.startDate["year"]) + 1}`;
      }

      const month = moment(this.startDate.year + '-' + this.startDate.month + '-' + '01' + ' 00:00:00');

      const apiDates = {
        startDate: month
          .startOf("month")
          .format("YYYY-MM-DD")
          .toString(),
        endDate: month
          .endOf("month")
          .format("YYYY-MM-DD")
          .toString()
      };
      const forDashboardMiletsonestartDate = moment(apiDates.startDate).format('YYYY-MM-DD').split('-');
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

      this.apiServices.firstProductMapping.next(apiDates);
    }
  }

  dateCalculate(d1, d2) {
    let date1 = new Date(d1);
    let date2 = new Date(d2);

    // To calculate the time difference of two dates
    let Difference_In_Time = date2.getTime() - date1.getTime();

    // To calculate the no. of days between two dates
    let Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

    // To display the final no. of days (result)
    return Difference_In_Days;
  }

  lengthCalc(start: number, end: number) {
    const cal = end - start;
  }

  numberOfDays(year, month) {
    return new Date(year, month, 0).getDate();
  }

  // Added sridhar
  addTask() {
    this.route.navigate([`/p/${JSON.parse(localStorage.getItem('productAccess')).productId.toString()}/m/add`]);
  }
  // Added

  createMonthNumber(data: any) {
    return Number(data);
  }

  showHideClassBasedOnPosition(position: any, width: any) {
    let totalWidth = Number(this.ganduChart.replace("px", ""));
    let itemPosition = Number(position.replace("px", ""));
    let itemWidth = Number(width.replace("px", ""));
    let calc1 = itemPosition + itemWidth;
    let calc2 = totalWidth - calc1;

    if (Number(width.replace("px", "")) < 200) {
      // -57.5
      if (calc2 > 300) {
        return " hover-expand-class";
      } else {
        return " min-width-size";
      }
    } else {
      return " hover-expand-class";
    }
  }

  recalculateMarginLeft(marginLeft: string, width: string) {
    let trimmedMargin = Number(marginLeft.replace(/px/g, ''));
    let trimmedWidth = Number(width.replace(/px/g, ''));
  }

  curentDateHighlight(inDate) {
    let date = new Date().getDate();
    let month = new Date().getMonth();
    if (inDate + 1 == date) {
      if (Number(this.startDate["month"]) == month + 1) {
        if (Number(this.startDate["year"]) == new Date().getFullYear()) {
          return " curent-Date";
        }
        return "";
      }
      return "";
    }
    return "";
  }

  weekWidth(itm: any) {
    return itm * Number(this.dayWidth.replace("px", "")) + "px";
  }

  // get Dept's

  getDepartments() {
    this.apiServices.getDepartments().subscribe((data: any) => {
      this.departmentVaraties = data.data.departments.filter((item, i) => (item.slug !== 'all') ? item : null);
      this.filterValue = ['0'];
      this.departmentVaraties.forEach(element => {
        this.filterValue.push(element.slug);
      });
      this.selectedGnatt = ['all'];
    });
  }

  filterChange(val) {
    if (!val.includes('0') && val.length === this.departmentVaraties.length) {
      this.filterValue = [];
    } else {
      this.filterValue = ['0'];
      this.departmentVaraties.forEach(element => {
        this.filterValue.push(element.slug);
      });
    }
  }

  filterSelectionChange(val) {
    if (val.includes('0') && val.length === this.departmentVaraties.length) {
      this.filterValue = this.filterValue.filter((data, i) => (data !== '0'));
    }
  }

  tooltipName(arr: any[]) {
    arr = arr.filter((item, i) => i !== 0);
    return arr.map((item) => item.firstName + ' ' + item.lastName).toString();
  }
  filterSelectionChangeUser(val) {

    if (val.includes('0') && val.length === this.activeUsers.length) {
      this.filterValueUser = this.filterValueUser.filter((data, i) => (data !== '0'));
    }

    if (this.unSelectAll && !val.includes('0') && val.length === this.activeUsers.length) {
      this.EmittedFilterArray.emit(this.filterValueUser);
    } else {

      this.EmittedFilterArray.emit(this.filterValueUser);
    }

    let tempInputData: any[] = [];

    this.staticInputData.forEach(element => {
      element.forEach((ele, i) => {
        // console.log(ele);

        ele.assignedTo.forEach((assign) => {
          if (this.filterValueUser.includes(assign._id)) {
            // console.log('bb', bb);
            tempInputData.push(ele);
          }
        });
        // ele = ele.assignedTo.filter(assign => val.includes(assign._id));
        // console.log('ele', ele);


      });
    });

    // return this.inputData;
    // this.inputData = this.inputData;
    // console.log('ele', this.inputData);
    // matFilter()
  }

  matFilter(assignee: any[]) {
    let assigneeMap = assignee.map((items) => {
      if (this.selectedLocalValue.includes(items._id)) {
        return items;
      }
    });
    // console.log(assigneeMap);
    return assignee;
  }

  // Status codes
  statusCodes() {
    this.statusCodeArr = [
      { name: 'To-do', status: 'to-do' },
      { name: 'In-progress', status: 'in-progress' },
      { name: 'Done', status: 'done' },
    ];

    this.filterValueCode = ['0'];
    this.statusCodeArr.forEach(element => {
      this.filterValueCode.push(element.status);
    });
  }
  filterSelectionChangeCode(val) {
    if (val.includes('0') && val.length === this.statusCodeArr.length) {
      this.filterValueCode = this.filterValueCode.filter((data, i) => (data !== '0'));
    }
  }

  filterChangeCode(val) {
    console.log(val);
    if (!val.includes('0') && val.length === this.statusCodeArr.length) {
      this.filterValueCode = [];
    } else {
      this.filterValueCode = ['0'];
      this.statusCodeArr.forEach(element => {
        this.filterValueCode.push(element.status);
      });
    }

  }


  filterChangeUser(val, oSelected) {
    this.unSelectAll = false;
    if (oSelected === '0' && !val.includes('0') && val.length === this.activeUsers.length) {
      this.filterValueUser = [];
      this.EmittedFilterArray.emit(this.filterValueUser);
    } else {
      this.filterValueUser = ['0'];
      this.activeUsers.forEach(element => {
        this.filterValueUser.push(element._id);
      });
    }
    this.unSelectAll = false;
  }


  // get Users
  getUsers() {
    this.apiServices.getUsersOnTeam().subscribe((data: any) => {
      const isActiveUsers: any[] = [];
      // isActiveUsers = data.data.users;
      data.data.users.forEach(element => {
        if (element.isActive === true) {
          isActiveUsers.push(element.user);
        }
      });

      this.activeUsers = isActiveUsers;
      this.filterValueUser = ['0'];
      this.activeUsers.forEach(element => {
        this.filterValueUser.push(element._id);
      });
      this.selectedGnattUser = ['all'];



      //   this.departmentVaraties = data.data.departments.filter((item, i) => (item.slug !== 'all') ? item : null);
      //   this.filterValue = ['0'];
      //   this.departmentVaraties.forEach(element => {
      //     this.filterValue.push(element.slug);
      //   });
      //   this.selectedGnatt = ['all'];
    });
  }

  ngOnDestroy() {
    this.rxjsSub ? this.rxjsSub.unsubscribe() : '';
  }


}

interface InputData {
  title?: string;
  startDate: DateObj;
  endDate: DateObj;
  type: string;
  status?: string;
  description?: string;
  img?: string;
  widht?: string;
}

interface DateInterface {
  date: number;
  month: any;
  monthStr: string;
  year: number;
}

interface DateObj {
  date: string;
  month: string;
  year: string;
}
