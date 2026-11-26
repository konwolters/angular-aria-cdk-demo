import { Routes } from '@angular/router';

export const kulturkompassRoutes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'veranstaltungsorte' },
  {
    path: 'veranstaltungsorte/:id',
    loadComponent: () =>
      import('./veranstaltungsort/veranstaltungsort-detail-seite/veranstaltungsort-detail-seite').then(
        (m) => m.VeranstaltungsortDetailSeite,
      ),
  },
  {
    path: 'staging/:id',
    loadComponent: () => import('./antrag/antrag-seite/antrag-seite').then((m) => m.AntragSeite),
  },
  {
    path: 'veranstaltungsorte',
    loadComponent: () =>
      import('./veranstaltungsort/veranstaltungsort-suche/veranstaltungsort-suche').then(
        (m) => m.VeranstaltungsortSuche,
      ),
  },
  {
    path: 'angebot',
    loadComponent: () =>
      import('./angebot/angebot-suche/angebot-suche').then((m) => m.AngebotSuche),
  },
  {
    path: 'import',
    loadComponent: () => import('./import/import-seite/import-seite').then((m) => m.ImportSeite),
  },
  {
    path: 'staging',
    loadComponent: () => import('./antrag/antrag-suche/antrag-suche').then((m) => m.AntragSuche),
  },
  {
    path: 'referenzdaten',
    loadComponent: () =>
      import('./referenzdaten/referenzdaten-seite/referenzdaten-seite').then(
        (m) => m.ReferenzdatenSeite,
      ),
  },
];
