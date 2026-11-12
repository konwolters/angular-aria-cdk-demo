import { Component, input, model, output } from '@angular/core';
import { ButtonComponent } from '../../../shared/button/button';
import { DataTableCellDirective } from '../../../shared/data-table/data-table-cell.directive';
import { DataTableColumn, DataTableComponent } from '../../../shared/data-table/data-table';
import { SelectOption } from '../../../shared/select/select';
import { TabPanelTemplateDirective } from '../../../shared/tabs/tab-panel-template.directive';
import { TabItem, TabsComponent } from '../../../shared/tabs/tabs';
import { VeranstaltungsortStammdatenComponent } from '../../veranstaltungsort-stammdaten/veranstaltungsort-stammdaten';

type Row = Record<string, string>;

@Component({
  selector: 'app-antrag-vergleich',
  imports: [
    ButtonComponent,
    DataTableCellDirective,
    DataTableComponent,
    VeranstaltungsortStammdatenComponent,
    TabPanelTemplateDirective,
    TabsComponent,
  ],
  templateUrl: './antrag-vergleich.html',
})
export class AntragVergleichComponent {
  readonly tabs = input.required<readonly TabItem[]>();
  readonly selectedTab = model.required<string>();
  readonly customer = input<Row | null>(null);
  readonly comparison = input.required<Row>();
  readonly statuses = input.required<readonly SelectOption[]>();
  readonly bereichs = input.required<readonly Row[]>();
  readonly bereichColumns = input.required<readonly DataTableColumn<Row>[]>();
  readonly angebot = input.required<readonly Row[]>();
  readonly angebotColumns = input.required<readonly DataTableColumn<Row>[]>();
  readonly details = output<{ kind: 'angebot' | 'bereich'; row: Row }>();
}
