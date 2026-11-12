import { SelectOption } from '../../shared/select/select';
import { GuiRow } from '../daten/gui-modelle';
import { BereichZusatzdatum } from '../bereich-detail/bereich-detail';
import { downloadGuiCsv } from '../gui-csv-export';

export function exportVeranstaltungsorte(
  rows: readonly GuiRow[],
  allBereichs: readonly GuiRow[],
  zusatzdaten: Readonly<Record<string, readonly BereichZusatzdatum[]>>,
  zusatzarten: readonly SelectOption[],
): void {
  const bereichs = rows.flatMap((customer) =>
    customer['bereichnummer']
      .split(', ')
      .filter(Boolean)
      .map((number) => ({ customer, number })),
  );
  if (!bereichs.length) return;
  const count = Math.max(1, ...bereichs.map(({ number }) => (zusatzdaten[number] ?? []).length));
  const headers = [
    'Name',
    'Standortnummer',
    'Standort_ID',
    'Standortkuerzel',
    'Registerkennung',
    'Veranstaltungsort_Status',
    'Bereichsnummer',
    'Bereich_Bezeichnung',
    'Bereich_Status',
    'Bereich_Kommentar',
  ];
  for (let i = 1; i <= count; i++)
    headers.push(`Zusatz${i}_ID`, `Zusatz${i}_Art`, `Zusatz${i}_Wert`, `Zusatz${i}_Beschreibung`);
  const data = bereichs.map(({ customer, number }) => {
    const bereich = allBereichs.find((item) => item['bereichnummer'] === number);
    const entries = zusatzdaten[number] ?? [];
    const values = [
      customer['name'],
      customer['kundennummer'],
      customer['alertId'],
      customer['akronym'],
      customer['lei'],
      customer['status'],
      number,
      bereich?.['bezeichnung'] ?? 'Bereich',
      bereich?.['status'] ?? 'Aktiv',
      bereich?.['kommentar'] ?? '',
    ];
    for (let i = 0; i < count; i++) {
      const entry = entries[i];
      values.push(
        entry ? String(entry.id) : '',
        entry ? (zusatzarten.find((art) => art.value === entry.art)?.label ?? entry.art) : '',
        entry?.wert ?? '',
        entry?.beschreibung ?? '',
      );
    }
    return values;
  });
  downloadGuiCsv('veranstaltungsorte_export_demo.csv', headers, data);
}

export function exportAngebot(
  rows: readonly GuiRow[],
  allAngebot: readonly GuiRow[],
  customers: readonly GuiRow[],
): void {
  if (!rows.length) return;
  const participants = [
    {
      name: 'Ansprechperson',
      fields: [
        ['Kontakt-ID', 'konto'],
        ['Kontaktcode', 'agentBic'],
        ['PC', 'agPc'],
      ],
    },
    {
      name: 'Organisationsteam',
      fields: [
        ['Kontakt-ID', 'dsKonto'],
        ['Kontaktcode', 'dsBic'],
        ['PC', 'dsPc'],
        ['Name', 'dsName'],
      ],
    },
    {
      name: 'Veranstaltungsteam',
      fields: [
        ['Kontakt-ID', 'ktKonto'],
        ['Kontaktcode', 'bic'],
        ['PC', 'ktPc'],
        ['Name', 'ktName'],
      ],
    },
    {
      name: 'Technikpartner',
      fields: [
        ['Kontakt-ID', 'i1Konto'],
        ['Kontaktcode', 'i1Bic'],
        ['PC', 'i1Pc'],
        ['Name', 'i1Name'],
      ],
    },
    {
      name: 'Servicepartner',
      fields: [
        ['Kontakt-ID', 'i2Konto'],
        ['Kontaktcode', 'i2Bic'],
        ['PC', 'i2Pc'],
        ['Name', 'i2Name'],
      ],
    },
  ];
  const headers = [
    'Angebot_ID',
    'Bereichsnummer',
    'Veranstaltungsort',
    'Standortnummer',
    'Land',
    'Veranstaltungsart',
    'Angebotsformat',
    'Angebotscode',
    'Kontaktcode_Veranstaltungsort',
  ];
  for (const participant of participants)
    headers.push(
      ...participant.fields.map(([label]) =>
        `${label} ${participant.name}`.replace(/[^A-Za-z0-9]+/g, '_'),
      ),
    );
  headers.push('Loeschen');
  const data = rows.map((row) => [
    `Angebote-DEMO-${String(allAngebot.indexOf(row) + 1).padStart(4, '0')}`,
    row['bereichnummer'],
    row['name'],
    customers.find((customer) => customer['name'] === row['name'])?.['kundennummer'] ?? '',
    row['land'],
    row['geschaeft'],
    row['wertpapier'],
    row['isin'],
    row['psetBic'] ?? '',
    ...participants.flatMap((participant) => participant.fields.map(([, key]) => row[key] ?? '')),
    '',
  ]);
  downloadGuiCsv('angebote_export_demo.csv', headers, data);
}
