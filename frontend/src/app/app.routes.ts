import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'showcase' },
  {
    path: 'showcase',
    loadComponent: () =>
      import('./showcase/import-showcase').then((module) => module.ImportShowcaseComponent),
  },
  { path: 'components', pathMatch: 'full', redirectTo: 'components/button' },
  { path: 'components/field-messages', pathMatch: 'full', redirectTo: 'components/text-field' },
  {
    path: 'components/:slug',
    loadComponent: () =>
      import('./components/component-example-page').then((module) => module.ComponentExamplePage),
  },
  { path: '**', redirectTo: 'showcase' },
];
