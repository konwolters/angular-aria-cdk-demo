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
          import('./kulturkompass/veranstaltungsorte/veranstaltungsort-detail-seite/veranstaltungsort-detail-seite').then(
            (m) => m.VeranstaltungsortDetailSeiteComponent,
          ),
      },
      {
        path: 'staging/:id',
        loadComponent: () =>
          import('./kulturkompass/staging/antrag-seite/antrag-seite').then(
            (m) => m.AntragSeiteComponent,
          ),
      },
      {
        path: 'veranstaltungsorte',
        loadComponent: () =>
          import('./kulturkompass/suche/suche-seite/suche-seite').then(
            (m) => m.SucheSeiteComponent,
          ),
      },
      {
        path: 'angebot',
        loadComponent: () =>
          import('./kulturkompass/suche/suche-seite/suche-seite').then(
            (m) => m.SucheSeiteComponent,
          ),
      },
      {
        path: 'import',
        loadComponent: () =>
          import('./kulturkompass/import/import-seite/import-seite').then(
            (m) => m.ImportSeiteComponent,
          ),
      },
      {
        path: 'staging',
        loadComponent: () =>
          import('./kulturkompass/suche/suche-seite/suche-seite').then(
            (m) => m.SucheSeiteComponent,
          ),
      },
      {
        path: 'referenzdaten',
        loadComponent: () =>
          import('./kulturkompass/referenzdaten/referenzdaten-seite/referenzdaten-seite').then(
            (m) => m.ReferenzdatenSeiteComponent,
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
