import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TextInputAutocompleteComponent } from './text-input-autocomplete.component';
import { TextInputAutocompleteContainerComponent } from './text-input-autocomplete-container.component';
import { TextInputAutocompleteMenuComponent } from './text-input-autocomplete-menu.component';

@NgModule({
  declarations: [
    TextInputAutocompleteComponent,
    TextInputAutocompleteContainerComponent,
    TextInputAutocompleteMenuComponent
  ],
  imports: [CommonModule],
  exports: [
    TextInputAutocompleteComponent,
    TextInputAutocompleteContainerComponent,
    TextInputAutocompleteMenuComponent
  ],
  entryComponents: [TextInputAutocompleteMenuComponent]
})
export class TextInputAutocompleteModule {}
