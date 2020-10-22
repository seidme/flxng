import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CircleTimerComponent } from './circle-timer.component';

@NgModule({
  imports: [CommonModule],
  declarations: [CircleTimerComponent],
  exports: [CircleTimerComponent],
})
export class CircleTimerModule {}
