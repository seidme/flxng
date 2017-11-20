import { Component, OnInit } from '@angular/core';

import { ShowcaseDatatableService, Log } from '../showcase-datatable.service';

@Component({
  selector: '',
  templateUrl: './scrolling.component.html',
  styleUrls: ['./scrolling.component.scss']
})
export class ScrollingComponent implements OnInit {

  logs: Log[];

  content: any;

  constructor(
    private _service: ShowcaseDatatableService
  ) { }

  ngOnInit(): void {
    this.logs = this._service.getGenerateLogs(10);
    //this.logs = [];
  }

  geeet() {
    return this._service.getGhFileContent("https://raw.githubusercontent.com/primefaces/primeng/master/src/app/showcase/components/datatable/datatablesortdemo.ts").subscribe(
      c => {
        console.log(c);
        this.content = c;
      },
      error => {
        console.log('error: ', error);
      });
  }

}
