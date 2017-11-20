import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//import { CommonModule as FlxngCommonModule } from '@flxng/common';
import { CommonModule as FlxngCommonModule } from '../../common';

import { DatatableComponent } from './datatable.component';
import { ColumnComponent } from './column/column.component';
import { PaginatorMetaComponent } from './paginator-meta/paginator-meta.component';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule, // TODO: mark it as peer dependency..
    FlxngCommonModule
  ],
  exports: [
    DatatableComponent,
    ColumnComponent,
    PaginatorMetaComponent
  ],
  declarations: [
    DatatableComponent,
    ColumnComponent,
    PaginatorMetaComponent
  ]
})
export class DatatableModule { }
