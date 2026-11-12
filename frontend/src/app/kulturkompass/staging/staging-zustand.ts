import { computed, inject, Injectable, signal } from '@angular/core';
import { DEMO_CUSTOMERS, DEMO_BEREICHS, DEMO_ANGEBOT } from '../daten/gui-demodaten';
import { GuiSessionStore } from '../daten/gui-session-store';

@Injectable()
export class StagingZustand {
  private readonly session = inject(GuiSessionStore);
  readonly requestTab = signal('stammdaten');
  readonly customer = computed(
    () =>
      DEMO_CUSTOMERS.find((customer) => customer.name === this.session.selected()?.['name']) ??
      null,
  );
  readonly comparison = { version: '3', changedField: 'alertId' };
  readonly tabs = computed(() =>
    this.session.selected()?.['bereich'] === 'Angebote'
      ? [{ value: 'angebot', label: 'Angebote' }]
      : [
          { value: 'stammdaten', label: 'Stammdaten' },
          { value: 'bereichs', label: 'Bereiche' },
        ],
  );
  readonly bereichs = computed(() =>
    DEMO_BEREICHS.slice(0, 1).map((row) => ({ ...row, aenderung: 'GEÄNDERT' })),
  );
  readonly angebot = computed(() =>
    DEMO_ANGEBOT.filter((row) => row.name === this.session.selected()?.['name'])
      .slice(0, 1)
      .map((row) => ({ ...row, aenderung: 'GEÄNDERT' })),
  );
}
