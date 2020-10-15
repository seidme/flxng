import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { CommonModule as FlxngCommonModule } from '@flxng/common';
import { PaginatorModule as FlxngPaginatorModule } from '@flxng/paginator';

import { SharedModule } from '../shared/shared.module';
import { GetStartedModule } from './get-started/get-started.module';
import { OverviewModule } from './overview/overview.module';

import { ShowcasePaginatorComponent } from './showcase-paginator.component';
import { showcasePaginatorRoutes } from './showcase-paginator-routes.const';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(showcasePaginatorRoutes),
    FlxngCommonModule,
    FlxngPaginatorModule,
    SharedModule,
    OverviewModule,
    GetStartedModule,
  ],
  declarations: [ShowcasePaginatorComponent],
})
export class ShowcasePaginatorModule {}
