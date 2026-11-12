import { Component, input, model, output } from '@angular/core';
import { ButtonComponent } from '../../shared/button/button';
import { DataTableColumn } from '../../shared/data-table/data-table';
import { SelectOption } from '../../shared/select/select';
import { GuiPagination } from '../gui-pagination';
import { SuchergebnisTabelleComponent } from './suchergebnis-tabelle';
import { SuchfilterComponent } from './suchfilter';

type Row = Record<string, string>;

@Component({
  selector: 'app-suche-seite',
  imports: [ButtonComponent, SuchergebnisTabelleComponent, SuchfilterComponent],
  templateUrl: './suche-seite.html',
})
export class SucheSeiteComponent {
  readonly page = input.required<'veranstaltungsorte' | 'angebot' | 'staging'>();
  readonly rows = input.required<readonly Row[]>();
  readonly columns = input.required<readonly DataTableColumn<Row>[]>();
  readonly pagination = input.required<GuiPagination>();
  readonly statuses = input.required<readonly SelectOption[]>();
  readonly query = model.required<string>();
  readonly customerNumber = model.required<string>();
  readonly status = model.required<string>();
  readonly countries = model.required<string[]>();
  readonly businessTypes = model.required<string[]>();
  readonly referenceTypes = model.required<string[]>();
  readonly createCustomer = output<void>();
  readonly apply = output<void>();
  readonly reset = output<void>();
  readonly export = output<void>();
  readonly open = output<Row>();
  readonly openRequest = output<Row>();
  readonly openBereichs = output<Row>();
}
