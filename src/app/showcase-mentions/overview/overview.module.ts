import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OverviewComponent } from './overview.component';
import { OverviewAComponent } from './overview-a/overview-a.component';

@NgModule({
  declarations: [OverviewComponent, OverviewAComponent],
  imports: [CommonModule],
})
export class OverviewModule {}
