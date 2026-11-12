import { DiffEntry } from '../../shared/diff-view/diff-view';
import { GuiRow } from '../daten/gui-modelle';

export function antragDiff(kind: 'angebot' | 'bereich', row: GuiRow): DiffEntry[] {
  if (kind === 'bereich') {
    return [
      {
        key: 'bereichnummer',
        label: 'Bereichsnummer',
        before: row['bereichnummer'],
        after: row['bereichnummer'],
      },
      {
        key: 'bezeichnung',
        label: 'Bezeichnung',
        before: 'Veranstaltungsbereich',
        after: row['bezeichnung'],
      },
      { key: 'status', label: 'Status', before: row['status'], after: row['status'] },
    ];
  }

  return [
    { key: 'bereich', label: 'Bereich', before: row['bereichnummer'], after: row['bereichnummer'] },
    { key: 'land', label: 'Land', before: row['land'], after: row['land'] },
    {
      key: 'geschaeft',
      label: 'Veranstaltungsart',
      before: row['geschaeft'],
      after: row['geschaeft'],
    },
    {
      key: 'wertpapier',
      label: 'Angebotsformat',
      before: row['wertpapier'],
      after: row['wertpapier'],
    },
    { key: 'isin', label: 'Angebotscode', before: row['isin'], after: row['isin'] },
    {
      key: 'konto',
      label: 'Kontakt-ID Ansprechperson',
      before: '123456780',
      after: row['konto'],
    },
    { key: 'bic', label: 'Kontaktcode Veranstaltungsteam', before: row['bic'], after: row['bic'] },
  ];
}
