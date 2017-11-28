import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

 //import { DatatableModule as FlxngDatatableModule } from '@flxng/datatable';
import { CommonModule as FlxngCommonModule } from '../packages/common';
import { DatatableModule as FlxngDatatableModule } from '../packages/datatable';

import { SharedModule } from '../shared/shared.module';

import { showcaseDatatableRoutes } from './showcase-datatable-routes.const';
import { ShowcaseDatatableService } from './showcase-datatable.service';
import { ShowcaseDatatableComponent } from './showcase-datatable.component';
import { OverviewComponent } from './overview/overview.component';
import { TestComponent } from './test/test.component';
import { GetStartedComponent } from './get-started/get-started.component';
import { ScrollingComponent } from './scrolling/scrolling.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(showcaseDatatableRoutes),
    SharedModule,
    FlxngCommonModule,
    FlxngDatatableModule
  ],
  declarations: [
    ShowcaseDatatableComponent,
    OverviewComponent,
    TestComponent,
    GetStartedComponent,
    ScrollingComponent
  ],
  providers: [
    ShowcaseDatatableService
  ]
})
export class ShowcaseDatatableModule { }
