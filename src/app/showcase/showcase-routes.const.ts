import { Routes } from '@angular/router';

import { ShowcaseComponent } from './showcase.component';

export const showcaseRoutes: Routes = [
  {
    path: 'packages',
    component: ShowcaseComponent,
    data: {},
    // children: [
    //   { path: '', component: OverviewComponent },
    // ],
  },
];
