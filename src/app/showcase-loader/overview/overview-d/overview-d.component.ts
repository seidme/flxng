import { Component, OnInit } from '@angular/core';

import { GlobalLoaderService } from '@flxng/loader';

@Component({
  selector: 'app-overview-d',
  templateUrl: './overview-d.component.html',
  styleUrls: ['./overview-d.component.scss'],
})
export class OverviewDComponent implements OnInit {
  constructor(protected globalLoader: GlobalLoaderService) {}

  ngOnInit() {}

  load(): void {
    this.globalLoader.show();

    setTimeout(() => {
      this.globalLoader.hide();
    }, 2000);
  }
}
