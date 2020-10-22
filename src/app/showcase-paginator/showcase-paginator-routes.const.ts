import { Routes } from '@angular/router';

import { ShowcasePaginatorComponent } from './showcase-paginator.component';
import { OverviewComponent } from './overview/overview.component';
import { GetStartedComponent } from './get-started/get-started.component';

export const showcasePaginatorRoutes: Routes = [
  {
    path: 'paginator',
    component: ShowcasePaginatorComponent,
    data: {},
    children: [
      { path: '', component: OverviewComponent },
      { path: 'get-started', component: GetStartedComponent },
    ],
  },
];
