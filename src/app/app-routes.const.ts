import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/packages',
        pathMatch: 'full'
    },
    {
        path: '**',
        redirectTo: '/packages',
        pathMatch: 'full'
    }
];
