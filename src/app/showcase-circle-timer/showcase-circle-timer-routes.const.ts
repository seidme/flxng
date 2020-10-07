import { Routes } from '@angular/router';

import { ShowcaseCircleTimerComponent } from './showcase-circle-timer.component';
import { GetStartedComponent } from './get-started/get-started.component';
import { OverviewComponent } from './overview/overview.component';

export const showcaseCircleTimerRoutes: Routes = [
  {
    path: 'circle-timer',
    component: ShowcaseCircleTimerComponent,
    data: {},
    children: [
      { path: '', component: OverviewComponent },
      { path: 'get-started', component: GetStartedComponent },
    ],
  },
];
