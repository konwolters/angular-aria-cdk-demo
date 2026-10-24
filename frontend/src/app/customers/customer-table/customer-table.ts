import { email, form, FormField, FormRoot, required } from '@angular/forms/signals';
import { Component, computed, inject, signal } from '@angular/core';
import { Customer } from '../customer.model';
import { ButtonComponent } from '../../shared/button/button';
import { DataTableCellDirective } from '../../shared/data-table/data-table-cell.directive';
import { DataTableColumn, DataTableComponent } from '../../shared/data-table/data-table';
import { INITIAL_TABLE_QUERY, TableQuery } from '../../shared/data-table/table.model';
import { MultiSelectComponent } from '../../shared/multi-select/multi-select';
import { ModalComponent } from '../../shared/modal/modal';
import { SideDrawerComponent } from '../../shared/side-drawer/side-drawer';
import { DataTableToolbarComponent } from '../../shared/data-table-toolbar/data-table-toolbar';
import { ServerTableService } from '../../shared/data-table/server-table.service';
import { TextFieldComponent } from '../../shared/text-field/text-field';
import { SelectComponent, SelectOption } from '../../shared/select/select';

@Component({
  selector: 'app-customer-table',
  imports: [
    DataTableCellDirective,
    DataTableComponent,
    DataTableToolbarComponent,
    ButtonComponent,
    FormField,
    FormRoot,
    ModalComponent,
    MultiSelectComponent,
    SideDrawerComponent,
    SelectComponent,
    TextFieldComponent,
  ],
  templateUrl: './customer-table.html',
})
export class CustomerTableComponent {
  private readonly tableService = inject(ServerTableService);
  protected readonly query = signal<TableQuery>({
    ...INITIAL_TABLE_QUERY,
    sort: 'name',
    filters: { status: [], region: [] },
  });

  protected readonly searchTerm = signal('');
  protected readonly selectedStatuses = signal<string[]>([]);
  protected readonly selectedRegions = signal<string[]>([]);
  protected readonly selectedCustomer = signal<Customer | null>(null);
  protected readonly modalOpen = signal(false);
  protected readonly drawerOpen = signal(false);
  protected readonly newCustomerModel = signal({ name: '', email: '' });
  protected readonly newCustomerForm = form(
    this.newCustomerModel,
    (path) => {
      required(path.name, { message: 'Bitte gib einen Namen ein.' });
      required(path.email, { message: 'Bitte gib eine E-Mail-Adresse ein.' });
      email(path.email, { message: 'Bitte gib eine gültige E-Mail-Adresse ein.' });
    },
    {
      submission: {
        action: async () => {
          this.modalOpen.set(false);
          this.newCustomerModel.set({ name: '', email: '' });
        },
      },
    },
  );

  protected readonly result = this.tableService.search<Customer>('/api/customers', this.query);
  protected readonly rows = computed(() => this.result.value().content);
  protected readonly total = computed(() => this.result.value().totalElements);
  protected readonly totalPages = computed(() => this.result.value().totalPages);
  protected readonly loading = this.result.isLoading;
  protected readonly error = computed(() =>
    this.result.error()
      ? 'Die Daten konnten nicht geladen werden. Läuft das Spring-Boot-Backend?'
      : null,
  );

  protected readonly statusOptions = ['Active', 'Pending', 'Inactive'];
  protected readonly regionOptions = [
    'North America',
    'Europe',
    'Asia Pacific',
    'Latin America',
    'Africa',
    'Middle East',
    'Caribbean',
    'Oceania',
    'Northern Europe',
    'Southern Europe',
    'Western Europe',
    'Eastern Europe',
    'Central Europe',
    'Southeast Asia',
    'East Asia',
    'South Asia',
    'Central Asia',
    'West Asia',
    'North Africa',
    'West Africa',
    'East Africa',
    'Southern Africa',
    'Central Africa',
    'Central America',
    'South America',
    'Australia',
    'New Zealand',
    'Japan',
    'South Korea',
    'China',
    'India',
    'Singapore',
    'Hong Kong',
    'Taiwan',
    'Thailand',
    'Vietnam',
    'Malaysia',
    'Indonesia',
    'Philippines',
    'Brazil',
    'Mexico',
    'Argentina',
    'Chile',
    'Colombia',
    'Peru',
    'United States',
    'Canada',
    'United Kingdom',
    'Germany',
    'France',
  ];
  protected readonly statusSelectOptions: readonly SelectOption[] = this.statusOptions.map(
    (status) => ({ value: status, label: status }),
  );
  protected readonly regionSelectOptions: readonly SelectOption[] = this.regionOptions.map(
    (region) => ({ value: region, label: region }),
  );
  protected readonly columns: readonly DataTableColumn<Customer>[] = [
    { key: 'name', header: 'Name', sortable: true, value: (customer) => customer.name },
    {
      key: 'company',
      header: 'Unternehmen',
      sortable: true,
      value: (customer) => customer.company,
    },
    { key: 'status', header: 'Status', value: (customer) => customer.status },
    { key: 'region', header: 'Region', sortable: true, value: (customer) => customer.region },
    {
      key: 'joined',
      header: 'Beigetreten',
      sortable: true,
      value: (customer) => customer.joined,
    },
  ];
  protected readonly trackCustomer = (customer: Customer): number => customer.id;

  protected applyFilters(): void {
    this.query.update((query) => ({
      ...query,
      search: this.searchTerm().trim(),
      filters: {
        status: [...this.selectedStatuses()],
        region: [...this.selectedRegions()],
      },
      page: 0,
    }));
  }

  protected resetFilters(): void {
    this.searchTerm.set('');
    this.selectedStatuses.set([]);
    this.selectedRegions.set([]);
    this.query.set({
      ...INITIAL_TABLE_QUERY,
      sort: 'name',
      filters: { status: [], region: [] },
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

  protected openCustomerDetails(customer: Customer): void {
    this.selectedCustomer.set(customer);
    this.drawerOpen.set(true);
  }

  protected initials(name: string): string {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('');
  }
}
