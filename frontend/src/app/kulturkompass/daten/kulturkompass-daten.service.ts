import { Service } from '@angular/core';
import {
  DEMO_ANGEBOT,
  DEMO_BEREICH_ZUSATZDATEN,
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
  readonly bereichZusatzdaten = DEMO_BEREICH_ZUSATZDATEN;
  readonly veranstaltungsorte = DEMO_CUSTOMERS;
  readonly bereiche = DEMO_BEREICHS;
  readonly angebote = DEMO_ANGEBOT;
  readonly antraege = DEMO_REQUESTS;
  readonly referenzdaten = DEMO_REFERENZDATEN;
  readonly historie = DEMO_HISTORIE;
  readonly importGruppen = DEMO_IMPORT_GRUPPEN;
}
