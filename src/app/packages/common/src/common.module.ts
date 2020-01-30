import { NgModule } from '@angular/core';
import { CommonModule as AngularCommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { TemplateLoaderComponent } from './components/template-loader.component';
import { CodeComponent } from './components/code/code.component';

import { VarDirective } from './directives';
import { TemplateDirective } from './directives';
import { OutsideClickDirective } from './directives';
import { globalFilterDirective } from './directives';
import { ObserveWidthDirective } from './directives';

import { StorageService } from './services/storage.service';

@NgModule({
  imports: [AngularCommonModule, BrowserModule, BrowserAnimationsModule],
  exports: [
    TemplateLoaderComponent,
    CodeComponent,
    VarDirective,
    TemplateDirective,
    OutsideClickDirective,
    globalFilterDirective,
    ObserveWidthDirective
  ],
  declarations: [
    TemplateLoaderComponent,
    CodeComponent,
    VarDirective,
    TemplateDirective,
    OutsideClickDirective,
    globalFilterDirective,
    ObserveWidthDirective
  ],
  providers: [StorageService]
})
export class CommonModule {}
