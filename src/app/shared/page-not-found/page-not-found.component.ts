import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { APIService } from 'src/app/services/api.service';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss']
})
export class PageNotFoundComponent implements OnInit {

  constructor(private route: Router, private apiServices: APIService) { }

  ngOnInit() {
  }

  dashboard() {
    this.route.navigate(['/']);
  }
  login() {
    this.apiServices.logout().subscribe((data: any) => {
      localStorage.clear();
      this.route.navigate(['/login']);
    });
}
}
