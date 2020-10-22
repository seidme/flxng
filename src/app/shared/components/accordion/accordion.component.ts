import { AfterViewInit, Component, ContentChildren, Input, OnDestroy, OnInit, QueryList } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ExpandableComponent } from '../expandable/expandable.component';

@Component({
  selector: 'app-accordion',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.scss'],
})
export class AccordionComponent implements OnInit, AfterViewInit, OnDestroy {
  @ContentChildren(ExpandableComponent) expandables: QueryList<ExpandableComponent>;

  @Input() multi = false;

  destroyed$ = new Subject<void>();

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    if (this.multi) {
      return;
    }

    this.expandables.toArray().forEach((expandable) => {
      expandable.onToggle.pipe(takeUntil(this.destroyed$)).subscribe((expanded) => {
        if (!expandable.standalone && expanded) {
          this.expandables.toArray().forEach((e) => e.expanded && e.collapse());
          expandable.expand();
        }
      });
    });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
