import { Routes } from '@angular/router';

import { ShowcaseDatatableComponent } from './showcase-datatable.component';
import { OverviewComponent } from './overview/overview.component';
import { TestComponent } from './test/test.component';
import { GetStartedComponent } from './get-started/get-started.component';
import { ScrollingComponent } from './scrolling/scrolling.component';

export const showcaseDatatableRoutes: Routes = [
    {
        path: 'datatable',
        component: ShowcaseDatatableComponent,
        data: {
            //showSidebar: true
        },
        children: [
            { path: '', component: OverviewComponent },
            { path: 'test', component: TestComponent },
            { path: 'get-started', component: GetStartedComponent },
            { path: 'scrolling', component: ScrollingComponent }
        ]
    }
];
