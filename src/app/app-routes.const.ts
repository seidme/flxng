import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/treetable',
        pathMatch: 'full'
    },
    {
        path: '**',
        redirectTo: '/treetable',
        pathMatch: 'full'
    }
];
