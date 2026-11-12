import { Injectable, signal } from '@angular/core';
import { BereichZusatzdatum } from '../bereich-detail/bereich-detail';
import { GuiRow } from './gui-modelle';

/** In-memory GUI data. The store is scoped to the GUI and is not persisted. */
@Injectable()
export class GuiSessionStore {
  readonly selected = signal<GuiRow | null>(null);
  readonly status = signal('aktiv');
  readonly customerNumber = signal('');
  readonly role = signal('bearbeiter');
  readonly bereichZusatzdaten = signal<Record<string, BereichZusatzdatum[]>>({
    '10010001': [
      { id: 0, art: 'KONTAKT', wert: 'Max Mustermann', beschreibung: 'Hauptkontakt' },
      { id: 1, art: 'KONTAKT', wert: 'Erika Musterfrau', beschreibung: 'Vertretung' },
      { id: 2, art: 'KONTAKT', wert: 'bereich@example.test', beschreibung: 'E-Mail' },
      { id: 3, art: 'KONTAKT', wert: '+49 30 123456', beschreibung: 'Telefon' },
    ],
  });
}
