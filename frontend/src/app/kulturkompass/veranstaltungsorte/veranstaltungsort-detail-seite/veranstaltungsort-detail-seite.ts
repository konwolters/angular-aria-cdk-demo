import { Component, inject } from '@angular/core';
import type { Signal } from '@angular/core';
import { ROUTER_OUTLET_DATA, RouterLink } from '@angular/router';
import type { GuiPageContext } from '../../kulturkompass';
import { VeranstaltungsortDetailZustand } from '../veranstaltungsort-detail-zustand';
import { GuiSessionStore } from '../../daten/gui-session-store';
import { ReferenzdatenZustand } from '../../referenzdaten/referenzdaten-zustand';
import { BEREICH_COLUMNS, DETAIL_ANGEBOT_COLUMNS, HISTORY_COLUMNS } from '../../daten/gui-spalten';
import { DEMO_HISTORIE } from '../../daten/gui-demodaten';
import { ButtonComponent } from '../../../shared/button/button';
import { VeranstaltungsortDetailTabsComponent } from '../veranstaltungsort-detail-tabs/veranstaltungsort-detail-tabs';

@Component({
  selector: 'app-veranstaltungsort-detail-seite',
  imports: [ButtonComponent, VeranstaltungsortDetailTabsComponent, RouterLink],
  templateUrl: './veranstaltungsort-detail-seite.html',
})
export class VeranstaltungsortDetailSeiteComponent {
  protected readonly ctx = inject(ROUTER_OUTLET_DATA) as Signal<GuiPageContext>;
  protected readonly state = inject(VeranstaltungsortDetailZustand);
  protected readonly session = inject(GuiSessionStore);
  protected readonly references = inject(ReferenzdatenZustand);
  protected readonly tabs = this.state.tabs;
  protected readonly selected = this.session.selected;
  protected readonly historical = this.state.historical;
  protected readonly editing = this.state.editing;
  protected readonly editScope = this.state.editScope;
  protected readonly activeTab = this.state.activeTab;
  protected readonly name = this.state.name;
  protected readonly customerNumber = this.session.customerNumber;
  protected readonly status = this.session.status;
  protected readonly bereichFilter = this.state.bereichFilter;
  protected readonly bereichStatus = this.state.bereichStatus;
  protected readonly statuses = () => this.ctx().statuses;
  protected readonly bereichs = this.state.filteredBereichs;
  protected readonly totalBereichs = () => this.state.bereichs().length;
  protected readonly bereichColumns = () => BEREICH_COLUMNS;
  protected readonly zusatzdaten = this.session.bereichZusatzdaten;
  protected readonly zusatzarten = () => this.references.zusatzarten;
  protected readonly bereichOptions = this.state.bereichOptions;
  protected readonly angebot = this.state.angebot;
  protected readonly totalAngebot = this.state.totalAngebot;
  protected readonly angebotColumns = () => DETAIL_ANGEBOT_COLUMNS;
  protected readonly historyRows = () => DEMO_HISTORIE;
  protected readonly historyColumns = () => HISTORY_COLUMNS;
}
