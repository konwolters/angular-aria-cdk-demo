import { Component, computed, inject } from '@angular/core';
import { ROUTER_OUTLET_DATA } from '@angular/router';
import type { Signal } from '@angular/core';
import type { GuiPageContext } from '../../kulturkompass';
import { SucheZustand } from '../suche-zustand';
import { GuiSessionStore } from '../../daten/gui-session-store';
import { CUSTOMER_COLUMNS, REQUEST_COLUMNS, ANGEBOT_SEARCH_COLUMNS } from '../../daten/gui-spalten';
import { ButtonComponent } from '../../../shared/button/button';
import { SuchergebnisTabelleComponent } from '../suchergebnis-tabelle/suchergebnis-tabelle';
import { SuchfilterComponent } from '../suchfilter/suchfilter';

@Component({
  selector: 'app-suche-seite',
  imports: [ButtonComponent, SuchergebnisTabelleComponent, SuchfilterComponent],
  templateUrl: './suche-seite.html',
})
export class SucheSeiteComponent {
  protected readonly ctx = inject(ROUTER_OUTLET_DATA) as Signal<GuiPageContext>;
  protected readonly state = inject(SucheZustand);
  protected readonly session = inject(GuiSessionStore);
  protected readonly page = computed(() =>
    this.state.page() === 'angebot'
      ? 'angebot'
      : this.state.page() === 'staging'
        ? 'staging'
        : 'veranstaltungsorte',
  );
  protected readonly rows = this.state.rows;
  protected readonly columns = computed(() =>
    this.page() === 'veranstaltungsorte'
      ? CUSTOMER_COLUMNS
      : this.page() === 'angebot'
        ? ANGEBOT_SEARCH_COLUMNS
        : REQUEST_COLUMNS,
  );
  protected readonly pagination = () => this.ctx().pagination;
  protected readonly statuses = () => this.ctx().statuses;
  protected readonly query = this.state.query;
  protected readonly customerNumber = this.session.customerNumber;
  protected readonly status = this.session.status;
  protected readonly countries = this.state.countries;
  protected readonly businessTypes = this.state.businessTypes;
  protected readonly referenceTypes = this.state.referenceTypes;
}
