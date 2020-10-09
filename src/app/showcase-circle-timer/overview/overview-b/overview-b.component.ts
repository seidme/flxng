import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';

import { CircleTimerComponent } from '@flxng/circle-timer';

@Component({
  selector: 'app-overview-b',
  templateUrl: './overview-b.component.html',
  styleUrls: ['./overview-b.component.scss'],
})
export class OverviewBComponent implements OnInit, AfterViewInit {
  @ViewChild('timer', { static: true }) timer: CircleTimerComponent;

  startDate = Date.now() - (15 * 1000); // minus 15 seconds

  constructor() {}

  ngOnInit() {}

  ngAfterViewInit(): void {
    this.timer.start(this.startDate);
  }

  onTimerComplete(): void {
    console.log('timer completed!');
  }
}
