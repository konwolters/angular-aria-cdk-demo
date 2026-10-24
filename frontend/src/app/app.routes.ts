import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'customers' },
  {
    path: 'customers',
    loadComponent: () =>
      import('./customers/customer-table/customer-table').then(
        (module) => module.CustomerTableComponent,
      ),
  },
  {
    path: 'orders',
    loadComponent: () =>
      import('./orders/order-table/order-table').then((module) => module.OrderTableComponent),
  },
  {
    path: 'projects',
    loadComponent: () =>
      import('./projects/project-table/project-table').then(
        (module) => module.ProjectTableComponent,
      ),
  },
  {
    path: 'tabs',
    loadComponent: () =>
      import('./tabs/tabs-page/tabs-page').then((module) => module.TabsPageComponent),
  },
  { path: '**', redirectTo: 'customers' },
];
