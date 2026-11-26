import { Routes } from '@angular/router';
import { guiAccessGuard } from './kulturkompass/gui-access.guard';
import { kulturkompassRoutes } from './kulturkompass/kulturkompass.routes';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'showcase' },
  {
    path: 'gui',
    canActivate: [guiAccessGuard],
    loadComponent: () =>
      import('./kulturkompass/kulturkompass').then((module) => module.Kulturkompass),
    children: kulturkompassRoutes,
  },
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
