import { KulturkompassDatenService } from '../daten/kulturkompass-daten.service';
import { computed, inject, Service, signal } from '@angular/core';
import { GuiPage } from '../daten/gui-modelle';
import { BereichService } from '../veranstaltungsort/bereich-detail/bereich.service';
import { ReferenzdatenService } from '../referenzdaten/referenzdaten.service';
import { exportVeranstaltungsorte, exportAngebot } from './suche-export';

/** Filter state is kept for the lifetime of the GUI, without persistence. */
@Service({ autoProvided: false })
export class SucheService {
  private readonly daten = inject(KulturkompassDatenService);
  private readonly bereich = inject(BereichService);
  private readonly references = inject(ReferenzdatenService);
  readonly page = signal<GuiPage>('veranstaltungsorte');
  readonly query = signal('');
  readonly appliedQuery = signal('');
  readonly countries = signal<string[]>([]);
  readonly businessTypes = signal<string[]>([]);
  readonly referenceTypes = signal<string[]>([]);
  readonly rows = computed(() => {
    const source =
      this.page() === 'angebot'
        ? this.daten.angebote
        : this.page() === 'staging'
          ? this.daten.antraege
          : this.daten.veranstaltungsorte;
    const query = this.appliedQuery().trim().toLocaleLowerCase('de');
    return query
      ? source.filter((row) =>
          Object.values(row).some((value) => value.toLocaleLowerCase('de').includes(query)),
        )
      : source;
  });
  exportResults(): void {
    if (this.page() === 'veranstaltungsorte') {
      exportVeranstaltungsorte(
        this.rows(),
        this.daten.bereiche,
        this.bereich.datenbestand(),
        this.references.zusatzarten,
      );
    } else if (this.page() === 'angebot') {
      exportAngebot(this.rows(), this.daten.angebote, this.daten.veranstaltungsorte);
    }
  }
}
