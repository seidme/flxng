import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared/shared.module';

import { GetStartedComponent } from './get-started.component';

@NgModule({
  declarations: [GetStartedComponent],
  imports: [CommonModule, SharedModule],
})
export class GetStartedModule {}
