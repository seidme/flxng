import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { CommonModule as FlxngCommonModule } from '@flxng/common';

import { SharedModule } from '../shared/shared.module';

import { ShowcaseComponent } from './showcase.component';
import { showcaseRoutes } from './showcase-routes.const';

@NgModule({
  imports: [CommonModule, FormsModule, RouterModule.forChild(showcaseRoutes), FlxngCommonModule, SharedModule],
  declarations: [ShowcaseComponent],
})
export class ShowcaseModule {}
