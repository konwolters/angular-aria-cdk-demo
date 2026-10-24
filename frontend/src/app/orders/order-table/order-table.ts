import { Component, computed, inject, signal } from '@angular/core';
import { DataTableCellDirective } from '../../shared/data-table/data-table-cell.directive';
import { DataTableColumn, DataTableComponent } from '../../shared/data-table/data-table';
import { DataTableToolbarComponent } from '../../shared/data-table-toolbar/data-table-toolbar';
import { ServerTableService } from '../../shared/data-table/server-table.service';
import { INITIAL_TABLE_QUERY, TableQuery } from '../../shared/data-table/table.model';
import { MultiSelectComponent } from '../../shared/multi-select/multi-select';
import { Order } from '../order.model';
import { TextFieldComponent } from '../../shared/text-field/text-field';

@Component({
  selector: 'app-order-table',
  imports: [
    DataTableCellDirective,
    DataTableComponent,
    DataTableToolbarComponent,
    MultiSelectComponent,
    TextFieldComponent,
  ],
  templateUrl: './order-table.html',
})
export class OrderTableComponent {
  private readonly tableService = inject(ServerTableService);
  private readonly currencyFormatter = new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  });
  protected readonly query = signal<TableQuery>({
    ...INITIAL_TABLE_QUERY,
    sort: 'orderedAt',
    filters: { status: [], paymentMethod: [] },
  });

  protected readonly searchTerm = signal('');
  protected readonly selectedStatuses = signal<string[]>([]);
  protected readonly selectedPaymentMethods = signal<string[]>([]);
  protected readonly result = this.tableService.search<Order>('/api/orders', this.query);

  protected readonly rows = computed(() => this.result.value().content);
  protected readonly total = computed(() => this.result.value().totalElements);
  protected readonly totalPages = computed(() => this.result.value().totalPages);
  protected readonly loading = this.result.isLoading;
  protected readonly error = computed(() =>
    this.result.error() ? 'Bestellungen konnten nicht geladen werden.' : null,
  );

  protected readonly statusOptions = ['Bezahlt', 'Ausstehend', 'Erstattet'];
  protected readonly paymentMethods = ['Kreditkarte', 'Überweisung', 'PayPal'];
  protected readonly columns: readonly DataTableColumn<Order>[] = [
    {
      key: 'orderNumber',
      header: 'Bestellnummer',
      sortable: true,
      value: (order) => order.orderNumber,
    },
    { key: 'customer', header: 'Kunde', sortable: true, value: (order) => order.customer },
    { key: 'orderedAt', header: 'Bestellt am', sortable: true, value: (order) => order.orderedAt },
    { key: 'status', header: 'Status', value: (order) => order.status },
    { key: 'paymentMethod', header: 'Zahlungsart', value: (order) => order.paymentMethod },
    {
      key: 'total',
      header: 'Betrag',
      sortable: true,
      value: (order) => this.currencyFormatter.format(order.total),
    },
  ];
  protected readonly trackOrder = (order: Order): number => order.id;

  protected applyFilters(): void {
    this.query.update((query) => ({
      ...query,
      search: this.searchTerm().trim(),
      filters: {
        status: [...this.selectedStatuses()],
        paymentMethod: [...this.selectedPaymentMethods()],
      },
      page: 0,
    }));
  }

  protected resetFilters(): void {
    this.searchTerm.set('');
    this.selectedStatuses.set([]);
    this.selectedPaymentMethods.set([]);
    this.query.set({
      ...INITIAL_TABLE_QUERY,
      sort: 'orderedAt',
      filters: { status: [], paymentMethod: [] },
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
}
