import { Component, OnInit, ViewChild } from '@angular/core';

import { LoaderDirective } from '@flxng/loader';

@Component({
  selector: 'app-overview-a',
  templateUrl: './overview-a.component.html',
  styleUrls: ['./overview-a.component.scss'],
})
export class OverviewAComponent implements OnInit {
  @ViewChild(LoaderDirective, { static: true }) loader: LoaderDirective;

  loaded = false;

  constructor() {}

  ngOnInit() {}

  load(): void {
    this.loader.show();

    setTimeout(() => {
      this.loaded = true;
      this.loader.hide();
    }, 2000);
  }

  reset(): void {
    this.loaded = false;
  }
}
