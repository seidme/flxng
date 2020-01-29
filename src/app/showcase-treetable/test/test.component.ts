import { Component, OnInit } from "@angular/core";

import { ShowcaseTreetableService, Log } from '../showcase-treetable.service';

@Component({
  selector: "flx-test",
  templateUrl: "./test.component.html",
  styleUrls: ["./test.component.scss"]
})
export class TestComponent implements OnInit {

    logs: Log[];

    constructor(
        private _service: ShowcaseTreetableService
    ) { }


  ngOnInit() {
    //this.logs = [];

    this.logs = this._service.generateLogs(50);
    this.assignIds(this.logs, 0);

    this.logs[1].children = this._service.generateLogs(10);
    this.assignIds(this.logs[1].children, 1);
    this.logs[5].children = this._service.generateLogs(10);
    this.assignIds(this.logs[5].children, 1);
    this.logs[40].children = this._service.generateLogs(10);
    this.assignIds(this.logs[40].children, 1);
    // this.logs[500].children = this._service.generateLogs(10);
    // this.assignIds(this.logs[500].children, 1);

    this.logs[1].children[2].children = this._service.generateLogs(50);
    this.assignIds(this.logs[1].children[2].children, 2);

    this.logs[1].children[2].children[3].children = this._service.generateLogs(5000);
    this.assignIds(this.logs[1].children[2].children[3].children, 3);

    this.logs[1].children[2].children[3].children[4].children = this._service.generateLogs(100);
    this.assignIds(this.logs[1].children[2].children[3].children[4].children, 4);

    this.logs[1].children[2].children[3].children[4].children[5].children = this._service.generateLogs(100);
    this.assignIds(this.logs[1].children[2].children[3].children[4].children[5].children, 5);

    this.logs[1].children[2].children[3].children[4].children[5].children[6].children = this._service.generateLogs(10);
    this.assignIds(this.logs[1].children[2].children[3].children[4].children[5].children[6].children, 6);

    this.logs[1].children[2].children[3].children[4].children[5].children[6].children[7].children = this._service.generateLogs(10);
    this.assignIds(this.logs[1].children[2].children[3].children[4].children[5].children[6].children[7].children, 7);
  }


  spliiice(): void {
    this.logs.splice(6, this.logs.length-6);
  }


  puuush(): void {
    Array.prototype.push.apply(this.logs, this._service.generateLogs(40));
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
