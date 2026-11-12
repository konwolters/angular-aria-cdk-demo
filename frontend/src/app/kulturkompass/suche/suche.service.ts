import { KulturkompassDatenService } from '../daten/kulturkompass-daten.service';
import { computed, inject, Service, signal } from '@angular/core';
import { GuiPage } from '../daten/gui-modelle';

/** Der Filterzustand bleibt während der Lebensdauer der GUI ohne Persistenz erhalten. */
@Service({ autoProvided: false })
export class SucheService {
  private readonly daten = inject(KulturkompassDatenService);
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
}
