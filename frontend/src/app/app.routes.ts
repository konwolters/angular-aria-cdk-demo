import { Routes } from '@angular/router';
import { guiAccessGuard } from './kulturkompass/gui-access.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'showcase' },
  {
    path: 'gui',
    canActivate: [guiAccessGuard],
    loadComponent: () =>
      import('./kulturkompass/kulturkompass').then((module) => module.KulturkompassComponent),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'veranstaltungsorte' },
      {
        path: 'veranstaltungsorte/:id',
        loadComponent: () =>
          import('./kulturkompass/routing/veranstaltungsort-route').then(
            (m) => m.VeranstaltungsortRouteComponent,
          ),
      },
      {
        path: 'staging/:id',
        loadComponent: () =>
          import('./kulturkompass/routing/antrag-route').then((m) => m.AntragRouteComponent),
      },
      {
        path: 'veranstaltungsorte',
        loadComponent: () =>
          import('./kulturkompass/routing/suche-route').then((m) => m.SucheRouteComponent),
      },
      {
        path: 'angebot',
        loadComponent: () =>
          import('./kulturkompass/routing/suche-route').then((m) => m.SucheRouteComponent),
      },
      {
        path: 'import',
        loadComponent: () =>
          import('./kulturkompass/routing/import-route').then((m) => m.ImportRouteComponent),
      },
      {
        path: 'staging',
        loadComponent: () =>
          import('./kulturkompass/routing/suche-route').then((m) => m.SucheRouteComponent),
      },
      {
        path: 'referenzdaten',
        loadComponent: () =>
          import('./kulturkompass/routing/referenzdaten-route').then(
            (m) => m.ReferenzdatenRouteComponent,
          ),
      },
    ],
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
