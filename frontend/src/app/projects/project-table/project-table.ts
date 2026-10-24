import { Component, computed, inject, signal } from '@angular/core';
import { DataTableCellDirective } from '../../shared/data-table/data-table-cell.directive';
import { DataTableColumn, DataTableComponent } from '../../shared/data-table/data-table';
import { DataTableToolbarComponent } from '../../shared/data-table-toolbar/data-table-toolbar';
import { ServerTableService } from '../../shared/data-table/server-table.service';
import { INITIAL_TABLE_QUERY, TableQuery } from '../../shared/data-table/table.model';
import { MultiSelectComponent } from '../../shared/multi-select/multi-select';
import { Project } from '../project.model';
import { TextFieldComponent } from '../../shared/text-field/text-field';

@Component({
  selector: 'app-project-table',
  imports: [
    DataTableCellDirective,
    DataTableComponent,
    DataTableToolbarComponent,
    MultiSelectComponent,
    TextFieldComponent,
  ],
  templateUrl: './project-table.html',
})
export class ProjectTableComponent {
  private readonly tableService = inject(ServerTableService);
  private readonly dateFormatter = new Intl.DateTimeFormat('de-DE', { dateStyle: 'medium' });
  protected readonly query = signal<TableQuery>({
    ...INITIAL_TABLE_QUERY,
    sort: 'updatedAt',
    direction: 'desc',
    filters: { status: [], priority: [] },
  });

  protected readonly searchTerm = signal('');
  protected readonly selectedStatuses = signal<string[]>([]);
  protected readonly selectedPriorities = signal<string[]>([]);
  protected readonly result = this.tableService.search<Project>('/api/projects', this.query);

  protected readonly rows = computed(() => this.result.value().content);
  protected readonly total = computed(() => this.result.value().totalElements);
  protected readonly totalPages = computed(() => this.result.value().totalPages);
  protected readonly loading = this.result.isLoading;
  protected readonly error = computed(() =>
    this.result.error() ? 'Projekte konnten nicht geladen werden.' : null,
  );

  protected readonly statusOptions = ['Aktiv', 'Planung', 'Abgeschlossen', 'Pausiert'];
  protected readonly priorityOptions = ['Hoch', 'Mittel', 'Niedrig'];
  protected readonly columns: readonly DataTableColumn<Project>[] = [
    { key: 'code', header: 'Code', sortable: true, value: (project) => project.code },
    { key: 'name', header: 'Projekt', sortable: true, value: (project) => project.name },
    { key: 'client', header: 'Kunde', sortable: true, value: (project) => project.client },
    { key: 'owner', header: 'Verantwortlich', sortable: true, value: (project) => project.owner },
    { key: 'status', header: 'Status', value: (project) => project.status },
    { key: 'priority', header: 'Priorität', sortable: true, value: (project) => project.priority },
    {
      key: 'updatedAt',
      header: 'Aktualisiert',
      sortable: true,
      value: (project) => this.dateFormatter.format(new Date(`${project.updatedAt}T00:00:00`)),
    },
    {
      key: 'progress',
      header: 'Fortschritt',
      sortable: true,
      value: (project) => this.formatProgress(project.progress),
    },
  ];
  protected readonly trackProject = (project: Project): number => project.id;

  protected applyFilters(): void {
    this.query.update((query) => ({
      ...query,
      search: this.searchTerm().trim(),
      filters: {
        status: [...this.selectedStatuses()],
        priority: [...this.selectedPriorities()],
      },
      page: 0,
    }));
  }

  protected resetFilters(): void {
    this.searchTerm.set('');
    this.selectedStatuses.set([]);
    this.selectedPriorities.set([]);
    this.query.set({
      ...INITIAL_TABLE_QUERY,
      sort: 'updatedAt',
      direction: 'desc',
      filters: { status: [], priority: [] },
    });
  }

  protected toggleSort(key: string): void {
    this.query.update((query) => ({
      ...query,
      sort: key,
      direction: query.sort === key && query.direction === 'asc' ? 'desc' : 'asc',
      page: 0,
    }));
  }

  protected setPage(page: number): void {
    this.query.update((query) => ({ ...query, page }));
  }

  protected setPageSize(size: number): void {
    this.query.update((query) => ({ ...query, size, page: 0 }));
  }

  protected formatProgress(progress: number): string {
    return `${new Intl.NumberFormat('de-DE').format(progress)} %`;
  }
}
