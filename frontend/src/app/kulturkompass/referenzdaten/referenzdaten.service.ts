import { KulturkompassDatenService } from '../daten/kulturkompass-daten.service';
import { computed, inject, Service, signal } from '@angular/core';
import { form, readonly as readonlyField } from '@angular/forms/signals';
import { DataTableColumn } from '../../shared/data-table/data-table';
import { GuiRow } from '../daten/gui-modelle';

@Service({ autoProvided: false })
export class ReferenzdatenService {
  private readonly daten = inject(KulturkompassDatenService);
  readonly selectedTab = signal('land');
  readonly editing = signal(false);
  private readonly existing = signal(false);
  readonly editorModel = signal({ code: '', bezeichnung: '', verwahrart: '', status: 'aktiv' });
  readonly editorForm = form(this.editorModel, (path) =>
    readonlyField(path.code, { when: () => this.existing() }),
  );
  prepareEditor(row: GuiRow | null): void {
    this.existing.set(!!row);
    this.editorModel.set({
      code: row?.['code'] || '',
      bezeichnung: row?.['bezeichnung'] || '',
      verwahrart: row?.['verwahrart'] || '',
      status: 'aktiv',
    });
  }
  readonly tabs = [
    { value: 'land', label: 'Länder' },
    { value: 'geschaeft', label: 'Veranstaltungsarten' },
    { value: 'wertpapier', label: 'Angebotsformate' },
    { value: 'zusatz', label: 'Arten der Zusatzdaten' },
  ];
  readonly rows = this.daten.referenzdaten;
  readonly zusatzarten = this.rows['zusatz']
    .filter((row) => row['status'] === 'Aktiv')
    .map((row) => ({ value: row['code'], label: row['bezeichnung'] }));
  readonly columns: Record<string, DataTableColumn<GuiRow>[]> = {
    land: this.makeColumns([
      ['code', 'Kurzbezeichnung'],
      ['bezeichnung', 'Bezeichnung'],
      ['verwahrart', 'Regionscode'],
      ['status', 'Status'],
      ['antrag', 'Offener Antrag'],
    ]),
    geschaeft: this.makeColumns([
      ['code', 'Kurzbezeichnung'],
      ['bezeichnung', 'Bezeichnung'],
      ['status', 'Status'],
      ['antrag', 'Offener Antrag'],
    ]),
    wertpapier: this.makeColumns([
      ['code', 'Kurzbezeichnung'],
      ['bezeichnung', 'Bezeichnung'],
      ['status', 'Status'],
      ['antrag', 'Offener Antrag'],
    ]),
    zusatz: this.makeColumns([
      ['bezeichnung', 'Bezeichnung'],
      ['status', 'Status'],
      ['antrag', 'Offener Antrag'],
    ]),
  };
  readonly editableColumns = computed(() => [
    ...this.columns[this.selectedTab()].filter((column) => column.key !== 'antrag'),
    ...this.makeColumns([
      ['aenderung', 'Änderung'],
      ['action', 'Aktion'],
    ]),
  ]);
  private makeColumns(definitions: string[][]): DataTableColumn<GuiRow>[] {
    return definitions.map(([key, header]) => ({ key, header, value: (row) => row[key] ?? '—' }));
  }
}
