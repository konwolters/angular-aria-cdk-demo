import { DataTableColumn } from '../../shared/data-table/data-table';
import { GuiRow } from './gui-modelle';

function columns(definitions: string[][]): DataTableColumn<GuiRow>[] {
  return definitions.map(([key, header]) => ({ key, header, value: (row) => row[key] ?? '—' }));
}

export const CUSTOMER_COLUMNS = columns([
  ['name', 'Name'],
  ['kundennummer', 'Standortnummer'],
  ['bereichnummer', 'Bereichsnummer'],
  ['alertId', 'Standort-ID'],
  ['akronym', 'Standortkürzel'],
  ['lei', 'Registerkennung'],
  ['status', 'Status'],
  ['antrag', 'Offener Antrag'],
]);
const ANGEBOT_COLUMNS = columns([
  ['name', 'Veranstaltungsort'],
  ['bereichnummer', 'Bereichsnummer'],
  ['land', 'Land'],
  ['geschaeft', 'Veranstaltungsart'],
  ['wertpapier', 'Angebotsformat'],
  ['isin', 'Angebotscode'],
  ['konto', 'Kontakt-ID Ansprechperson'],
  ['bic', 'Kontaktcode Veranstaltungsteam'],
  ['antrag', 'Offener Antrag'],
  ['action', 'Aktion'],
]);
export const ANGEBOT_SEARCH_COLUMNS = ANGEBOT_COLUMNS.map((column) => ({
  ...column,
  width: column.key === 'name' ? '16rem' : column.key === 'land' ? '4.5rem' : undefined,
  minWidth: column.key === 'name' ? '14rem' : undefined,
}));
export const DETAIL_ANGEBOT_COLUMNS = ANGEBOT_COLUMNS.filter((column) => column.key !== 'antrag');
export const REQUEST_BEREICH_COLUMNS = columns([
  ['bereichnummer', 'Bereichsnummer'],
  ['bezeichnung', 'Bezeichnung'],
  ['aenderung', 'Änderung'],
  ['action', 'Aktion'],
]);
export const REQUEST_ANGEBOT_COLUMNS = columns([
  ['name', 'Veranstaltungsort'],
  ['bereichnummer', 'Bereichsnummer'],
  ['land', 'Land'],
  ['geschaeft', 'Veranstaltungsart'],
  ['wertpapier', 'Angebotsformat'],
  ['isin', 'Angebotscode'],
  ['konto', 'Kontakt-ID Ansprechperson'],
  ['bic', 'Kontaktcode Veranstaltungsteam'],
  ['aenderung', 'Änderung'],
  ['action', 'Aktion'],
]);
export const REQUEST_COLUMNS = columns([
  ['id', 'Antrag'],
  ['bereich', 'Änderungsumfang'],
  ['name', 'Veranstaltungsort'],
  ['quelle', 'Quelle'],
  ['art', 'Änderungsart'],
  ['ersteller', 'Antragsteller'],
  ['datum', 'Eingereicht am'],
  ['status', 'Status'],
  ['action', 'Aktion'],
]);
export const BEREICH_COLUMNS = columns([
  ['bereichnummer', 'Bereichsnummer'],
  ['bezeichnung', 'Bezeichnung'],
  ['anzahl', 'Angebote'],
  ['zusatzdaten', 'Zusatzdaten'],
  ['status', 'Status'],
  ['action', 'Aktion'],
]);
export const HISTORY_COLUMNS = columns([
  ['version', 'Version'],
  ['zeitpunkt', 'Zeitpunkt'],
  ['erstellt', 'Erstellt'],
  ['freigegeben', 'Freigegeben'],
  ['quelle', 'Quelle'],
  ['aktion', 'Aktion'],
  ['aenderung', 'Änderung'],
  ['details', 'Aktion'],
]);
