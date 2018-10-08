import { Routes } from '@angular/router';

import { ShowcaseTreetableComponent } from './showcase-treetable.component';
import { OverviewComponent } from './overview/overview.component';
import { TestComponent } from './test/test.component';
import { GetStartedComponent } from './get-started/get-started.component';
import { ScrollingComponent } from './scrolling/scrolling.component';

import { PikerComponent } from './piker/piker.component';

export const showcaseTreetableRoutes: Routes = [
  {
    path: 'treetable',
    component: ShowcaseTreetableComponent,
    data: {
      //showSidebar: true
    },
    children: [
      { path: '', component: OverviewComponent },
      { path: 'test', component: TestComponent },
      { path: 'get-started', component: GetStartedComponent },
      { path: 'scrolling', component: ScrollingComponent },
      { path: 'piker', component: PikerComponent }
    ]
  }
];
