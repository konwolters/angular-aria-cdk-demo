import { SelectOption } from '../../shared/select/select';
import { GuiRow } from '../daten/gui-modelle';
import { BereichZusatzdatum } from '../veranstaltungsort/bereich-detail/bereich-detail';

export function importVorschau(
  datenart: string,
  kunden: readonly GuiRow[],
  bereichs: readonly GuiRow[],
  angebot: readonly GuiRow[],
  zusatzdaten: Readonly<Record<string, readonly BereichZusatzdatum[]>>,
  zusatzarten: readonly SelectOption[],
): GuiRow[] {
  if (datenart === 'veranstaltungsort') {
    return kunden
      .flatMap((customer) =>
        customer['bereichnummer'].split(', ').map((number) => {
          const bereich = bereichs.find((item) => item['bereichnummer'] === number);
          return {
            ...customer,
            bereichnummer: number,
            bereichbezeichnung: bereich?.['bezeichnung'] ?? 'Bereich',
            bereichstatus: bereich?.['status'] ?? 'Aktiv',
            kommentar: bereich?.['kommentar'] ?? '',
            zusatzdaten: (zusatzdaten[number] ?? [])
              .map(
                (entry) =>
                  `${zusatzarten.find((art) => art.value === entry.art)?.label ?? entry.art}: ${entry.wert}`,
              )
              .join(', '),
            aktion: 'Ändern',
            fehler: '',
          };
        }),
      )
      .map((row, index) => ({ ...row, zeile: String(index + 1) }));
  }

  return angebot.map((row, index) => ({
    ...row,
    zeile: String(index + 1),
    loeschen: '',
    aktion: 'Ändern',
    fehler: '',
  }));
}
