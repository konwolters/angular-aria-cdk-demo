import { form, FormField } from '@angular/forms/signals';
import { Component, input, model, output, signal } from '@angular/core';
import { ButtonComponent } from '../../../shared/button/button';
import { DataTableCellDirective } from '../../../shared/data-table/data-table-cell.directive';
import { DataTableColumn, DataTableComponent } from '../../../shared/data-table/data-table';
import { SelectComponent, SelectOption } from '../../../shared/select/select';
import { BereichZusatzdatum } from '../bereich-detail/bereich-detail';

type Row = Record<string, string>;
@Component({
  selector: 'app-bereich-liste',
  imports: [
    FormField,
    ButtonComponent,
    DataTableCellDirective,
    DataTableComponent,
    SelectComponent,
  ],
  templateUrl: './bereich-liste.html',
})
export class BereichListe {
  readonly rows = input.required<readonly Row[]>();
  readonly totalBereichs = input(0);
  readonly columns = input.required<readonly DataTableColumn<Row>[]>();
  readonly bereichOptions = input.required<readonly SelectOption[]>();
  readonly statuses = input.required<readonly SelectOption[]>();
  readonly zusatzdaten = input.required<Readonly<Record<string, readonly BereichZusatzdatum[]>>>();
  readonly zusatzarten = input.required<readonly SelectOption[]>();
  readonly editing = input(false);
  readonly editScope = input<'veranstaltungsort' | 'angebot'>('veranstaltungsort');
  readonly bereichFilter = model('alle');
  protected readonly bereichFilterForm = form(this.bereichFilter);
  readonly bereichStatus = model('aktiv');
  protected readonly bereichStatusForm = form(this.bereichStatus);
  readonly details = output<Row>();
  readonly edit = output<Row>();
  readonly add = output<void>();
  protected readonly expandedBereichs = signal<ReadonlySet<string>>(new Set());

  protected toggleZusatzdaten(bereichnummer: string): void {
    this.expandedBereichs.update((current) => {
      const next = new Set(current);
      if (next.has(bereichnummer)) next.delete(bereichnummer);
      else next.add(bereichnummer);
      return next;
    });
  }

  protected artLabel(value: string): string {
    return this.zusatzarten().find((option) => option.value === value)?.label ?? value;
  }
}
