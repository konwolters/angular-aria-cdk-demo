import { Routes } from '@angular/router';
import { guiAccessGuard } from './kulturkompass/gui-access.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'showcase' },
  {
    path: 'gui',
    canActivate: [guiAccessGuard],
    loadComponent: () =>
      import('./kulturkompass/kulturkompass').then((module) => module.Kulturkompass),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'veranstaltungsorte' },
      {
        path: 'veranstaltungsorte/:id',
        loadComponent: () =>
          import('./kulturkompass/veranstaltungsort/veranstaltungsort-detail-seite/veranstaltungsort-detail-seite').then(
            (m) => m.VeranstaltungsortDetailSeite,
          ),
      },
      {
        path: 'staging/:id',
        loadComponent: () =>
          import('./kulturkompass/antrag/antrag-seite/antrag-seite').then((m) => m.AntragSeite),
      },
      {
        path: 'veranstaltungsorte',
        loadComponent: () =>
          import('./kulturkompass/veranstaltungsort/veranstaltungsort-suche/veranstaltungsort-suche').then(
            (m) => m.VeranstaltungsortSuche,
          ),
      },
      {
        path: 'angebot',
        loadComponent: () =>
          import('./kulturkompass/angebot/angebot-suche/angebot-suche').then((m) => m.AngebotSuche),
      },
      {
        path: 'import',
        loadComponent: () =>
          import('./kulturkompass/import/import-seite/import-seite').then((m) => m.ImportSeite),
      },
      {
        path: 'staging',
        loadComponent: () =>
          import('./kulturkompass/antrag/antrag-suche/antrag-suche').then((m) => m.AntragSuche),
      },
      {
        path: 'referenzdaten',
        loadComponent: () =>
          import('./kulturkompass/referenzdaten/referenzdaten-seite/referenzdaten-seite').then(
            (m) => m.ReferenzdatenSeite,
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
