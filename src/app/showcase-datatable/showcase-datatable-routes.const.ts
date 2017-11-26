import { Routes } from "@angular/router";

import { ShowcaseDatatableComponent } from "./showcase-datatable.component";
import { OverviewComponent } from "./overview/overview.component";
import { TestComponent } from "./test/test.component";
import { GetStartedComponent } from "./get-started/get-started.component";
import { ScrollingComponent } from "./scrolling/scrolling.component";

import { OverviewTab1Component } from './overview/tabs/tab1/overview-tab1.component';
import { OverviewTab2Component } from './overview/tabs/tab2/overview-tab2.component';

export const showcaseDatatableRoutes: Routes = [
    {
        path: "datatable",
        component: ShowcaseDatatableComponent,
        data: {
            //showSidebar: true
        },
        children: [
            {
                path: "overview",
                component: OverviewComponent,
                children: [
                    { path: "tab1", component: OverviewTab1Component },
                    { path: "tab2", component: OverviewTab2Component }
                ]
            },
            { path: "test", component: TestComponent },
            { path: "get-started", component: GetStartedComponent },
            { path: "scrolling", component: ScrollingComponent }
        ]
    }
];
