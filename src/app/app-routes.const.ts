import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/mentions',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: '/mentions',
    pathMatch: 'full',
  },
  // {
  //   path: 'treetable',
  //   loadChildren: () => import('./showcase-treetable/showcase-treetable.module').then((m) => m.ShowcaseTreetableModule),
  // },
];
