import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { HighchartsChartModule } from 'highcharts-angular';

import { CommonModule as FlxngCommonModule } from '@flxng/common';
import { TreetableModule as FlxngTreetableModule } from '@flxng/treetable'; // remove these imoprts once all packages are moved to projects
import { PaginatorModule } from '@flxng/paginator';

import { SharedModule } from '../shared/shared.module';
import { OverviewModule } from './overview/overview.module';
import { ScrollingModule } from './scrolling/scrolling.module';

import { showcaseTreetableRoutes } from './showcase-treetable-routes.const';
import { ShowcaseTreetableService } from './showcase-treetable.service';
import { ShowcaseTreetableComponent } from './showcase-treetable.component';

import { TestComponent } from './test/test.component';
import { GetStartedComponent } from './get-started/get-started.component';
import { PikerComponent } from './piker/piker.component';
import { PikerService } from './piker/piker.service';

// stuff for Piker
import { ItemEditComponent } from './piker/modals/item-edit/item-edit.component';
import { AnalyticsComponent } from './piker/modals/analytics/analytics.component';
import { MapsComponent } from './piker/modals/maps/maps.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(showcaseTreetableRoutes),
    SharedModule,
    FlxngCommonModule,
    FlxngTreetableModule,
    PaginatorModule,
    OverviewModule,
    ScrollingModule,
    HighchartsChartModule,
  ],
  declarations: [
    PikerComponent,
    ShowcaseTreetableComponent,
    TestComponent,
    GetStartedComponent,
    AnalyticsComponent,
    ItemEditComponent,
    MapsComponent
  ],
  entryComponents: [ItemEditComponent, AnalyticsComponent, MapsComponent],
  providers: [PikerService, ShowcaseTreetableService],
})
export class ShowcaseTreetableModule {}
