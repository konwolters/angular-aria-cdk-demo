import { Component, input, model, output } from '@angular/core';
import { ButtonComponent } from '../../shared/button/button';
import { DataTableCellDirective } from '../../shared/data-table/data-table-cell.directive';
import { DataTableColumn, DataTableComponent } from '../../shared/data-table/data-table';
import { SelectComponent, SelectOption } from '../../shared/select/select';

type Row = Record<string, string>;
@Component({
  selector: 'app-angebot-liste',
  imports: [ButtonComponent, DataTableCellDirective, DataTableComponent, SelectComponent],
  templateUrl: './angebot-liste.html',
})
export class AngebotListeComponent {
  readonly rows = input.required<readonly Row[]>();
  readonly totalAngebot = input(0);
  readonly columns = input.required<readonly DataTableColumn<Row>[]>();
  readonly bereichOptions = input.required<readonly SelectOption[]>();
  readonly editing = input(false);
  readonly editScope = input<'veranstaltungsort' | 'angebot'>('veranstaltungsort');
  readonly bereichFilter = model('alle');
  readonly details = output<Row>();
  readonly edit = output<Row>();
  readonly add = output<void>();
}
