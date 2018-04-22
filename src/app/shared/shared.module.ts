import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommonModule as FlxngCommonModule } from '@flxng/common';

import { MenuComponent } from './components/menu/menu.component';

@NgModule({
  imports: [
    CommonModule,
    FlxngCommonModule
  ],
  exports: [
    MenuComponent
],
  declarations: [
    MenuComponent
  ],
  providers: [
  ]
})
export class SharedModule { }
