import { Component, OnInit } from '@angular/core';
import { Router, Event, NavigationEnd, NavigationStart } from '@angular/router';

@Component({
  selector: 'app-gp-login',
  templateUrl: './gp-login.component.html',
  styleUrls: ['./gp-login.component.scss']
})
export class GpLoginComponent implements OnInit {
  currentUrl: string;
  previousUrl: string;

  constructor(private router: Router) { }

  ngOnInit() {

  }


}
