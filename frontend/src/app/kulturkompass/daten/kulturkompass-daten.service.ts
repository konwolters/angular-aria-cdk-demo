import { Service } from '@angular/core';
import {
  DEMO_ANGEBOT,
  DEMO_BEREICHS,
  DEMO_CUSTOMERS,
  DEMO_HISTORIE,
  DEMO_IMPORT_GRUPPEN,
  DEMO_REFERENZDATEN,
  DEMO_REQUESTS,
} from './gui-demodaten';

/** Demo-Datenquelle; Änderungen werden nicht serverseitig gespeichert. */
@Service({ autoProvided: false })
export class KulturkompassDatenService {
  readonly bereichZusatzdaten = {
    '10010001': [
      { id: 0, art: 'KONTAKT', wert: 'Max Mustermann', beschreibung: 'Hauptkontakt' },
      { id: 1, art: 'KONTAKT', wert: 'Erika Musterfrau', beschreibung: 'Vertretung' },
      { id: 2, art: 'KONTAKT', wert: 'bereich@example.test', beschreibung: 'E-Mail' },
      { id: 3, art: 'KONTAKT', wert: '+49 30 123456', beschreibung: 'Telefon' },
    ],
  };
  readonly veranstaltungsorte = DEMO_CUSTOMERS;
  readonly bereiche = DEMO_BEREICHS;
  readonly angebote = DEMO_ANGEBOT;
  readonly antraege = DEMO_REQUESTS;
  readonly referenzdaten = DEMO_REFERENZDATEN;
  readonly historie = DEMO_HISTORIE;
  readonly importGruppen = DEMO_IMPORT_GRUPPEN;
}
