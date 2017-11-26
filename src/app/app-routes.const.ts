import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/datatable/overview',
        pathMatch: 'full'
    },
    {
        path: '**',
        redirectTo: '/datatable/overview',
        pathMatch: 'full'
    }
];
