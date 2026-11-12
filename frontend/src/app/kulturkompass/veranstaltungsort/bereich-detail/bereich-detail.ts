import {
  applyEach,
  form,
  FormField,
  maxLength,
  readonly as readonlyField,
  required,
} from '@angular/forms/signals';
import { Component, computed, input, linkedSignal, model, signal } from '@angular/core';
import { ButtonComponent } from '../../../shared/button/button';
import { DataTableCellDirective } from '../../../shared/data-table/data-table-cell.directive';
import { DataTableHeaderDirective } from '../../../shared/data-table/data-table-header.directive';
import { DataTableColumn, DataTableComponent } from '../../../shared/data-table/data-table';
import { SelectComponent } from '../../../shared/select/select';
import { TextFieldComponent } from '../../../shared/text-field/text-field';
import { TextareaComponent } from '../../../shared/textarea/textarea';

export interface BereichZusatzdatum {
  id: number;
  art: string;
  wert: string;
  beschreibung: string;
}

@Component({
  selector: 'app-bereich-detail',
  imports: [
    ButtonComponent,
    FormField,
    DataTableCellDirective,
    DataTableHeaderDirective,
    DataTableComponent,
    SelectComponent,
    TextFieldComponent,
    TextareaComponent,
  ],
  templateUrl: './bereich-detail.html',
})
export class BereichDetail {
  readonly value = input<Record<string, string> | null>(null);
  readonly editing = input(false);
  readonly editScope = input<'veranstaltungsort' | 'angebot'>('veranstaltungsort');
  readonly statuses = input.required<readonly { value: string; label: string }[]>();
  readonly zusatzarten = input.required<readonly { value: string; label: string }[]>();
  readonly zusatzdaten = model<BereichZusatzdatum[]>([]);
  protected readonly bereichModel = linkedSignal(() => {
    const value = this.value();
    this.editing();
    return {
      bereichnummer: value?.['bereichnummer'] || '',
      bezeichnung: value?.['bezeichnung'] || '',
      status: 'aktiv',
      kommentar: '',
    };
  });
  protected readonly bereichForm = form(this.bereichModel, (path) => {
    readonlyField(path, { when: () => !this.editing() });
    readonlyField(path.bereichnummer, { when: () => this.editScope() === 'angebot' });
    readonlyField(path.bezeichnung, { when: () => this.editScope() === 'angebot' });
    readonlyField(path.status, { when: () => this.editScope() === 'angebot' });
    required(path.bereichnummer);
    required(path.bezeichnung);
    required(path.status);
  });
  protected readonly zusatzForm = form(this.zusatzdaten, (path) => {
    applyEach(path, (entry) => {
      required(entry.art);
      required(entry.wert);
      maxLength(entry.wert, 255);
      maxLength(entry.beschreibung, 255);
    });
  });
  protected zusatzIndex(id: number): number {
    return this.zusatzdaten().findIndex((entry) => entry.id === id);
  }
  protected readonly zusatzdatenExpanded = signal(false);
  protected readonly visibleZusatzdaten = computed(() =>
    this.zusatzdatenExpanded() ? this.zusatzdaten() : this.zusatzdaten().slice(0, 2),
  );

  protected readonly columns = computed<readonly DataTableColumn<BereichZusatzdatum>[]>(() => [
    { key: 'art', header: 'Art', value: (row) => row.art, width: '12rem' },
    { key: 'wert', header: 'Wert', value: (row) => row.wert },
    { key: 'beschreibung', header: 'Beschreibung', value: (row) => row.beschreibung },
    ...(this.editing()
      ? [{ key: 'action', header: 'Aktion', value: () => '', width: '7rem' }]
      : []),
  ]);
  protected readonly trackZusatzdatum = (row: BereichZusatzdatum) => row.id;
  protected addZusatzdatum(): void {
    this.zusatzdatenExpanded.set(true);
    this.zusatzdaten.update((rows) => [
      ...rows,
      { id: Math.max(-1, ...rows.map((row) => row.id)) + 1, art: '', wert: '', beschreibung: '' },
    ]);
  }

  protected removeZusatzdatum(id: number): void {
    this.zusatzdaten.update((rows) => rows.filter((row) => row.id !== id));
  }
}
