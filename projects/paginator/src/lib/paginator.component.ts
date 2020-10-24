import {
  Component,
  ContentChildren,
  QueryList,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  OnInit,
  OnChanges,
  AfterContentInit,
  SimpleChanges,
  Renderer2,
} from '@angular/core';

import { TemplateDirective } from '@flxng/common';
import { mapToIterable } from '@flxng/common';

@Component({
  selector: 'flx-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss'],
})
export class PaginatorComponent implements OnInit, OnChanges, AfterContentInit {
  readonly templateTypes: any = {
    //menuHead: 'menuHead'
  };

  @Input() itemsCount = 0;
  @Input() pageLinksSize = 7;
  @Input() itemsPerPage = 10;
  @Input() itemsPerPageOptions?: number[]; // e.g: [5, 10, 20, 50, 100]
  @Input() currentPage = 1;
  @Input() templateRefs: any = {};

  @Output() onPageChange = new EventEmitter<any>();
  @Output() onItemsPerPageValueChange = new EventEmitter<number>();

  @ContentChildren(TemplateDirective) templateList: QueryList<TemplateDirective>;

  pageLinks = [1];
  visiblePageLinks = [1];

  constructor() {}

  ngOnInit(): void {
    this.init(this.currentPage);
  }

  ngAfterContentInit(): void {
    this.collectTemplateRefs();
  }

  init(page = 1): void {
    this.pageLinks = [];

    const pageCount = this.getPageCount();

    for (let i = 1; i <= pageCount; ++i) {
      this.pageLinks.push(i);
    }

    this.navigateToPage(page);
  }

  getPageCount(): number {
    return Math.ceil(this.itemsCount / this.itemsPerPage) || 1;
  }

  navigateToPage(p: number, event?: any): void {
    if (event && event.stopPropagation) {
      event.stopPropagation();
    }

    const pageExists = this.pageLinks.find((pl) => pl === p);
    if (!pageExists) {
      p = 1;
    }

    this.currentPage = p;
    this.setVisiblePageLinks();

    const skip = this.itemsPerPage * (this.currentPage - 1);
    const take = this.itemsPerPage;
    const endIndex = this.itemsPerPage * this.currentPage;
    const startIndex = endIndex - this.itemsPerPage;

    this.onPageChange.emit({
      skip: skip,
      take: take,
      startIndex: startIndex,
      endIndex: endIndex,
      currentPage: this.currentPage,
    });
  }

  setVisiblePageLinks(): void {
    if (this.pageLinks.length <= this.pageLinksSize) {
      this.visiblePageLinks = this.pageLinks.slice();
      return;
    }

    this.visiblePageLinks = [];
    this.visiblePageLinks.push(this.currentPage);

    const currentPageIdx = this.currentPage - 1;
    let b = 1;

    while (this.visiblePageLinks.length < this.pageLinksSize) {
      if (this.pageLinks[currentPageIdx - b]) {
        this.visiblePageLinks.push(this.pageLinks[currentPageIdx - b]);
      }

      b = b * -1;

      if (b > 0) {
        b++;
      }
    }

    this.visiblePageLinks.sort((plA: number, plB: number) => plA - plB);

    const lowestVisiblePl = this.visiblePageLinks[0];
    const plsPriorLowestVisiblePlExist = this.pageLinks.indexOf(lowestVisiblePl) > 0;
    if (plsPriorLowestVisiblePlExist) {
      // remove it so the dots can take place (and total number of visible page links is not greater then value of 'this.pageLinksSize')
      this.visiblePageLinks.splice(0, 1);
    }

    const highestVisiblePl = this.visiblePageLinks[this.visiblePageLinks.length - 1];
    const plsAfterHighestVisiblePlExist = this.pageLinks.indexOf(highestVisiblePl) < this.pageLinks.length - 1;
    if (plsAfterHighestVisiblePlExist) {
      // remove it so the dots can take place (and total number of visible page links is not greater then value of 'this.pageLinksSize')
      this.visiblePageLinks.pop();
    }
  }

  shouldShowPaginatorDots(side: string): boolean {
    if (side === 'left') {
      const lowestVisiblePl = this.visiblePageLinks[0];
      const plsPriorLowestVisiblePlExist = this.pageLinks.indexOf(lowestVisiblePl) > 0;
      return plsPriorLowestVisiblePlExist;
    } else {
      const highestVisiblePl = this.visiblePageLinks[this.visiblePageLinks.length - 1];
      const plsAfterHighestVisiblePlExist = this.pageLinks.indexOf(highestVisiblePl) < this.pageLinks.length - 1;
      return plsAfterHighestVisiblePlExist;
    }
  }

  itemsPerPageValueChange(event: any): void {
    this.itemsPerPage = parseInt(event.target.value, 10);
    this.onItemsPerPageValueChange.emit(this.itemsPerPage);
    this.init(1);
  }

  bindFnContext(fn: Function): Function {
    return fn.bind(this);
  }

  isExpNaN(value): boolean {
    return value !== value;
  }

  collectTemplateRefs(): void {
    this.templateList.toArray().forEach((t: TemplateDirective) => {
      if (!this.templateTypes[t.type]) {
        console.warn(
          `Unknown template type: ${t.type}. Possible value/s: ${mapToIterable(this.templateTypes).join(', ')}.`
        );
        return;
      }

      this.templateRefs[t.type] = t.templateRef;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['itemsCount']) {
      const firstChange = changes['itemsCount'].firstChange;
      const value = changes['itemsCount'].currentValue;

      if (typeof value !== 'number' || this.isExpNaN(value) || value < 0) {
        console.warn('`itemsCount` input parameter should be positive number.', `itemsCount: ${value}`);
        this.itemsCount = 0;
      }

      if (!firstChange) {
        this.init(1);
      }
    }

    if (changes['currentPage']) {
      const firstChange = changes['currentPage'].firstChange;
      const value = changes['currentPage'].currentValue;

      if (typeof value !== 'number' || this.isExpNaN(value) || value < 1) {
        console.warn(
          '`currentPage` input parameter should be positive number greater than 0.',
          `currentPage: ${value}`
        );
        this.currentPage = 1;
      }

      if (!firstChange) {
        this.navigateToPage(this.currentPage);
      }
    }

    if (changes['pageLinksSize']) {
      const value = changes['pageLinksSize'].currentValue;

      if (typeof value !== 'number' || this.isExpNaN(value) || value < 3) {
        console.warn(
          '`pageLinksSize` input parameter should be positive number greater then 2.',
          `pageLinksSize: ${value}`
        );
      }
    }

    if (changes['itemsPerPageOptions']) {
      const value = changes['itemsPerPageOptions'].currentValue;

      if (value && (!Array.isArray(value) || !value.length)) {
        console.warn(
          '`itemsPerPageOptions` input parameter should be an array of positive numbers.',
          `itemsPerPageOptions: ${value}`
        );
      }
    }

    if (changes['itemsPerPage']) {
      const value = changes['itemsPerPage'].currentValue;
      const isItemsPerPageValueValid = typeof value === 'number' && value > 1;
      const isItemsPerPageOptionsValueValid =
        !this.itemsPerPageOptions ||
        (Array.isArray(this.itemsPerPageOptions) && this.itemsPerPageOptions.indexOf(value) > -1);

      if (!isItemsPerPageValueValid || !isItemsPerPageOptionsValueValid) {
        console.warn(
          '`itemsPerPage` input parameter should be positive number contained within the `itemsPerPageOptions`.',
          `itemsPerPage: ${value}, itemsPerPageOptions: ${this.itemsPerPageOptions}`
        );
      }
    }
  }
}
