import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';

import { CommonModule as FlxngCommonModule } from '@flxng/common';

import { PaginatorComponent } from './paginator.component';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    FlxngCommonModule,
  ],
  exports: [PaginatorComponent],
  declarations: [PaginatorComponent],
})
export class PaginatorModule {}
