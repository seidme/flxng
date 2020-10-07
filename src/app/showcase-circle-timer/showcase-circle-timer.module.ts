import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { CommonModule as FlxngCommonModule } from '@flxng/common';

import { SharedModule } from '../shared/shared.module';
import { GetStartedModule } from './get-started/get-started.module';
import { OverviewModule } from './overview/overview.module';

import { ShowcaseCircleTimerComponent } from './showcase-circle-timer.component';
import { showcaseCircleTimerRoutes } from './showcase-circle-timer-routes.const';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(showcaseCircleTimerRoutes),
    FlxngCommonModule,
    SharedModule,
    OverviewModule,
    GetStartedModule,
  ],
  declarations: [ShowcaseCircleTimerComponent],
  providers: [],
})
export class ShowcaseCircleTimerModule {}
