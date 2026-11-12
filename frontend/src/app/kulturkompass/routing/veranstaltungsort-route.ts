import { Component, inject } from '@angular/core';
import { VeranstaltungsortDetailSeiteComponent } from '../veranstaltungsorte/veranstaltungsort-detail-seite';
import { VeranstaltungsortDetailZustand } from '../veranstaltungsorte/veranstaltungsort-detail-zustand';
import { GuiSessionStore } from '../daten/gui-session-store';
import { BEREICH_COLUMNS, DETAIL_ANGEBOT_COLUMNS, HISTORY_COLUMNS } from '../daten/gui-spalten';
import { DEMO_HISTORIE } from '../daten/gui-demodaten';
import { ReferenzdatenZustand } from '../referenzdaten/referenzdaten-zustand';
import { injectGuiRouteContext } from './gui-route-context';

@Component({
  selector: 'app-veranstaltungsort-route',
  imports: [VeranstaltungsortDetailSeiteComponent],
  templateUrl: './veranstaltungsort-route.html',
})
export class VeranstaltungsortRouteComponent {
  protected readonly ctx = injectGuiRouteContext();
  protected readonly state = inject(VeranstaltungsortDetailZustand);
  protected readonly session = inject(GuiSessionStore);
  protected readonly references = inject(ReferenzdatenZustand);
  protected readonly bereichColumns = BEREICH_COLUMNS;
  protected readonly angebotColumns = DETAIL_ANGEBOT_COLUMNS;
  protected readonly historyColumns = HISTORY_COLUMNS;
  protected readonly history = DEMO_HISTORIE;
}
