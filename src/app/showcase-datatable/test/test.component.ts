import { Component, OnInit } from "@angular/core";

import { ShowcaseDatatableService, Log } from '../showcase-datatable.service';

@Component({
  selector: "flx-test",
  templateUrl: "./test.component.html",
  styleUrls: ["./test.component.scss"]
})
export class TestComponent implements OnInit {

    logs: Log[];

    constructor(
        private _service: ShowcaseDatatableService
    ) { }


  ngOnInit() {
    //this.logs = [];

    this.logs = this._service.getGenerateLogs(10);
    this.assignIds(this.logs, 0);

    this.logs[1].children = this._service.getGenerateLogs(10);
    this.assignIds(this.logs[1].children, 1);

    this.logs[1].children[2].children = this._service.getGenerateLogs(50);
    this.assignIds(this.logs[1].children[2].children, 2);

    this.logs[1].children[2].children[3].children = this._service.getGenerateLogs(10);
    this.assignIds(this.logs[1].children[2].children[3].children, 3);

    this.logs[1].children[2].children[3].children[4].children = this._service.getGenerateLogs(10);
    this.assignIds(this.logs[1].children[2].children[3].children[4].children, 4);
  }


  spliiice(): void {
    this.logs.splice(6, this.logs.length-6);
  }


  puuush(): void {
    Array.prototype.push.apply(this.logs, this._service.getGenerateLogs(40));
    this.assignIds(this.logs, 0);
  }

  interval(): void {
      setInterval(() => {
          this.logs[0].status = this.logs[0].status + 1;
      }, 500);
  }


  assignIds(logs: Log[], level: number): void {
      logs.forEach((log, i) => {
          log.id = level 
            ? level + '.' +  (i + 1)
            : i + 1;
      });
  }

}
