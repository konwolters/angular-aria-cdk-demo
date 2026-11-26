import { Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { form, FormField } from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';
import { ButtonComponent } from '../../../shared/button/button';
import { DataTableToolbarComponent } from '../../../shared/data-table-toolbar/data-table-toolbar';
import { DataTableComponent } from '../../../shared/data-table/data-table';
import { DataTableCellDirective } from '../../../shared/data-table/data-table-cell.directive';
import { ServerTableService } from '../../api/server-table.service';
import { INITIAL_TABLE_QUERY, TableQuery } from '../../api/table.model';
import { TextFieldComponent } from '../../../shared/text-field/text-field';
import { SelectComponent } from '../../../shared/select/select';
import { GuiSessionService } from '../../daten/gui-session.service';
import { GuiRow } from '../../daten/gui-modelle';
import { CUSTOMER_COLUMNS } from '../../daten/gui-spalten';
import { GUI_STATUSES } from '../../daten/gui-status';
import { suchfilter } from '../../daten/suchfilter';
import { StagingService } from '../../antrag/staging.service';
import { VeranstaltungsortService } from '../veranstaltungsort.service';

const INITIAL_FILTER = {
  name: '',
  kundennummer: '',
  bereichnummer: '',
  alertId: '',
  akronym: '',
  lei: '',
  status: 'aktiv',
};

@Component({
  selector: 'app-veranstaltungsort-suche',
  imports: [
    ButtonComponent,
    FormField,
    DataTableToolbarComponent,
    DataTableComponent,
    DataTableCellDirective,
    TextFieldComponent,
    SelectComponent,
    RouterLink,
  ],
  templateUrl: './veranstaltungsort-suche.html',
})
export class VeranstaltungsortSuche {
  private readonly guiSessionService = inject(GuiSessionService);
  private readonly router = inject(Router);
  private readonly serverTableService = inject(ServerTableService);
  private readonly veranstaltungsortService = inject(VeranstaltungsortService);
  private readonly stagingService = inject(StagingService);

  private readonly criteria = signal(INITIAL_FILTER);
  protected readonly tableQuery = signal<TableQuery>({
    ...INITIAL_TABLE_QUERY,
    filters: suchfilter(INITIAL_FILTER),
  });
  protected readonly searchForm = form(this.criteria);
  protected readonly results = rxResource({
    params: () => this.tableQuery(),
    stream: ({ params }) =>
      this.serverTableService.search<GuiRow>('/api/kulturkompass/veranstaltungsorte', params),
  });
  protected readonly statuses = () => GUI_STATUSES;
  protected readonly columns = CUSTOMER_COLUMNS;

  protected apply(): void {
    const { status, ...criteria } = this.criteria();
    const filters = suchfilter({ ...criteria, status: status === 'alle' ? '' : status });
    this.tableQuery.update((query) => ({ ...query, filters, page: 0 }));
  }

  protected reset(): void {
    this.criteria.set(INITIAL_FILTER);
    this.apply();
  }

  protected setPage(page: number): void {
    this.tableQuery.update((query) => ({ ...query, page }));
  }

  protected setPageSize(size: number): void {
    this.tableQuery.update((query) => ({ ...query, size, page: 0 }));
  }

  protected createVeranstaltungsort(): void {
    this.veranstaltungsortService.selected.set(null);
    this.veranstaltungsortService.name.set('');
    this.guiSessionService.customerNumber.set('');
    this.veranstaltungsortService.editScope.set('veranstaltungsort');
    this.veranstaltungsortService.activeTab.set('stammdaten');
    this.navigateToDetail('neu', 'stammdaten');
  }

  protected openVeranstaltungsort(row: GuiRow, tab: 'stammdaten' | 'bereichs'): void {
    this.veranstaltungsortService.selected.set(row);

    if (tab === 'bereichs') {
      this.veranstaltungsortService.bereichFilter.set('alle');
      this.veranstaltungsortService.bereichStatus.set('aktiv');
    }

    this.veranstaltungsortService.activeTab.set(tab);
    this.navigateToDetail(row['kundennummer'], tab);
  }

  private navigateToDetail(id: string, tab: string): void {
    this.veranstaltungsortService.editing.set(false);
    this.veranstaltungsortService.historical.set(null);
    void this.router.navigate(['/gui/veranstaltungsorte', id], { queryParams: { tab } });
  }

  protected openRequest(row: GuiRow): void {
    const request = this.stagingService.findForRow(row, 'Veranstaltungsort & Bereiche');

    if (request) {
      void this.router.navigate(['/gui/staging', request['id']]);
    }
  }
}
