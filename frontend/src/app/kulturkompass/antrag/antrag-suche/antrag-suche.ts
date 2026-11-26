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
import { REQUEST_COLUMNS } from '../../daten/gui-spalten';
import { suchfilter } from '../../daten/suchfilter';

const INITIAL_FILTER = {
  id: '',
  kundennummer: '',
  bereichnummer: '',
  status: [] as string[],
  bereich: [] as string[],
};

@Component({
  selector: 'app-antrag-suche',
  imports: [
    ButtonComponent,
    FormField,
    DataTableToolbarComponent,
    DataTableComponent,
    DataTableCellDirective,
    TextFieldComponent,
    MultiSelectComponent,
  ],
  templateUrl: './antrag-suche.html',
})
export class AntragSuche {
  private readonly router = inject(Router);
  private readonly serverTableService = inject(ServerTableService);

  private readonly criteria = signal(INITIAL_FILTER);
  protected readonly tableQuery = signal<TableQuery>(INITIAL_TABLE_QUERY);
  protected readonly searchForm = form(this.criteria);
  protected readonly results = rxResource({
    params: () => this.tableQuery(),
    stream: ({ params }) =>
      this.serverTableService.search<GuiRow>('/api/kulturkompass/antraege', params),
  });
  protected readonly columns = REQUEST_COLUMNS;

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

  protected openAntrag(row: GuiRow): void {
    void this.router.navigate(['/gui/staging', row['id']]);
  }
}
