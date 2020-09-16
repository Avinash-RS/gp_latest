import { Component } from '@angular/core';
import {
  Router, NavigationStart, NavigationEnd,
  NavigationCancel, NavigationError, Event, ResolveEnd
} from '@angular/router';
import { APIService } from './services/api.service';
import { environment } from './../environments/environment';
import { Location } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  BASE_URL = environment.API_BASE_URL;

  title = 'GP';
  showLoadingIndicator = true;
  // public scrollbarOptions = { axis: 'yx', theme: 'minimal-dark' };

  constructor(
    private router: Router,
    public apiServices: APIService,
    private location: Location) {


    this.router.events.subscribe((routerEvent: Event) => {

      // On NavigationStart, set showLoadingIndicator to ture
      if (routerEvent instanceof NavigationStart) {
        if (routerEvent.url.includes('/comments') && !localStorage.getItem('Access_Token')) {
          sessionStorage.setItem('commentUrl', routerEvent.url);
        }
        if (routerEvent.url.includes('/r') && !localStorage.getItem('comments')) {
          localStorage.setItem('comments', 'Sprint');
        }
        if (!routerEvent.url.includes('/r') && routerEvent.url.includes('/comments') && !localStorage.getItem('comments')) {
          localStorage.setItem('comments', 'Milestone');
        }

        this.showLoadingIndicator = true;

        if (routerEvent.url.endsWith('/s')) {
          let a = routerEvent.url.lastIndexOf('/s');
          let b = routerEvent.url.lastIndexOf('/m') + 3;
          let c = routerEvent.url.slice(b, a);
          if (JSON.parse(localStorage.getItem('productAccess')).sprintMilestoneId !== c) {
            localStorage.setItem('scrollDown', 'true');
            localStorage.setItem('sprintRoute', c);
          }
        }
      }
      if (routerEvent instanceof ResolveEnd) {
        if (routerEvent.url === '/login' || routerEvent.url === '/' || routerEvent.url === '/forgot-password' || routerEvent.url === '/password-reset') {
        } else {
          if (!localStorage.getItem('Access_Token')) {
            localStorage.clear();
            this.router.navigate(['/login']);
          }
        }
      }

      // On NavigationEnd or NavigationError or NavigationCancel
      // set showLoadingIndicator to false
      if (routerEvent instanceof NavigationEnd ||
        routerEvent instanceof NavigationError ||
        routerEvent instanceof NavigationCancel) {

        this.showLoadingIndicator = false;
        if (routerEvent.url === '/login' || routerEvent.url === '/' || routerEvent.url === '/forgot-password' || routerEvent.url === '/password-reset') {
        } else {
          if (!localStorage.getItem('Access_Token')) {
            localStorage.clear();
            this.router.navigate(['/login']);
          }
        }


      }
      if (routerEvent instanceof NavigationError) {
        // Hide loading indicator

        // Present error to user
        if (routerEvent.error.message === 'Cannot activate an already activated outlet') {
          localStorage.clear();
          console.clear();
          window.location.pathname = window.location.pathname;
        }
      }


    });
  }
}
