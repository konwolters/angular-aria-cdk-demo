import { KulturkompassDatenService } from '../daten/kulturkompass-daten.service';
import { computed, inject, Service, signal } from '@angular/core';
import { ImportService } from '../import/import.service';
import { GuiRow } from '../daten/gui-modelle';

@Service({ autoProvided: false })
export class StagingService {
  private readonly kulturkompassDatenService = inject(KulturkompassDatenService);
  private readonly importService = inject(ImportService);

  readonly request = signal<GuiRow | null>(null);

  findById(id: string | null): GuiRow | null {
    return (
      this.kulturkompassDatenService.antraege.find((row) => row.id === id) ??
      this.importService.resultRows.find((row) => row['id'] === id) ??
      null
    );
  }

  findForRow(row: GuiRow, bereich: string): GuiRow | null {
    return (
      this.kulturkompassDatenService.antraege.find(
        (item) => item.name === row['name'] && item.bereich === bereich,
      ) ?? null
    );
  }

  readonly requestTab = signal('stammdaten');
  readonly customer = computed(
    () =>
      this.kulturkompassDatenService.veranstaltungsorte.find(
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
    this.kulturkompassDatenService.bereiche
      .slice(0, 1)
      .map((row) => ({ ...row, aenderung: 'GEÄNDERT' })),
  );
  readonly angebot = computed(() =>
    this.kulturkompassDatenService.angebote
      .filter((row) => row.name === this.request()?.['name'])
      .slice(0, 1)
      .map((row) => ({ ...row, aenderung: 'GEÄNDERT' })),
  );
}
