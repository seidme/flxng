import { NgModule } from '@angular/core';
import { CommonModule as AngularCommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { TemplateLoaderComponent } from './components/template-loader.component';

import { VarDirective } from './directives/var.directive';
import { TemplateDirective } from './directives/template.directive';
import { OutsideClickDirective } from './directives/outside-click.directive';
import { globalFilterDirective } from './directives/global-filter.directive';
import { ObserveWidthDirective } from './directives/observe-width.directive';

import { StorageService } from './services/storage.service';

@NgModule({
  imports: [AngularCommonModule, BrowserModule, BrowserAnimationsModule],
  exports: [
    TemplateLoaderComponent,
    VarDirective,
    TemplateDirective,
    OutsideClickDirective,
    globalFilterDirective,
    ObserveWidthDirective
  ],
  declarations: [
    TemplateLoaderComponent,
    VarDirective,
    TemplateDirective,
    OutsideClickDirective,
    globalFilterDirective,
    ObserveWidthDirective
  ],
  providers: [StorageService]
})
export class CommonModule {}
