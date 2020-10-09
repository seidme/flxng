import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommonModule as FlxngCommonModule } from '@flxng/common';
import { CircleTimerModule as FlxngCircleTimerModule } from '@flxng/circle-timer';
import { CodeShowModule as FlxngCodeShowModule } from '@flxng/code-show';

import { SharedModule } from '../../shared/shared.module';

import { OverviewComponent } from './overview.component';
import { OverviewAComponent } from './overview-a/overview-a.component';
import { OverviewBComponent } from './overview-b/overview-b.component';
import { OverviewCComponent } from './overview-c/overview-c.component';

@NgModule({
  imports: [CommonModule, FlxngCommonModule, FlxngCircleTimerModule, FlxngCodeShowModule, SharedModule],
  declarations: [OverviewComponent, OverviewAComponent, OverviewBComponent, OverviewCComponent],
})
export class OverviewModule {}
