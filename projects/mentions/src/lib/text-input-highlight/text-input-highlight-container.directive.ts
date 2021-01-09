import { Directive } from '@angular/core';

@Directive({
  selector: '[flxTextInputHighlightContainer]',
  host: {
    '[class.text-input-highlight-container]': 'true'
  }
})
export class TextInputHighlightContainerDirective {}
