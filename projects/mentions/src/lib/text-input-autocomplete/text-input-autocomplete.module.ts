import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TextInputAutocompleteComponent } from './text-input-autocomplete.component';
import { TextInputAutocompleteMenuComponent } from './text-input-autocomplete-menu.component';

@NgModule({
  declarations: [
    TextInputAutocompleteComponent,
    TextInputAutocompleteMenuComponent
  ],
  imports: [CommonModule],
  exports: [
    TextInputAutocompleteComponent,
    TextInputAutocompleteMenuComponent
  ],
  entryComponents: [TextInputAutocompleteMenuComponent]
})
export class TextInputAutocompleteModule {}
