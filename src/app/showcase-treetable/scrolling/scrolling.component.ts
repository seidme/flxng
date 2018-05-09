import { Component, OnInit } from '@angular/core';

import { ShowcaseTreetableService, Log } from '../showcase-treetable.service';

@Component({
  selector: '',
  templateUrl: './scrolling.component.html',
  styleUrls: ['./scrolling.component.scss']
})
export class ScrollingComponent implements OnInit {

  logs: Log[];

  content: any;

  constructor(
    private _service: ShowcaseTreetableService
  ) { }

  ngOnInit(): void {
    this.logs = this._service.getGenerateLogs(10);
    //this.logs = [];
  }

  geeet() {
    return this._service.getGhFileContent("https://raw.githubusercontent.com/primefaces/primeng/master/src/app/showcase/components/treetable/datatablesortdemo.ts").subscribe(
      c => {
        console.log(c);
        this.content = c;
      },
      error => {
        console.log('error: ', error);
      });
  }

}
