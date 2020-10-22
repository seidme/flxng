import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-overview-a',
  templateUrl: './overview-a.component.html',
  styleUrls: ['./overview-a.component.scss'],
})
export class OverviewAComponent implements OnInit {
  duration = 10 * 1000; // 10 seconds

  constructor() {}

  ngOnInit() {}

  onTimerComplete(): void {
    console.log('timer completed!');
  }
}
