import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CommonModule as FlxngCommonModule } from '@flxng/common';
import { TreetableModule as FlxngTreetableModule } from '@flxng/treetable';
import { CodeShowModule as FlxngCodeShowModule } from '@flxng/code-show';

import { SharedModule } from '../../shared/shared.module';

import { ScrollingComponent } from './scrolling.component';
import { ScrollingAComponent } from './scrolling-a/scrolling-a.component';
import { ScrollingBComponent } from './scrolling-b/scrolling-b.component';

@NgModule({
  imports: [CommonModule, FormsModule, SharedModule, FlxngCommonModule, FlxngTreetableModule, FlxngCodeShowModule],
  declarations: [ScrollingComponent, ScrollingAComponent, ScrollingBComponent],
  providers: []
})
export class ScrollingModule {}
