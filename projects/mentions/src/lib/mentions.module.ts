import { NgModule } from '@angular/core';

import { TextInputAutocompleteModule } from './text-input-autocomplete';
import { TextInputHighlightModule } from './text-input-highlight';

import { MentionsComponent } from './mentions.component';

@NgModule({
  declarations: [MentionsComponent],
  imports: [TextInputAutocompleteModule, TextInputHighlightModule],
  exports: [MentionsComponent, TextInputAutocompleteModule, TextInputHighlightModule],
})
export class MentionsModule {}
