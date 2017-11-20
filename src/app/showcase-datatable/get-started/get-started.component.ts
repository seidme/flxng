import { Component, OnInit, AfterViewInit } from '@angular/core';

import { ShowcaseDatatableService, Log } from '../showcase-datatable.service';

@Component({
  selector: '',
  templateUrl: './get-started.component.html',
  styleUrls: ['./get-started.component.scss']
})
export class GetStartedComponent implements OnInit, AfterViewInit {

  logs: Log[];

  constructor(
    private _service: ShowcaseDatatableService
  ) { }

  ngOnInit(): void {
    this.logs = this._service.getGenerateLogs(5);
  }

  ngAfterViewInit(): void {
    //this.logs = this._service.getGenerateLogs(200);
  }

}
