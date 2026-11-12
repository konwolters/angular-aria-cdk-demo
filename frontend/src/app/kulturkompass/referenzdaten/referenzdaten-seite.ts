import { Component, input, model, output } from '@angular/core';
import { ButtonComponent } from '../../shared/button/button';
import { DataTableCellDirective } from '../../shared/data-table/data-table-cell.directive';
import { DataTableColumn, DataTableComponent } from '../../shared/data-table/data-table';
import { TabPanelTemplateDirective } from '../../shared/tabs/tab-panel-template.directive';
import { TabItem, TabsComponent } from '../../shared/tabs/tabs';

type Row = Record<string, string>;

@Component({
  selector: 'app-referenzdaten-seite',
  imports: [
    ButtonComponent,
    DataTableCellDirective,
    DataTableComponent,
    TabPanelTemplateDirective,
    TabsComponent,
  ],
  templateUrl: './referenzdaten-seite.html',
})
export class ReferenzdatenSeiteComponent {
  readonly tabs = input.required<readonly TabItem[]>();
  readonly selectedTab = model.required<string>();
  readonly editing = model.required<boolean>();
  readonly rows = input.required<Record<string, Row[]>>();
  readonly columns = input.required<Record<string, DataTableColumn<Row>[]>>();
  readonly editableColumns = input.required<readonly DataTableColumn<Row>[]>();
  readonly edit = output<Row | null>();
  readonly submit = output<void>();
}
