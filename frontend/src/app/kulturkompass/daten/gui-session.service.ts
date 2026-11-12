import { Service, signal } from '@angular/core';

/** GUI-übergreifende Auswahl und Rolle, ohne Persistenz. */
@Service({ autoProvided: false })
export class GuiSessionService {
  readonly status = signal('aktiv');
  readonly customerNumber = signal('');
  readonly role = signal('bearbeiter');
}
