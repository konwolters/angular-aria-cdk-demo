import { Component, inject } from '@angular/core';
import { SucheSeiteComponent } from '../suche/suche-seite';
import { SucheZustand } from '../suche/suche-zustand';
import { CUSTOMER_COLUMNS, REQUEST_COLUMNS, ANGEBOT_SEARCH_COLUMNS } from '../daten/gui-spalten';
import { GuiSessionStore } from '../daten/gui-session-store';
import { injectGuiRouteContext } from './gui-route-context';

@Component({
  selector: 'app-suche-route',
  imports: [SucheSeiteComponent],
  templateUrl: './suche-route.html',
})
export class SucheRouteComponent {
  protected readonly ctx = injectGuiRouteContext();
  protected readonly state = inject(SucheZustand);
  protected readonly session = inject(GuiSessionStore);
  protected readonly customerColumns = CUSTOMER_COLUMNS;
  protected readonly requestColumns = REQUEST_COLUMNS;
  protected readonly angebotColumns = ANGEBOT_SEARCH_COLUMNS;
}
