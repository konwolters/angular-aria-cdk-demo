/** Tabellenkompatible Daten für die lokale GUI. */
export type GuiRow = Record<string, string>;
export type GuiPage =
  'veranstaltungsorte' | 'angebot' | 'import' | 'staging' | 'referenzdaten' | 'detail' | 'antrag';

export interface Veranstaltungsort extends GuiRow {
  name: string;
  kundennummer: string;
  bereichnummer: string;
  alertId: string;
  akronym: string;
  lei: string;
  status: string;
  antrag: string;
}

export interface Angebot extends GuiRow {
  name: string;
  bereichnummer: string;
  land: string;
  geschaeft: string;
  wertpapier: string;
  isin: string;
  konto: string;
  agentBic: string;
  bic: string;
  antrag: string;
}

export interface Bereich extends GuiRow {
  bereichnummer: string;
  bezeichnung: string;
  status: string;
  anzahl: string;
}

export interface Antrag extends GuiRow {
  id: string;
  bereich: string;
  name: string;
  quelle: string;
  art: string;
  ersteller: string;
  datum: string;
  status: string;
}
