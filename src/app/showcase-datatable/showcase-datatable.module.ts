import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

 //import { DatatableModule as FlxngDatatableModule } from '@flxng/datatable';
import { CommonModule as FlxngCommonModule } from '../packages/common';
import { DatatableModule as FlxngDatatableModule } from '../packages/datatable';
import { TabsModule } from '../shared/components/flx-tabs/flx-tabs.module';

import { showcaseDatatableRoutes } from './showcase-datatable-routes.const';
import { ShowcaseDatatableService } from './showcase-datatable.service';
import { ShowcaseDatatableComponent } from './showcase-datatable.component';
import { OverviewComponent } from './overview/overview.component';
import { TestComponent } from './test/test.component';
import { GetStartedComponent } from './get-started/get-started.component';
import { ScrollingComponent } from './scrolling/scrolling.component';

import { OverviewTab1Component } from './overview/tabs/tab1/overview-tab1.component';
import { OverviewTab2Component } from './overview/tabs/tab2/overview-tab2.component';


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(showcaseDatatableRoutes),
    FlxngCommonModule,
    FlxngDatatableModule,
    TabsModule
  ],
  declarations: [
    ShowcaseDatatableComponent,
    OverviewComponent,
    TestComponent,
    GetStartedComponent,
    ScrollingComponent,
    OverviewTab1Component,
    OverviewTab2Component
  ],
  providers: [
    ShowcaseDatatableService
  ]
})
export class ShowcaseDatatableModule { }
