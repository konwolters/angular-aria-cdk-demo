import { computed, inject, Injectable, signal } from '@angular/core';
import { DEMO_CUSTOMERS, DEMO_BEREICHS, DEMO_REQUESTS, DEMO_ANGEBOT } from '../daten/gui-demodaten';
import { GuiPage } from '../daten/gui-modelle';
import { GuiSessionStore } from '../daten/gui-session-store';
import { ReferenzdatenZustand } from '../referenzdaten/referenzdaten-zustand';
import { exportVeranstaltungsorte, exportAngebot } from './suche-export';

/** Filter state is kept for the lifetime of the GUI, without persistence. */
@Injectable()
export class SucheZustand {
  private readonly session = inject(GuiSessionStore);
  private readonly references = inject(ReferenzdatenZustand);
  readonly page = signal<GuiPage>('veranstaltungsorte');
  readonly query = signal('');
  readonly appliedQuery = signal('');
  readonly countries = signal<string[]>([]);
  readonly businessTypes = signal<string[]>([]);
  readonly referenceTypes = signal<string[]>([]);
  readonly rows = computed(() => {
    const source =
      this.page() === 'angebot'
        ? DEMO_ANGEBOT
        : this.page() === 'staging'
          ? DEMO_REQUESTS
          : DEMO_CUSTOMERS;
    const query = this.appliedQuery().trim().toLocaleLowerCase('de');
    return query
      ? source.filter((row) =>
          Object.values(row).some((value) => value.toLocaleLowerCase('de').includes(query)),
        )
      : source;
  });
  exportResults(): void {
    if (this.page() === 'veranstaltungsorte') {
      exportVeranstaltungsorte(
        this.rows(),
        DEMO_BEREICHS,
        this.session.bereichZusatzdaten(),
        this.references.zusatzarten,
      );
    } else if (this.page() === 'angebot') {
      exportAngebot(this.rows(), DEMO_ANGEBOT, DEMO_CUSTOMERS);
    }
  }
}
