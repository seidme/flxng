import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { CommonModule as FlxngCommonModule } from '@flxng/common';
import { MentionsModule as FlxngMentionsModule } from '@flxng/mentions';

import { SharedModule } from '../shared/shared.module';
import { GetStartedModule } from './get-started/get-started.module';
import { OverviewModule } from './overview/overview.module';

import { ShowcaseMentionsComponent } from './showcase-mentions.component';
import { showcaseMentionsRoutes } from './showcase-mentions-routes.const';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(showcaseMentionsRoutes),
    FlxngCommonModule,
    FlxngMentionsModule,
    SharedModule,
    OverviewModule,
    GetStartedModule,
  ],
  declarations: [ShowcaseMentionsComponent],
})
export class ShowcaseMentionsModule {}
