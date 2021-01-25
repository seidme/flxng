import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextInputHighlightComponent } from './text-input-highlight.component';

@NgModule({
  declarations: [
    TextInputHighlightComponent,
  ],
  imports: [CommonModule],
  exports: [
    TextInputHighlightComponent,
  ]
})
export class TextInputHighlightModule {}
