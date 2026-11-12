import { KulturkompassDatenService } from '../daten/kulturkompass-daten.service';
import { computed, inject, Service, signal } from '@angular/core';
import { GuiRow } from '../daten/gui-modelle';
import { GuiSessionService } from '../daten/gui-session.service';

@Service({ autoProvided: false })
export class VeranstaltungsortService {
  private readonly daten = inject(KulturkompassDatenService);
  private readonly session = inject(GuiSessionService);
  readonly selected = signal<GuiRow | null>(null);
  readonly historical = signal<GuiRow | null>(null);
  readonly editing = signal(false);
  readonly editScope = signal<'veranstaltungsort' | 'angebot'>('veranstaltungsort');
  readonly activeTab = signal('stammdaten');
  readonly bereichFilter = signal('alle');
  readonly bereichStatus = signal('aktiv');
  readonly name = signal('');
  findByNumber(nummer: string | null): GuiRow | null {
    return this.daten.veranstaltungsorte.find((row) => row.kundennummer === nummer) ?? null;
  }
  beginEditing(scope: 'veranstaltungsort' | 'angebot'): void {
    this.name.set(this.selected()?.['name'] || '');
    this.session.customerNumber.set(this.selected()?.['kundennummer'] || '');
    this.editScope.set(scope);
    this.editing.set(true);
    this.activeTab.set(scope === 'angebot' ? 'angebot' : 'stammdaten');
  }
  readonly bereichs = computed<GuiRow[]>(() => {
    const numbers = this.selected()?.['bereichnummer']?.split(', ') ?? [];
    return numbers.map(
      (number) =>
        this.daten.bereiche.find((bereich) => bereich.bereichnummer === number) ?? {
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
    this.daten.angebote.filter(
      (row) =>
        row.name === this.selected()?.['name'] &&
        (this.bereichFilter() === 'alle' || row.bereichnummer === this.bereichFilter()),
    ),
  );
  readonly totalAngebot = computed(
    () => this.daten.angebote.filter((row) => row.name === this.selected()?.['name']).length,
  );
  readonly tabs = computed(() => [
    { value: 'stammdaten', label: 'Stammdaten' },
    { value: 'bereichs', label: `Bereiche (${this.bereichs().length})` },
    { value: 'angebot', label: `Angebote (${this.totalAngebot()})` },
    ...(this.historical() ? [] : [{ value: 'historie', label: 'Historie' }]),
  ]);
}
