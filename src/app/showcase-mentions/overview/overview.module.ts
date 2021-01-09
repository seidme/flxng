import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommonModule as FlxngCommonModule } from '@flxng/common';
import { MentionsModule as FlxngMentionsModule } from '@flxng/mentions';
import { CodeShowModule as FlxngCodeShowModule } from '@flxng/code-show';

import { SharedModule } from '../../shared/shared.module';

import { OverviewComponent } from './overview.component';
import { OverviewAComponent } from './overview-a/overview-a.component';

@NgModule({
  declarations: [OverviewComponent, OverviewAComponent],
  imports: [CommonModule, FlxngCommonModule, FlxngMentionsModule, FlxngCodeShowModule, SharedModule],
})
export class OverviewModule {}
