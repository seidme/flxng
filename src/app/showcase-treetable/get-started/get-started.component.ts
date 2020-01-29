import { Component, OnInit, AfterViewInit } from '@angular/core';

import { ShowcaseTreetableService, Log } from '../showcase-treetable.service';

@Component({
  selector: '',
  templateUrl: './get-started.component.html',
  styleUrls: ['./get-started.component.scss']
})
export class GetStartedComponent implements OnInit, AfterViewInit {
  logs: Log[];

  constructor(private _service: ShowcaseTreetableService) {}

  ngOnInit(): void {
    this.logs = this._service.generateLogs(5);
  }

  ngAfterViewInit(): void {
    //this.logs = this._service.generateLogs(200);
  }
}
