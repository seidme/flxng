import { Component, OnInit } from '@angular/core';

import { ShowcaseTreetableService, Log } from '../showcase-treetable.service';

@Component({
  selector: '',
  templateUrl: './scrolling.component.html',
  styleUrls: ['./scrolling.component.scss']
})
export class ScrollingComponent implements OnInit {
  content: string;

  constructor(private _service: ShowcaseTreetableService) {}

  ngOnInit(): void {}

  geeet() {
    return this._service
      .getGhFileContent(
        'https://raw.githubusercontent.com/seidme/flxng/development/src/app/showcase-treetable/scrolling/scrolling-a/scrolling-a.component.html'
      )
      .subscribe(
        c => {
          console.log(c);
          this.content = c;
        },
        error => {
          console.log('error: ', error);
        }
      );
  }
}
