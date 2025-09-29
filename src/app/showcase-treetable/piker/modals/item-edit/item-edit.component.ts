import { Component, Input, OnInit } from '@angular/core';
import { Item, PikerService, Source } from '../../piker.service';
import { ModalService } from '../../../../shared/components/modal/modal.service';

@Component({
  selector: 'flx-item-edit',
  templateUrl: './item-edit.component.html',
  styleUrls: ['./item-edit.component.scss'],
})
export class ItemEditComponent implements OnInit {
  @Input() source: Source;
  @Input() item: Item;

  editingItem: Item;

  constructor(private _service: PikerService, private modalService: ModalService) {}

  ngOnInit() {
    console.log('item:', this.item);
    console.log('source:', this.source);
    this.editingItem = JSON.parse(JSON.stringify(this.item));
  }

  async save(): Promise<void> {
    this._service.updateItem(this.source, this.editingItem).then((updatedItem) => {
      console.log('updatedItem:', updatedItem);
      Object.assign(this.item, updatedItem);
      this.modalService.close(true);
    });
  }

  isFieldEditable(fieldId: string): boolean {
    const editableFieldIds = [
      '0',
      '1',
      '2',
      '3',
      '4',
      // '5',
      '6',
      // '7',
      // '8',
       '9',
      '10',
      // '11', // FormattedAddress
      // '12', // M2PriceStreetMedianAverage
      // '13', // M2PriceStreetMeanAverage
      // '14', // StreetGroupingCount
    ];
    return editableFieldIds.includes(fieldId);
  }

  delete(): Promise<void> {
    return this._service.deleteItem(this.item.id).then(() => {
      this.modalService.close(true);
    });
  }
}
