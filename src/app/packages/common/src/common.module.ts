import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { BrowserModule } from '@angular/platform-browser';
//import { FormsModule } from '@angular/forms';
//import { ReactiveFormsModule } from '@angular/forms';

import { TemplateLoaderComponent } from './components/template-loader.component';

import { VarDirective } from './directives';
import { TemplateDirective } from './directives';
import { OutsideClickDirective } from './directives';
import { globalFilterDirective } from './directives';
import { ObserveWidthDirective } from './directives';

import { StorageService } from './services/storage.service';

@NgModule({
  imports: [],
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
  providers: [
    StorageService
  ]
})
export class CommonModule { }
