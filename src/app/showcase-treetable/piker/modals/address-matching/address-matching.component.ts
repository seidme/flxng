import { Component, Input, OnInit } from '@angular/core';

import { Item, ItemField, PikerService, Source } from '../../piker.service';
import { ModalService } from '../../../../shared/components/modal/modal.service';

@Component({
  selector: 'flx-address-matching',
  templateUrl: './address-matching.component.html',
  styleUrls: ['./address-matching.component.scss'],
})
export class AddressMatchingComponent implements OnInit {
  @Input() source: Source;
  @Input() item: Item;

  ItemField = ItemField;
  suggestions: any[] = [];
  selectedSuggestion: any;

  newAddressGroupKey = '';
  // newAddressGroupLocality = '';

  // groups: Array<{ value: string; count: number }> = [];

  constructor(private _service: PikerService, private modalService: ModalService) {}

  async ngOnInit() {
    console.log('source:', this.source);

    this.newAddressGroupKey = this.item.parsedDetails[ItemField.FormattedAddress] || '';
    // this.newAddressGroupLocality = this.item.parsedDetails[ItemField.Locality] || '';

    this.suggestions = await this._service.getAddressGroupSuggestions(this.source, this.item);
    console.log('suggestions:', this.suggestions);

    if(this.suggestions.length === 1) {
      this.selectedSuggestion = this.suggestions[0];
    }
  }

  // group(): void {
  //   // Implement grouping logic here
  //   console.log('Grouping items...');
  //   this._service.groupItemsByField(this.source, ItemField.FormattedAddress).then((groups) => {
  //     console.log('groups:', groups);
  //     this.groups = groups;
  //   });
  // }

  close(): void {
    this.modalService.close(false);
  }

  async matchOnly() {
    const matchedGroup = await this._service.matchAddressGroup(this.source, this.item, this.selectedSuggestion.id);
    console.log('Matched address group:', matchedGroup);
    this.modalService.close(true);
  }

  async matchAndAddToAliases() {
    const matchedGroup = await this._service.matchAddressGroup(
      this.source,
      this.item,
      this.selectedSuggestion.id,
      this.newAddressGroupKey
    );
    console.log('Matched address group and updated aliases:', matchedGroup);
    this.modalService.close(true);
  }

  async createAddressGroup() {
    var createdGroup = await this._service.createAddressGroup(this.source, this.item, this.newAddressGroupKey);
    console.log('Created address group:', createdGroup);
    this.modalService.close(true);
  }

    deleteItem(): Promise<void> {
    return this._service.deleteItem(this.item.id).then(() => {
      this.modalService.close(true);
    });
  }
}
