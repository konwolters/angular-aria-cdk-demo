import { KulturkompassDatenService } from '../daten/kulturkompass-daten.service';
import { computed, inject, Service, signal } from '@angular/core';
import { ImportService } from '../import/import.service';
import { GuiRow } from '../daten/gui-modelle';

@Service({ autoProvided: false })
export class StagingService {
  private readonly daten = inject(KulturkompassDatenService);
  readonly request = signal<GuiRow | null>(null);
  private readonly imports = inject(ImportService);
  findById(id: string | null): GuiRow | null {
    return (
      this.daten.antraege.find((row) => row.id === id) ??
      this.imports.resultRows.find((row) => row['id'] === id) ??
      null
    );
  }
  findForRow(row: GuiRow, bereich: string): GuiRow | null {
    return (
      this.daten.antraege.find((item) => item.name === row['name'] && item.bereich === bereich) ??
      null
    );
  }
  readonly requestTab = signal('stammdaten');
  readonly customer = computed(
    () =>
      this.daten.veranstaltungsorte.find(
        (customer) => customer.name === this.request()?.['name'],
      ) ?? null,
  );
  readonly comparison = { version: '3', changedField: 'alertId' };
  readonly tabs = computed(() =>
    this.request()?.['bereich'] === 'Angebote'
      ? [{ value: 'angebot', label: 'Angebote' }]
      : [
          { value: 'stammdaten', label: 'Stammdaten' },
          { value: 'bereichs', label: 'Bereiche' },
        ],
  );
  readonly bereichs = computed(() =>
    this.daten.bereiche.slice(0, 1).map((row) => ({ ...row, aenderung: 'GEÄNDERT' })),
  );
  readonly angebot = computed(() =>
    this.daten.angebote
      .filter((row) => row.name === this.request()?.['name'])
      .slice(0, 1)
      .map((row) => ({ ...row, aenderung: 'GEÄNDERT' })),
  );
}
