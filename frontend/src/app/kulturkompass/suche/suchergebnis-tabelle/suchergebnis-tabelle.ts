import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../../../shared/button/button';
import { DataTableCellDirective } from '../../../shared/data-table/data-table-cell.directive';
import { DataTableColumn, DataTableComponent } from '../../../shared/data-table/data-table';
import { GuiPagination } from '../../gui-pagination';

type Row = Record<string, string>;

@Component({
  selector: 'app-suchergebnis-tabelle',
  imports: [ButtonComponent, DataTableCellDirective, DataTableComponent, RouterLink],
  templateUrl: './suchergebnis-tabelle.html',
})
export class SuchergebnisTabelleComponent {
  readonly page = input.required<'veranstaltungsorte' | 'angebot' | 'staging'>();
  readonly rows = input.required<readonly Row[]>();
  readonly columns = input.required<readonly DataTableColumn<Row>[]>();
  readonly pagination = input.required<GuiPagination>();
  readonly open = output<Row>();
  readonly openRequest = output<Row>();
  readonly openBereichs = output<Row>();
}
