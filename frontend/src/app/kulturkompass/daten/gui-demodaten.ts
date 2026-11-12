import { Antrag, Bereich, GuiRow, Veranstaltungsort, Angebot } from './gui-modelle';

export const DEMO_CUSTOMERS: Veranstaltungsort[] = [
  {
    name: 'Kulturhaus Sonnenhof',
    kundennummer: '100001',
    bereichnummer: '10010001, 10010002, 10010003, 10010004, 10010005, 10010006, 10010007',
    alertId: '123456',
    akronym: 'SONNE',
    lei: 'ORT-SONNENHOF-001',
    status: 'Aktiv',
    antrag: 'Ja',
  },
  {
    name: 'Forum Lindenpark',
    kundennummer: '100002',
    bereichnummer: '10020001',
    alertId: '234567',
    akronym: 'LINDE',
    lei: 'ORT-LINDENPARK-002',
    status: 'Aktiv',
    antrag: '—',
  },
  {
    name: 'Werkstatt am See',
    kundennummer: '100003',
    bereichnummer: '10030001',
    alertId: '345678',
    akronym: 'SEE',
    lei: 'ORT-WERKSTATT-003',
    status: 'Aktiv',
    antrag: '—',
  },
];

export const DEMO_ANGEBOT: Angebot[] = [
  {
    name: 'Kulturhaus Sonnenhof',
    bereichnummer: '10010001',
    land: 'DE',
    geschaeft: 'Workshop',
    wertpapier: 'Präsenz',
    isin: 'ANG-DE-0001',
    konto: '123456789',
    agentBic: 'TEAM-ORGA',
    bic: 'TEAM-SONNE',
    antrag: 'Ja',
  },
  {
    name: 'Forum Lindenpark',
    bereichnummer: '10020001',
    land: 'LU',
    geschaeft: 'Ausstellung',
    wertpapier: 'Online',
    isin: 'ANG-LU-0001',
    konto: '987654321',
    agentBic: 'TEAM-ORGA',
    bic: 'TEAM-LINDE',
    antrag: '—',
  },
  ...Array.from({ length: 18 }, (_, index) => {
    const union = index % 2 === 0;
    const land = ['DE', 'LU', 'US'][index % 3];
    return {
      name: union ? 'Kulturhaus Sonnenhof' : 'Forum Lindenpark',
      bereichnummer: union ? ['10010001', '10010002', '10010003'][index % 3] : '10020001',
      land,
      geschaeft: index % 3 === 0 ? 'Workshop' : 'Ausstellung',
      wertpapier: index % 2 === 0 ? 'Präsenz' : 'Online',
      isin: `ANG-${land}-${String(index + 10).padStart(4, '0')}`,
      konto: String(120000000 + index),
      agentBic: 'TEAM-ORGA',
      bic: land === 'LU' ? 'TEAM-LINDE' : land === 'US' ? 'TEAM-SEE' : 'TEAM-SONNE',
      antrag: '—',
    };
  }),
];

export const DEMO_REQUESTS: Antrag[] = [
  {
    id: 'M-2026-0001',
    bereich: 'Angebote',
    name: '2 Veranstaltungsorte',
    quelle: 'CSV',
    art: 'Massenänderung',
    ersteller: 'MMUELLER',
    datum: '15.10.2026',
    status: 'Eingereicht',
  },
  {
    id: 'E-2026-0041',
    bereich: 'Veranstaltungsort & Bereiche',
    name: 'Kulturhaus Sonnenhof',
    quelle: 'Manuell',
    art: 'Ändern',
    ersteller: 'ASCHMIDT',
    datum: '14.10.2026',
    status: 'Eingereicht',
  },
  {
    id: 'E-2026-0042',
    bereich: 'Angebote',
    name: 'Kulturhaus Sonnenhof',
    quelle: 'Manuell',
    art: 'Ändern',
    ersteller: 'ASCHMIDT',
    datum: '14.10.2026',
    status: 'Eingereicht',
  },
];

export const DEMO_BEREICHS: Bereich[] = [
  { bereichnummer: '10010001', bezeichnung: 'Hauptsaal', status: 'Aktiv', anzahl: '2' },
  { bereichnummer: '10010002', bezeichnung: 'Atelier', status: 'Aktiv', anzahl: '1' },
  { bereichnummer: '10010003', bezeichnung: 'Foyer', status: 'Aktiv', anzahl: '0' },
  { bereichnummer: '10010004', bezeichnung: 'Studio', status: 'Aktiv', anzahl: '0' },
  { bereichnummer: '10010005', bezeichnung: 'Galerie', status: 'Aktiv', anzahl: '0' },
  { bereichnummer: '10010006', bezeichnung: 'Außenbereich', status: 'Aktiv', anzahl: '0' },
  { bereichnummer: '10010007', bezeichnung: 'Proberaum', status: 'Aktiv', anzahl: '0' },
];

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
