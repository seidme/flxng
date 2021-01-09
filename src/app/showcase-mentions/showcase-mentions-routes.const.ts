import { Routes } from '@angular/router';

import { ShowcaseMentionsComponent } from './showcase-mentions.component';
import { OverviewComponent } from './overview/overview.component';
import { GetStartedComponent } from './get-started/get-started.component';

export const showcaseMentionsRoutes: Routes = [
  {
    path: 'mentions',
    component: ShowcaseMentionsComponent,
    data: {},
    children: [
      { path: '', component: OverviewComponent },
      { path: 'get-started', component: GetStartedComponent },
    ],
  },
];
