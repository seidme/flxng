import { Routes } from '@angular/router';

import { ShowcaseLoaderComponent } from './showcase-loader.component';
import { OverviewComponent } from './overview/overview.component';
import { GetStartedComponent } from './get-started/get-started.component';

export const showcaseLoaderRoutes: Routes = [
  {
    path: 'loader',
    component: ShowcaseLoaderComponent,
    data: {},
    children: [
      { path: '', component: OverviewComponent },
      { path: 'get-started', component: GetStartedComponent },
    ],
  },
];
