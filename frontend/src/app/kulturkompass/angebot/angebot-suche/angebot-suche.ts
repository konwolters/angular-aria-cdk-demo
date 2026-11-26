import { Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { form, FormField } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { ButtonComponent } from '../../../shared/button/button';
import { DataTableToolbarComponent } from '../../../shared/data-table-toolbar/data-table-toolbar';
import { DataTableComponent } from '../../../shared/data-table/data-table';
import { DataTableCellDirective } from '../../../shared/data-table/data-table-cell.directive';
import { ServerTableService } from '../../api/server-table.service';
import { INITIAL_TABLE_QUERY, TableQuery } from '../../api/table.model';
import { TextFieldComponent } from '../../../shared/text-field/text-field';
import { MultiSelectComponent } from '../../../shared/multi-select/multi-select';
import { GuiRow } from '../../daten/gui-modelle';
import { ANGEBOT_SEARCH_COLUMNS } from '../../daten/gui-spalten';
import { StagingService } from '../../antrag/staging.service';
import { AngebotDetail } from '../angebot-detail/angebot-detail';
import { suchfilter } from '../../daten/suchfilter';

const INITIAL_FILTER = {
  name: '',
  kundennummer: '',
  lei: '',
  bereichnummer: '',
  land: [] as string[],
  geschaeft: [] as string[],
  wertpapier: [] as string[],
  isin: '',
  agentBic: '',
  konto: '',
  bic: '',
  zusatzinfo: '',
};

@Component({
  selector: 'app-angebot-suche',
  imports: [
    AngebotDetail,
    ButtonComponent,
    FormField,
    DataTableToolbarComponent,
    DataTableComponent,
    DataTableCellDirective,
    TextFieldComponent,
    MultiSelectComponent,
  ],
  templateUrl: './angebot-suche.html',
})
export class AngebotSuche {
  private readonly router = inject(Router);
  private readonly serverTableService = inject(ServerTableService);
  private readonly stagingService = inject(StagingService);

  private readonly criteria = signal(INITIAL_FILTER);
  protected readonly tableQuery = signal<TableQuery>(INITIAL_TABLE_QUERY);
  protected readonly searchForm = form(this.criteria);
  protected readonly results = rxResource({
    params: () => this.tableQuery(),
    stream: ({ params }) =>
      this.serverTableService.search<GuiRow>('/api/kulturkompass/angebote', params),
  });
  protected readonly columns = ANGEBOT_SEARCH_COLUMNS;
  protected readonly detailsOpen = signal(false);
  protected readonly detailRow = signal<GuiRow | null>(null);

  protected apply(): void {
    const filters = suchfilter(this.criteria());
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

  protected openDetails(row: GuiRow): void {
    this.detailRow.set(row);
    this.detailsOpen.set(true);
  }

  protected openRequest(row: GuiRow): void {
    const request = this.stagingService.findForRow(row, 'Angebote');

    if (request) {
      void this.router.navigate(['/gui/staging', request['id']]);
    }
  }
}
