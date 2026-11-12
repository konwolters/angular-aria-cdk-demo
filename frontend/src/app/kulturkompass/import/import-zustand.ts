import { computed, inject, Injectable, signal } from '@angular/core';
import { DataTableColumn } from '../../shared/data-table/data-table';
import {
  DEMO_CUSTOMERS,
  DEMO_BEREICHS,
  DEMO_IMPORT_GRUPPEN,
  DEMO_REFERENZDATEN,
  DEMO_ANGEBOT,
} from '../daten/gui-demodaten';
import { GuiRow } from '../daten/gui-modelle';
import { GuiSessionStore } from '../daten/gui-session-store';
import { importVorschau } from './import-vorschau';

@Injectable()
export class ImportZustand {
  private readonly session = inject(GuiSessionStore);
  readonly stage = signal('datei');
  readonly file = signal<File | null>(null);
  readonly dataType = signal('angebot');
  readonly importTypes = [
    { value: 'angebot', label: 'Angebote' },
    { value: 'veranstaltungsort', label: 'Veranstaltungsorte & Bereiche' },
  ];
  readonly steps = [
    { value: 'datei', label: 'Datei wählen' },
    { value: 'vorschau', label: 'Zeilenvorschau' },
    { value: 'gruppen', label: 'Gruppierung' },
    { value: 'ergebnis', label: 'Ergebnis' },
  ];
  readonly completedSteps = computed(() =>
    this.steps
      .slice(
        0,
        this.steps.findIndex((step) => step.value === this.stage()),
      )
      .map((step) => step.value),
  );
  private readonly angebotColumns = this.columns([
    ['zeile', 'Zeile'],
    ['name', 'Veranstaltungsort'],
    ['bereichnummer', 'Bereichsnummer'],
    ['land', 'Land'],
    ['geschaeft', 'Veranstaltungsart'],
    ['wertpapier', 'Angebotsformat'],
    ['isin', 'Angebotscode'],
    ['loeschen', 'Löschen'],
    ['aktion', 'Aktion'],
    ['fehler', 'Fehler'],
  ]).map((column) => ({
    ...column,
    width: column.key === 'name' ? '16rem' : column.key === 'land' ? '4.5rem' : undefined,
    minWidth: column.key === 'name' ? '14rem' : undefined,
  }));
  private readonly customerColumns = this.columns([
    ['zeile', 'Zeile'],
    ['name', 'Veranstaltungsort'],
    ['alertId', 'Standort-ID'],
    ['akronym', 'Standortkürzel'],
    ['lei', 'Registerkennung'],
    ['status', 'Status'],
    ['bereichnummer', 'Bereichsnummer'],
    ['bereichbezeichnung', 'Bereichsbezeichnung'],
    ['bereichstatus', 'Bereichsstatus'],
    ['kommentar', 'Kommentar'],
    ['zusatzdaten', 'Zusatzdaten'],
    ['aktion', 'Aktion'],
    ['fehler', 'Fehler'],
  ]);
  readonly previewColumns = computed(() =>
    this.dataType() === 'veranstaltungsort' ? this.customerColumns : this.angebotColumns,
  );
  readonly groupColumns = this.columns([
    ['name', 'Betroffener Veranstaltungsort'],
    ['anzahl', 'Importzeilen'],
    ['aenderungen', 'Änderungen'],
    ['konflikt', 'Konfliktstatus'],
    ['ergebnis', 'Ergebnis'],
  ]);
  readonly groupRows = DEMO_IMPORT_GRUPPEN;
  readonly previewRows = computed(() =>
    importVorschau(
      this.dataType(),
      DEMO_CUSTOMERS,
      DEMO_BEREICHS,
      DEMO_ANGEBOT,
      this.session.bereichZusatzdaten(),
      DEMO_REFERENZDATEN['zusatz']
        .filter((row) => row['status'] === 'Aktiv')
        .map((row) => ({ value: row['code'], label: row['bezeichnung'] })),
    ),
  );
  readonly resultColumns = this.columns([
    ['id', 'Antragsnummer'],
    ['action', 'Aktion'],
  ]);
  readonly resultRows: GuiRow[] = this.groupRows.map((group, index) => ({
    id: `E-IMPORT-${String(index + 1).padStart(4, '0')}`,
    name: group['name'],
    bereich: 'Angebote',
    art: 'Ändern',
    quelle: 'CSV',
    status: 'Entwurf',
    ersteller: 'HT10234',
  }));

  private columns(definitions: string[][]): DataTableColumn<GuiRow>[] {
    return definitions.map(([key, header]) => ({ key, header, value: (row) => row[key] ?? '—' }));
  }
}
