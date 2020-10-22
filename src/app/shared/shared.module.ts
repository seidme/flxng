import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommonModule as FlxngCommonModule } from '@flxng/common';

import { MenuComponent } from './components/menu/menu.component';
import { HamburgerComponent } from './components/hamburger/hamburger.component';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { SvgComponent } from './components/svg/svg.component';
import { ExpandableComponent } from './components/expandable/expandable.component';
import { ChevronComponent } from './components/chevron/chevron.component';
import { AccordionComponent } from './components/accordion/accordion.component';
import { PackageSetupDocsComponent } from './components/package-setup-docs/package-setup-docs.component';

@NgModule({
  imports: [CommonModule, FlxngCommonModule],
  exports: [
    MenuComponent,
    HamburgerComponent,
    HeaderComponent,
    SidebarComponent,
    SvgComponent,
    ExpandableComponent,
    ChevronComponent,
    AccordionComponent,
    PackageSetupDocsComponent,
  ],
  declarations: [
    MenuComponent,
    HamburgerComponent,
    HeaderComponent,
    SidebarComponent,
    SvgComponent,
    ExpandableComponent,
    ChevronComponent,
    AccordionComponent,
    PackageSetupDocsComponent,
  ],
  providers: [],
})
export class SharedModule {}
