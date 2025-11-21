import { Component, Input, OnInit } from '@angular/core';
import { Item, ItemField, operators, PikerService, Source } from '../../piker.service';
import { ModalService } from '../../../../shared/components/modal/modal.service';

@Component({
  selector: 'flx-update-trigger',
  templateUrl: './update-trigger.component.html',
  styleUrls: ['./update-trigger.component.scss'],
})
export class UpdateTriggerComponent implements OnInit {
  @Input() source: Source;
  @Input() triggerName: string;
  @Input() streetNameToExclude: string;
  // @Input() item: Item;

  responseMessage = '';

  constructor(private _service: PikerService, private modalService: ModalService) {}

  ngOnInit() {
    console.log('source:', this.source);

    // coming from email link, model is used to auto call the update

    const triggers = this.source.parsedItemFilters;
    const trigger = triggers.find((t) => t.name === this.triggerName);
    if (!trigger) {
      this.responseMessage = `Trigger with name "${this.triggerName}" not found in source "${this.source.name}".`;
      return;
    }

    const triggerFilters = trigger.filters || [];
    if (!triggerFilters.length) {
      this.responseMessage = `Trigger "${this.triggerName}" has no filters.`;
    }

    const targetingFilter = {
      fieldId: ItemField.NormalizedAddress,
      operatorId: operators.NOT_EQUALS.id,
      value: '',
    };

    var existingFilter = triggerFilters.find(f => f.fieldId === targetingFilter.fieldId && f.operatorId === targetingFilter.operatorId);
    if(!existingFilter) {
      triggerFilters.push(targetingFilter);
      existingFilter = targetingFilter;
    }

    if(existingFilter.value) {
      existingFilter.value += ` && ${this.streetNameToExclude}`;
    } else {
      existingFilter.value = this.streetNameToExclude;
    }

    console.log('Updated trigger filters:', triggerFilters);

    this._service.updateSource(this.source).then((updatedSource) => {
      console.log('Source updated:', updatedSource);
      this.responseMessage = `SUCCESS: Source "${this.source.name}" updated successfully with modified trigger "${this.triggerName}".`;
    }).catch((error) => {
      console.error('Error updating source:', error);
      this.responseMessage = `Error updating source "${this.source.name}": ${error.message}`;
    });

    // const updatedSource = await this._service.updateSource(this.source);
  }
}
