import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CommonModule as FlxngCommonModule } from '@flxng/common';
import { PaginatorModule as FlxngPaginatorModule } from '@flxng/paginator';
import { CodeShowModule as FlxngCodeShowModule } from '@flxng/code-show';

import { SharedModule } from '../../shared/shared.module';

import { OverviewComponent } from './overview.component';
import { OverviewAComponent } from './overview-a/overview-a.component';
import { OverviewBComponent } from './overview-b/overview-b.component';
// import { OverviewAComponent } from './overview-a/overview-a.component';
// import { OverviewBComponent } from './overview-b/overview-b.component';

@NgModule({
  declarations: [
    OverviewComponent,
    OverviewAComponent,
    OverviewBComponent,
    // OverviewAComponent,
    // OverviewBComponent,
  ],
  imports: [CommonModule, FormsModule, FlxngCommonModule, FlxngPaginatorModule, FlxngCodeShowModule, SharedModule],
})
export class OverviewModule {}
