import { Component, OnInit } from '@angular/core';

export interface Log {
  id: string | number;
  createdDate: string;
  status: number;
  message: string;
  children?: Log[];
}

@Component({
  selector: 'flx-scrolling-a',
  templateUrl: './scrolling-a.component.html',
  styleUrls: ['./scrolling-a.component.scss']
})
export class ScrollingAComponent implements OnInit {
  logs: Log[];

  constructor() {}

  ngOnInit() {
    this.logs = this.generateLogs(10);
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
}
