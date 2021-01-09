import { Directive } from '@angular/core';

@Directive({
  selector: 'textarea[flxTextInputElement]',
  host: {
    '[class.text-input-element]': 'true'
  }
})
export class TextInputElementDirective {}
