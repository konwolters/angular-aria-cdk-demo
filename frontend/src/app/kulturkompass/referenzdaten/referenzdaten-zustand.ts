import { computed, Injectable, signal } from '@angular/core';
import { DataTableColumn } from '../../shared/data-table/data-table';
import { DEMO_REFERENZDATEN } from '../daten/gui-demodaten';
import { GuiRow } from '../daten/gui-modelle';

@Injectable()
export class ReferenzdatenZustand {
  readonly selectedTab = signal('land');
  readonly editing = signal(false);
  readonly tabs = [
    { value: 'land', label: 'Länder' },
    { value: 'geschaeft', label: 'Veranstaltungsarten' },
    { value: 'wertpapier', label: 'Angebotsformate' },
    { value: 'zusatz', label: 'Arten der Zusatzdaten' },
  ];
  readonly rows = DEMO_REFERENZDATEN;
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
