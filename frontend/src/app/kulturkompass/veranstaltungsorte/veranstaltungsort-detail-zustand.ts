import { computed, inject, Injectable, signal } from '@angular/core';
import { DEMO_BEREICHS, DEMO_ANGEBOT } from '../daten/gui-demodaten';
import { GuiRow } from '../daten/gui-modelle';
import { GuiSessionStore } from '../daten/gui-session-store';

@Injectable()
export class VeranstaltungsortDetailZustand {
  private readonly session = inject(GuiSessionStore);
  readonly historical = signal<GuiRow | null>(null);
  readonly editing = signal(false);
  readonly editScope = signal<'veranstaltungsort' | 'angebot'>('veranstaltungsort');
  readonly activeTab = signal('stammdaten');
  readonly bereichFilter = signal('alle');
  readonly bereichStatus = signal('aktiv');
  readonly name = signal('');
  readonly bereichs = computed<GuiRow[]>(() => {
    const numbers = this.session.selected()?.['bereichnummer']?.split(', ') ?? [];
    return numbers.map(
      (number) =>
        DEMO_BEREICHS.find((bereich) => bereich.bereichnummer === number) ?? {
          bereichnummer: number,
          bezeichnung: 'Bereich',
          status: 'Aktiv',
          anzahl: '0',
        },
    );
  });
  readonly bereichOptions = computed(() => [
    { value: 'alle', label: 'Alle Bereiche' },
    ...this.bereichs().map((bereich) => ({
      value: bereich['bereichnummer'],
      label: bereich['bereichnummer'],
    })),
  ]);
  readonly filteredBereichs = computed(() =>
    this.bereichs().filter(
      (bereich) =>
        (this.bereichFilter() === 'alle' || bereich['bereichnummer'] === this.bereichFilter()) &&
        (this.bereichStatus() === 'alle' ||
          bereich['status'].toLowerCase() === this.bereichStatus()),
    ),
  );
  readonly angebot = computed(() =>
    DEMO_ANGEBOT.filter(
      (row) =>
        row.name === this.session.selected()?.['name'] &&
        (this.bereichFilter() === 'alle' || row.bereichnummer === this.bereichFilter()),
    ),
  );
  readonly totalAngebot = computed(
    () => DEMO_ANGEBOT.filter((row) => row.name === this.session.selected()?.['name']).length,
  );
  readonly tabs = computed(() => [
    { value: 'stammdaten', label: 'Stammdaten' },
    { value: 'bereichs', label: `Bereiche (${this.bereichs().length})` },
    { value: 'angebot', label: `Angebote (${this.totalAngebot()})` },
    ...(this.historical() ? [] : [{ value: 'historie', label: 'Historie' }]),
  ]);
}
