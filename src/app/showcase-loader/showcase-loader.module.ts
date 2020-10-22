import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { CommonModule as FlxngCommonModule } from '@flxng/common';
import { LoaderModule as FlxngLoaderModule } from '@flxng/loader';

import { SharedModule } from '../shared/shared.module';
import { GetStartedModule } from './get-started/get-started.module';
import { OverviewModule } from './overview/overview.module';

import { ShowcaseLoaderComponent } from './showcase-loader.component';
import { showcaseLoaderRoutes } from './showcase-loader-routes.const';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(showcaseLoaderRoutes),
    FlxngCommonModule,
    FlxngLoaderModule,
    SharedModule,
    OverviewModule,
    GetStartedModule,
  ],
  declarations: [ShowcaseLoaderComponent],
})
export class ShowcaseLoaderModule {}
