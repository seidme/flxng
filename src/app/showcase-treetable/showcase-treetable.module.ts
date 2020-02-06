import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { CommonModule as FlxngCommonModule } from '@flxng/common';
import { TreetableModule as FlxngTreetableModule } from '@flxng/treetable'; // remove these imoprts once all packages are moved to projects

import { SharedModule } from '../shared/shared.module';
import { OverviewModule} from './overview/overview.module';
import { ScrollingModule } from './scrolling/scrolling.module';

import { showcaseTreetableRoutes } from './showcase-treetable-routes.const';
import { ShowcaseTreetableService } from './showcase-treetable.service';
import { ShowcaseTreetableComponent } from './showcase-treetable.component';

import { TestComponent } from './test/test.component';
import { GetStartedComponent } from './get-started/get-started.component';
import { PikerComponent } from './piker/piker.component';
import { PikerService } from './piker/piker.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(showcaseTreetableRoutes),
    SharedModule,
    FlxngCommonModule,
    FlxngTreetableModule,
    OverviewModule,
    ScrollingModule
  ],
  declarations: [PikerComponent, ShowcaseTreetableComponent, TestComponent, GetStartedComponent],
  providers: [PikerService, ShowcaseTreetableService]
})
export class ShowcaseTreetableModule {}
