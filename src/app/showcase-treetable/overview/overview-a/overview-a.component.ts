import { Component, OnInit } from '@angular/core';

export interface Log {
  id: string | number;
  createdDate: string;
  status: number;
  message: string;
  children?: Log[];
}

@Component({
  selector: 'flx-overview-a',
  templateUrl: './overview-a.component.html',
  styleUrls: ['./overview-a.component.scss']
})
export class OverviewAComponent implements OnInit {
  logs: Log[];

  constructor() {}

  ngOnInit() {
    this.initLogs();
  }

  generateLogs(qty: number, level = 0): Log[] {
    let logs: Log[] = [];

    for (let i = 1; i <= qty; ++i) {
      logs.push({
        id: level > 0 ? level + '.' + (i + 1) : i + 1,
        createdDate: new Date(new Date().getTime() - i).toISOString(),
        status: i % 2 === 0 ? 200 : 400,
        message: i % 4 === 0 ? 'A' : 'B'
      });
    }

    return logs;
  }

  onShowOnlyErrorLogs(event: any): void {
    if (event.target.checked) {
      this.logs = this.logs.filter(log => log.status === 400);
    } else {
      this.initLogs();
    }
  }

  initLogs(): void {
    this.logs = this.generateLogs(100, 0);

    this.logs[1].children = this.generateLogs(5, 1);
    this.logs[5].children = this.generateLogs(3, 1);
    this.logs[40].children = this.generateLogs(3, 1);

    this.logs[1].children[2].children = this.generateLogs(5, 2);

    this.logs[1].children[2].children[3].children = this.generateLogs(5, 3);
  }
}
