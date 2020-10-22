import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/packages',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: '/packages',
    pathMatch: 'full',
  },
  // {
  //   path: 'treetable',
  //   loadChildren: () => import('./showcase-treetable/showcase-treetable.module').then((m) => m.ShowcaseTreetableModule),
  // },
];
