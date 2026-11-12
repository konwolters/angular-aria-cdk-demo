import { Component, input, model, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../../shared/button/button';
import { DataTableColumn } from '../../shared/data-table/data-table';
import { SelectOption } from '../../shared/select/select';
import { TabItem } from '../../shared/tabs/tabs';
import { BereichZusatzdatum } from '../bereich-detail/bereich-detail';
import { VeranstaltungsortDetailTabsComponent } from './veranstaltungsort-detail-tabs';

type Row = Record<string, string>;
type Kind = 'angebot' | 'bereich';

@Component({
  selector: 'app-veranstaltungsort-detail-seite',
  imports: [ButtonComponent, VeranstaltungsortDetailTabsComponent, RouterLink],
  templateUrl: './veranstaltungsort-detail-seite.html',
})
export class VeranstaltungsortDetailSeiteComponent {
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
  readonly beginEditing = output<'veranstaltungsort' | 'angebot'>();
  readonly submit = output<void>();
}
