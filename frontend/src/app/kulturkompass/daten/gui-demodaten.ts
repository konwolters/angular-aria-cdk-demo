import fixtures from '../../../../../backend/src/main/resources/kulturkompass-demo.json';
import { Antrag, Bereich, GuiRow, Veranstaltungsort, Angebot } from './gui-modelle';

export const DEMO_CUSTOMERS: Veranstaltungsort[] = fixtures.veranstaltungsorte;
export const DEMO_ANGEBOT: Angebot[] = fixtures.angebote.map((angebot) => ({
  ...angebot,
  zusatzinfo: angebot.zusatzinfo ?? '',
}));
export const DEMO_REQUESTS: Antrag[] = fixtures.antraege;

export const DEMO_BEREICHS: Bereich[] = fixtures.bereiche;
export const DEMO_BEREICH_ZUSATZDATEN = fixtures.bereichZusatzdaten;

export const DEMO_REFERENZDATEN: Record<string, GuiRow[]> = {
  land: [
    { code: 'DE', bezeichnung: 'Deutschland', verwahrart: '004', status: 'Aktiv', antrag: '—' },
    { code: 'LU', bezeichnung: 'Luxemburg', verwahrart: '005', status: 'Aktiv', antrag: '—' },
  ],
  geschaeft: [
    { code: 'WORKSHOP', bezeichnung: 'Workshop', status: 'Aktiv', antrag: '—' },
    { code: 'AUSSTELLUNG', bezeichnung: 'Ausstellung', status: 'Aktiv', antrag: '—' },
  ],
  wertpapier: [
    { code: 'PRAESENZ', bezeichnung: 'Präsenz', status: 'Aktiv', antrag: '—' },
    { code: 'ONLINE', bezeichnung: 'Online', status: 'Aktiv', antrag: '—' },
  ],
  zusatz: [{ code: 'KONTAKT', bezeichnung: 'Kontakt', status: 'Aktiv', antrag: '—' }],
};

export const DEMO_HISTORIE: GuiRow[] = [
  {
    version: '3',
    zeitpunkt: '15.10.2026 10:15',
    erstellt: 'HT10234',
    freigegeben: 'HT11345',
    quelle: 'Manuell',
    aktion: 'Ändern',
    aenderung: 'Veranstaltungsort & Bereiche',
    changedField: 'alertId',
  },
  {
    version: '2',
    zeitpunkt: '10.10.2026 14:30',
    erstellt: 'HT11345',
    freigegeben: 'HT10234',
    quelle: 'CSV',
    aktion: 'Ändern',
    aenderung: 'Veranstaltungsort & Bereiche',
    changedField: 'akronym',
  },
  {
    version: '1',
    zeitpunkt: '01.10.2026 09:00',
    erstellt: 'HT10234',
    freigegeben: 'HT11345',
    quelle: 'Manuell',
    aktion: 'Anlegen',
    aenderung: 'Veranstaltungsort & Bereiche',
  },
];

export const DEMO_IMPORT_GRUPPEN: GuiRow[] = [
  {
    name: 'Kulturhaus Sonnenhof',
    anzahl: '2',
    aenderungen: '1 neu, 1 geändert',
    konflikt: 'Frei',
    ergebnis: '1 Antrag',
  },
  {
    name: 'Forum Lindenpark',
    anzahl: '1',
    aenderungen: '0 neu, 1 geändert',
    konflikt: 'Frei',
    ergebnis: '1 Antrag',
  },
];
