import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommonModule as FlxngCommonModule } from '@flxng/common';
import { CodeShowModule as FlxngCodeShowModule } from '@flxng/code-show';

import { SharedModule } from '../../shared/shared.module';

import { OverviewComponent } from './overview.component';

@NgModule({
  declarations: [OverviewComponent],
  imports: [CommonModule, FlxngCommonModule, FlxngCodeShowModule, SharedModule],
})
export class OverviewModule {}
