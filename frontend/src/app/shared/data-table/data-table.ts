import { NgTemplateOutlet } from '@angular/common';
import { Component, computed, contentChildren, input, output, TemplateRef } from '@angular/core';
import { DataTableCellDirective } from './data-table-cell.directive';
import { DataTableHeaderDirective } from './data-table-header.directive';
import { ButtonComponent } from '../button/button';
import { IconName } from '../icon/icon';
import { SelectComponent, SelectOption } from '../select/select';

export interface DataTableColumn<T> {
  key: string;
  header: string;
  value: (row: T) => string;
  sortable?: boolean;
  width?: string;
  minWidth?: string;
}

@Component({
  selector: 'app-data-table',
  imports: [ButtonComponent, NgTemplateOutlet, SelectComponent],
  templateUrl: './data-table.html',
})
export class DataTableComponent<T> {
  readonly rows = input.required<readonly T[]>();
  readonly columns = input.required<readonly DataTableColumn<T>[]>();
  readonly framed = input(true);
  readonly compact = input(false);
  readonly layout = input<'auto' | 'fixed'>('auto');
  readonly striped = input(true);
  readonly pagination = input(true);
  readonly total = input(0);
  readonly totalPages = input(0);
  readonly page = input(0);
  readonly pageSize = input(8);
  readonly pageSizeOptions = input<readonly number[]>([8, 16, 32]);
  readonly pageWindowSize = input(5);
  readonly sort = input('');
  readonly direction = input<'asc' | 'desc'>('asc');
  readonly loading = input(false);
  readonly error = input<string | null>(null);
  readonly emptyMessage = input('Keine Einträge gefunden.');
  readonly caption = input('Datenübersicht');
  readonly trackBy = input<(row: T) => unknown>((row) => row);

  readonly sortChange = output<string>();
  readonly pageChange = output<number>();
  readonly pageSizeChange = output<number>();

  protected readonly cellTemplates = contentChildren(DataTableCellDirective);
  protected readonly headerTemplates = contentChildren(DataTableHeaderDirective);
  protected readonly pageSizeSelectOptions = computed<SelectOption[]>(() =>
    this.pageSizeOptions().map((size) => ({ value: String(size), label: String(size) })),
  );
  protected readonly visiblePages = computed(() => {
    const pageCount = Math.max(0, this.totalPages());
    const windowSize = Math.min(pageCount, Math.max(1, Math.trunc(this.pageWindowSize())));
    const centeredStart = this.page() - Math.floor(windowSize / 2);
    const start = Math.max(0, Math.min(centeredStart, pageCount - windowSize));

    return Array.from({ length: windowSize }, (_, offset) => start + offset);
  });

  protected readonly firstRow = () => (this.total() === 0 ? 0 : this.page() * this.pageSize() + 1);
  protected readonly lastRow = () => Math.min((this.page() + 1) * this.pageSize(), this.total());

  protected headerTemplate(key: string): TemplateRef<unknown> | undefined {
    return this.headerTemplates().find((header) => header.appDataTableHeader() === key)?.template;
  }

  protected sortIcon(key: string): IconName {
    if (this.sort() !== key) return 'sort';
    return this.direction() === 'asc' ? 'sort-ascending' : 'sort-descending';
  }

  protected cellTemplate(key: string): TemplateRef<{ $implicit: T }> | undefined {
    return this.cellTemplates().find((cell) => cell.appDataTableCell() === key)?.template as
      TemplateRef<{ $implicit: T }> | undefined;
  }

  protected updatePageSize(value: string): void {
    this.pageSizeChange.emit(Number(value));
  }
}
