import { NgModule } from '@angular/core';

import { LoaderComponent } from './loader.component';
import { LoaderDirective } from './loader.directive';

@NgModule({
  declarations: [LoaderComponent, LoaderDirective],
  imports: [],
  exports: [LoaderComponent, LoaderDirective],
  providers: [],
})
export class LoaderModule {}
