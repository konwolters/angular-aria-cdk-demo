import { Component, computed, input, model, signal } from '@angular/core';
import { ButtonComponent } from '../../shared/button/button';
import { DataTableCellDirective } from '../../shared/data-table/data-table-cell.directive';
import { DataTableHeaderDirective } from '../../shared/data-table/data-table-header.directive';
import { DataTableColumn, DataTableComponent } from '../../shared/data-table/data-table';
import { SelectComponent } from '../../shared/select/select';
import { TextFieldComponent } from '../../shared/text-field/text-field';
import { TextareaComponent } from '../../shared/textarea/textarea';

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
    DataTableCellDirective,
    DataTableHeaderDirective,
    DataTableComponent,
    SelectComponent,
    TextFieldComponent,
    TextareaComponent,
  ],
  templateUrl: './bereich-detail.html',
})
export class BereichDetailComponent {
  readonly value = input<Record<string, string> | null>(null);
  readonly editing = input(false);
  readonly editScope = input<'veranstaltungsort' | 'angebot'>('veranstaltungsort');
  readonly statuses = input.required<readonly { value: string; label: string }[]>();
  readonly zusatzarten = input.required<readonly { value: string; label: string }[]>();
  readonly zusatzdaten = model<BereichZusatzdatum[]>([]);
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

  protected updateZusatzdatum(
    id: number,
    field: 'art' | 'wert' | 'beschreibung',
    value: string,
  ): void {
    this.zusatzdaten.update((rows) =>
      rows.map((row) => (row.id === id ? { ...row, [field]: value } : row)),
    );
  }

  protected removeZusatzdatum(id: number): void {
    this.zusatzdaten.update((rows) => rows.filter((row) => row.id !== id));
  }
}
