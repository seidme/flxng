import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CommonModule as FlxngCommonModule } from '@flxng/common';
import { TreetableModule as FlxngTreetableModule } from '@flxng/treetable';
import { CodeShowModule as FlxngCodeShowModule } from '@flxng/code-show';

import { SharedModule } from '../../shared/shared.module';

import { OverviewComponent } from './overview.component';
import { OverviewAComponent } from './overview-a/overview-a.component';

@NgModule({
  imports: [CommonModule, FormsModule, SharedModule, FlxngCommonModule, FlxngTreetableModule, FlxngCodeShowModule],
  declarations: [OverviewComponent, OverviewAComponent],
  providers: []
})
export class OverviewModule {}
