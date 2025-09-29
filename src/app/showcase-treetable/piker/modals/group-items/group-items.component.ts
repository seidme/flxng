import { Component, Input, OnInit } from '@angular/core';

import { Item, ItemField, PikerService, Source } from '../../piker.service';
import { ModalService } from '../../../../shared/components/modal/modal.service';

@Component({
  selector: 'flx-group-items',
  templateUrl: './group-items.component.html',
  styleUrls: ['./group-items.component.scss'],
})
export class GroupItemsComponent implements OnInit {
  @Input() source: Source;

  groups: Array<{ value: string; count: number }> = [];

  constructor(private _service: PikerService, private modalService: ModalService) {}

  ngOnInit() {
    console.log('source:', this.source);
  }

  group(): void {
    // Implement grouping logic here
    console.log('Grouping items...');
    this._service.groupItemsByField(this.source, ItemField.FormattedAddress).then((groups) => {
      console.log('groups:', groups);
      this.groups = groups;
    });
  }

  close(): void {
    this.modalService.close(false);
  }
}
