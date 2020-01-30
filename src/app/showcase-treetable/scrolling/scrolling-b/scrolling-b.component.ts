import { Component, OnInit } from '@angular/core';
import { ShowcaseTreetableService, Log } from 'app/showcase-treetable/showcase-treetable.service';

@Component({
  selector: 'flx-scrolling-b',
  templateUrl: './scrolling-b.component.html',
  styleUrls: ['./scrolling-b.component.scss']
})
export class ScrollingBComponent implements OnInit {
  logs: Log[];

  constructor(private _service: ShowcaseTreetableService) {}

  ngOnInit() {
    this.logs = this._service.generateLogs(2);
  }
}
