import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/datatable',
        pathMatch: 'full'
    },
    {
        path: '**',
        redirectTo: '/datatable',
        pathMatch: 'full'
    }
];
