import { Component, inject } from '@angular/core';
import { AntragSeiteComponent } from '../staging/antrag-seite';
import { StagingZustand } from '../staging/staging-zustand';
import { GuiSessionStore } from '../daten/gui-session-store';
import { REQUEST_BEREICH_COLUMNS, REQUEST_ANGEBOT_COLUMNS } from '../daten/gui-spalten';
import { injectGuiRouteContext } from './gui-route-context';

@Component({
  selector: 'app-antrag-route',
  imports: [AntragSeiteComponent],
  templateUrl: './antrag-route.html',
})
export class AntragRouteComponent {
  protected readonly ctx = injectGuiRouteContext();
  protected readonly state = inject(StagingZustand);
  protected readonly session = inject(GuiSessionStore);
  protected readonly bereichColumns = REQUEST_BEREICH_COLUMNS;
  protected readonly angebotColumns = REQUEST_ANGEBOT_COLUMNS;
}
