import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommonModule as FlxngCommonModule } from '@flxng/common';

import { MenuComponent } from './components/menu/menu.component';
import { HamburgerComponent } from './components/hamburger/hamburger.component';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { SvgComponent } from './components/svg/svg.component';

@NgModule({
  imports: [
    CommonModule,
    FlxngCommonModule
  ],
  exports: [
    MenuComponent,
    HamburgerComponent,
    HeaderComponent,
    SidebarComponent,
    SvgComponent
],
  declarations: [
    MenuComponent,
    HamburgerComponent,
    HeaderComponent,
    SidebarComponent,
    SvgComponent
  ],
  providers: [
  ]
})
export class SharedModule { }
