import { Component, input, model, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../../shared/button/button';
import { DataTableColumn } from '../../shared/data-table/data-table';
import { SelectOption } from '../../shared/select/select';
import { TabItem } from '../../shared/tabs/tabs';
import { AntragVergleichComponent } from './antrag-vergleich';

type Row = Record<string, string>;

@Component({
  selector: 'app-antrag-seite',
  imports: [AntragVergleichComponent, ButtonComponent, RouterLink],
  templateUrl: './antrag-seite.html',
})
export class AntragSeiteComponent {
  readonly request = input<Row | null>(null);
  readonly customer = input<Row | null>(null);
  readonly comparison = input.required<Row>();
  readonly tabs = input.required<readonly TabItem[]>();
  readonly selectedTab = model.required<string>();
  readonly statuses = input.required<readonly SelectOption[]>();
  readonly bereichs = input.required<readonly Row[]>();
  readonly bereichColumns = input.required<readonly DataTableColumn<Row>[]>();
  readonly angebot = input.required<readonly Row[]>();
  readonly angebotColumns = input.required<readonly DataTableColumn<Row>[]>();
  readonly details = output<{ kind: 'angebot' | 'bereich'; row: Row }>();
  readonly confirm = output<string>();
  readonly edit = output<void>();
}
