import { Component, OnInit } from '@angular/core';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-gp-loader',
  templateUrl: './gp-loader.component.html',
  styleUrls: ['./gp-loader.component.scss']
})
export class GpLoaderComponent implements OnInit {

  show = false;

  constructor(public loaderService: LoaderService) { }

  ngOnInit() {
  }

}
