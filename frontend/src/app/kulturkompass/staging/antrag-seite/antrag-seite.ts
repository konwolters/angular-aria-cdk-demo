import { Component, inject } from '@angular/core';
import type { Signal } from '@angular/core';
import { ROUTER_OUTLET_DATA, RouterLink } from '@angular/router';
import type { GuiPageContext } from '../../kulturkompass';
import { StagingZustand } from '../staging-zustand';
import { GuiSessionStore } from '../../daten/gui-session-store';
import { REQUEST_BEREICH_COLUMNS, REQUEST_ANGEBOT_COLUMNS } from '../../daten/gui-spalten';
import { ButtonComponent } from '../../../shared/button/button';
import { AntragVergleichComponent } from '../antrag-vergleich/antrag-vergleich';

@Component({
  selector: 'app-antrag-seite',
  imports: [AntragVergleichComponent, ButtonComponent, RouterLink],
  templateUrl: './antrag-seite.html',
})
export class AntragSeiteComponent {
  protected readonly ctx = inject(ROUTER_OUTLET_DATA) as Signal<GuiPageContext>;
  protected readonly state = inject(StagingZustand);
  protected readonly session = inject(GuiSessionStore);
  protected readonly request = this.session.selected;
  protected readonly customer = this.state.customer;
  protected readonly comparison = () => this.state.comparison;
  protected readonly tabs = this.state.tabs;
  protected readonly selectedTab = this.state.requestTab;
  protected readonly statuses = () => this.ctx().statuses;
  protected readonly bereichs = this.state.bereichs;
  protected readonly bereichColumns = () => REQUEST_BEREICH_COLUMNS;
  protected readonly angebot = this.state.angebot;
  protected readonly angebotColumns = () => REQUEST_ANGEBOT_COLUMNS;
}
