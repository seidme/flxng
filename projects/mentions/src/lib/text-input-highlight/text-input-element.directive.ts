import { Directive } from '@angular/core';

@Directive({
  selector: '[flxTextInputElement]',
  host: {
    '[class.flx-text-input-element]': 'true'
  }
})
export class TextInputElementDirective {}
