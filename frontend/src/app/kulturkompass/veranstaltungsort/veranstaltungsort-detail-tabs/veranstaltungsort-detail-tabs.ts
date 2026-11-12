import { Component, input, model, output } from '@angular/core';
import { ButtonComponent } from '../../../shared/button/button';
import { DataTableCellDirective } from '../../../shared/data-table/data-table-cell.directive';
import { DataTableColumn, DataTableComponent } from '../../../shared/data-table/data-table';
import { SelectOption } from '../../../shared/select/select';
import { TabPanelTemplateDirective } from '../../../shared/tabs/tab-panel-template.directive';
import { TabItem, TabsComponent } from '../../../shared/tabs/tabs';
import { BereichZusatzdatum } from '../bereich-detail/bereich-detail';
import { BereichListe } from '../bereich-liste/bereich-liste';
import { VeranstaltungsortStammdaten } from '../veranstaltungsort-stammdaten/veranstaltungsort-stammdaten';
import { AngebotListe } from '../../angebot/angebot-liste/angebot-liste';

type Row = Record<string, string>;
type Kind = 'angebot' | 'bereich';

@Component({
  selector: 'app-veranstaltungsort-detail-tabs',
  imports: [
    ButtonComponent,
    DataTableCellDirective,
    DataTableComponent,
    BereichListe,
    VeranstaltungsortStammdaten,
    AngebotListe,
    TabPanelTemplateDirective,
    TabsComponent,
  ],
  templateUrl: './veranstaltungsort-detail-tabs.html',
})
export class VeranstaltungsortDetailTabs {
  readonly tabs = input.required<readonly TabItem[]>();
  readonly selected = input<Row | null>(null);
  readonly historical = model<Row | null>(null);
  readonly editing = model.required<boolean>();
  readonly editScope = input.required<'veranstaltungsort' | 'angebot'>();
  readonly activeTab = model.required<string>();
  readonly name = model.required<string>();
  readonly customerNumber = model.required<string>();
  readonly status = model.required<string>();
  readonly bereichFilter = model.required<string>();
  readonly bereichStatus = model.required<string>();
  readonly statuses = input.required<readonly SelectOption[]>();
  readonly bereichs = input.required<readonly Row[]>();
  readonly totalBereichs = input.required<number>();
  readonly bereichColumns = input.required<readonly DataTableColumn<Row>[]>();
  readonly zusatzdaten = input.required<Readonly<Record<string, readonly BereichZusatzdatum[]>>>();
  readonly zusatzarten = input.required<readonly SelectOption[]>();
  readonly bereichOptions = input.required<readonly SelectOption[]>();
  readonly angebot = input.required<readonly Row[]>();
  readonly totalAngebot = input.required<number>();
  readonly angebotColumns = input.required<readonly DataTableColumn<Row>[]>();
  readonly historyRows = input.required<readonly Row[]>();
  readonly historyColumns = input.required<readonly DataTableColumn<Row>[]>();
  readonly details = output<{ kind: Kind; row: Row }>();
  readonly edit = output<{ kind: Kind; row: Row | null }>();
}
