import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';

import { CircleTimerComponent } from '@flxng/circle-timer';

@Component({
  selector: 'app-overview-c',
  templateUrl: './overview-c.component.html',
  styleUrls: ['./overview-c.component.scss'],
})
export class OverviewCComponent implements OnInit, AfterViewInit {
  @ViewChild('timer', { static: true }) timer: CircleTimerComponent;

  startDate = Date.now() - (10 * 60 * 60 * 1000); // minus 10 hours

  constructor() {}

  ngOnInit() {}

  ngAfterViewInit(): void {
    this.timer.start(this.startDate);
  }

  onTimerComplete(): void {
    console.log('timer completed!');
  }
}
