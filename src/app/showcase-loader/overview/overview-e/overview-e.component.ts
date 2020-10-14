import { Component, OnInit, ViewChild } from '@angular/core';

import { LoaderDirective } from '@flxng/loader';

@Component({
  selector: 'app-overview-e',
  templateUrl: './overview-e.component.html',
  styleUrls: ['./overview-e.component.scss'],
})
export class OverviewEComponent implements OnInit {
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
