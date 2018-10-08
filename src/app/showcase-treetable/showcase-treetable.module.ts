import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { CommonModule as FlxngCommonModule } from '@flxng/common';
import { TreetableModule as FlxngTreetableModule } from '@flxng/treetable';

import { SharedModule } from '../shared/shared.module';

import { showcaseTreetableRoutes } from './showcase-treetable-routes.const';
import { ShowcaseTreetableService } from './showcase-treetable.service';
import { ShowcaseTreetableComponent } from './showcase-treetable.component';
import { OverviewComponent } from './overview/overview.component';
import { TestComponent } from './test/test.component';
import { GetStartedComponent } from './get-started/get-started.component';
import { ScrollingComponent } from './scrolling/scrolling.component';

import { PikerComponent } from "./piker/piker.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(showcaseTreetableRoutes),
    SharedModule,
    FlxngCommonModule,
    FlxngTreetableModule
  ],
  declarations: [
    ShowcaseTreetableComponent,
    OverviewComponent,
    TestComponent,
    GetStartedComponent,
    ScrollingComponent,
    PikerComponent
  ],
  providers: [
    ShowcaseTreetableService
  ]
})
export class ShowcaseTreetableModule { }
