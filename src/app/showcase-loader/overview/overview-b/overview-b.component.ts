import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';

import { LoaderDirective } from '@flxng/loader';

@Component({
  selector: 'app-overview-b',
  templateUrl: './overview-b.component.html',
  styleUrls: ['./overview-b.component.scss'],
})
export class OverviewBComponent implements OnInit {
  @ViewChildren(LoaderDirective) loaders: QueryList<LoaderDirective>;

  loadables = [
    { id: 1, loaded: false, timeout: 3000 },
    { id: 2, loaded: false, timeout: 1000 },
    { id: 3, loaded: false, timeout: 2000 },
  ];

  constructor() {}

  ngOnInit() {}

  load(): void {
    this.loadables.forEach((loadable, i) => {
      this.loaders.toArray()[i].show();

      setTimeout(() => {
        loadable.loaded = true;
        this.loaders.toArray()[i].hide();
      }, loadable.timeout);
    });
  }

  reset(): void {
    this.loadables.forEach((loadable, i) => {
      loadable.loaded = false;
    });
  }

  allLoaded(): boolean {
    return !this.loadables.find((loadable) => !loadable.loaded);
  }

  anyLoading(): boolean {
    return !!this.loaders && this.loaders.toArray().some((loader) => loader.isVisible());
  }
}
