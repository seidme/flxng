import { NgModule } from '@angular/core';

// import { TemplateLoaderComponent } from './components/template-loader.component';

import { VarDirective } from './directives';
import { TemplateDirective } from './directives';
import { OutsideClickDirective } from './directives';
import { globalFilterDirective } from './directives';
import { ObserveWidthDirective } from './directives';

import { StorageService } from './services/storage.service';

@NgModule({
  imports: [],
  exports: [
    VarDirective,
    TemplateDirective,
    OutsideClickDirective,
    globalFilterDirective,
    ObserveWidthDirective
  ],
  declarations: [
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
