import {
  Component,
  Inject,
  ContentChildren,
  QueryList,
  Output,
  Input,
  OnInit,
  AfterContentInit,
  forwardRef,
} from '@angular/core';

import { TemplateDirective } from '@flxng/common';
import { mapToIterable } from '@flxng/common';

import { PaginationTemplates } from './pagination-templates';

@Component({
  selector: 'flx-pagination',
  template: ``,
})
export class PaginationComponent implements OnInit, AfterContentInit {
  @Input() itemsPerPage = 10;
  @Input() itemsPerPageOptions = [5, 10, 20, 50, 100];
  @Input() pageLinksSize = 7;

  @Input() templateRefs: any = {};

  @ContentChildren(TemplateDirective) templateList: QueryList<TemplateDirective>;

  constructor() {}

  ngOnInit() {}

  ngAfterContentInit() {
    this._collectTemplateRefs();
  }

  private _collectTemplateRefs(): void {
    this.templateList.toArray().forEach((t: TemplateDirective) => {
      if (!PaginationTemplates[t.type]) {
        console.warn(
          `Unknown template type: ${t.type}. Possible value/s: ${mapToIterable(PaginationTemplates).join(', ')}.`
        );
        return;
      }

      this.templateRefs[t.type] = t.templateRef;
    });
  }
}
