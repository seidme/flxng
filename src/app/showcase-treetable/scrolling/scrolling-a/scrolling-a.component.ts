import { Component, OnInit } from '@angular/core';

import { ShowcaseTreetableService, Log } from 'app/showcase-treetable/showcase-treetable.service';

@Component({
  selector: 'flx-scrolling-a',
  templateUrl: './scrolling-a.component.html',
  styleUrls: ['./scrolling-a.component.scss']
})
export class ScrollingAComponent implements OnInit {
  logs: Log[];

  constructor(private _service: ShowcaseTreetableService) {}

  ngOnInit() {
    this.logs = this._service.generateLogs(10);
  }
}
