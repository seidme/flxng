import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-overview-c',
  templateUrl: './overview-c.component.html',
  styleUrls: ['./overview-c.component.scss'],
})
export class OverviewCComponent implements OnInit {
  loading = false;
  loaded = false;

  constructor() {}

  ngOnInit() {}

  load(): void {
    this.loading = true;

    setTimeout(() => {
      this.loaded = true;
      this.loading = false;
    }, 2000);
  }

  reset(): void {
    this.loaded = false;
  }
}
