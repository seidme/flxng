import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { CommonModule as FlxngCommonModule } from '@flxng/common';
import { PaginatorModule as FlxngPaginatorModule } from '@flxng/paginator';

import { DatatableComponent } from './datatable.component';
import { ColumnComponent } from './column/column.component';
import { PaginationComponent } from './pagination/pagination.component';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule, // TODO: mark it as peer dependency..
    FlxngCommonModule,
    FlxngPaginatorModule
  ],
  exports: [
    DatatableComponent,
    ColumnComponent,
    PaginationComponent
  ],
  declarations: [
    DatatableComponent,
    ColumnComponent,
    PaginationComponent
  ]
})
export class DatatableModule { }
