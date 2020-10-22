import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CodeShowComponent } from './code-show.component';

@NgModule({
  declarations: [CodeShowComponent],
  imports: [CommonModule],
  exports: [CodeShowComponent]
})
export class CodeShowModule {}
