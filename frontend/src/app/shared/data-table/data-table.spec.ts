import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DataTableCellDirective } from './data-table-cell.directive';
import { DataTableHeaderDirective } from './data-table-header.directive';
import { DataTableColumn, DataTableComponent } from './data-table';

interface DemoRow {
  id: number;
  name: string;
}

@Component({
  imports: [DataTableCellDirective, DataTableHeaderDirective, DataTableComponent],
  template: `
    <app-data-table
      [rows]="rows()"
      [columns]="columns"
      [total]="2"
      [totalPages]="5"
      [page]="0"
      [pageSize]="1"
      [pageWindowSize]="3"
      [trackBy]="trackRow"
      (sortChange)="sort.set($event)"
      (pageChange)="page.set($event)"
    >
      <ng-template appDataTableCell="name" let-row>
        <strong>{{ row.name }}</strong>
      </ng-template>
      <ng-template appDataTableHeader="custom"><span>Eigener Spaltenkopf</span></ng-template>
    </app-data-table>
  `,
})
class DataTableHostComponent {
  readonly rows = signal<DemoRow[]>([{ id: 1, name: 'First row' }]);
  readonly sort = signal('');
  readonly page = signal(0);
  readonly trackRow = (row: DemoRow): number => row.id;
  readonly columns: readonly DataTableColumn<DemoRow>[] = [
    { key: 'name', header: 'Name', value: (row) => row.name, sortable: true },
    { key: 'custom', header: 'Fallback', value: () => '' },
  ];
}

describe('DataTableComponent', () => {
  it('can hide all paging controls for local lists and comparisons', () => {
    const fixture = TestBed.createComponent(DataTableComponent);
    fixture.componentRef.setInput('rows', []);
    fixture.componentRef.setInput('columns', [{ key: 'name', header: 'Name', value: () => '' }]);
    fixture.componentRef.setInput('pagination', false);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('footer')).toBeNull();
    expect(fixture.nativeElement.querySelector('table')).not.toBeNull();
  });

  it('emits first and last page targets', () => {
    const fixture = TestBed.createComponent(DataTableComponent);
    fixture.componentRef.setInput('rows', []);
    fixture.componentRef.setInput('columns', []);
    fixture.componentRef.setInput('page', 2);
    fixture.componentRef.setInput('totalPages', 10);
    fixture.detectChanges();
    const pages: number[] = [];
    fixture.componentInstance.pageChange.subscribe((page) => pages.push(page));
    (
      fixture.nativeElement.querySelector('[aria-label="Erste Seite"]') as HTMLButtonElement
    ).click();
    (
      fixture.nativeElement.querySelector('[aria-label="Letzte Seite"]') as HTMLButtonElement
    ).click();
    expect(pages).toEqual([0, 9]);
  });

  it('renders projected cells and emits sorting and pagination events', async () => {
    await TestBed.configureTestingModule({ imports: [DataTableHostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(DataTableHostComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('strong')?.textContent).toBe('First row');
    expect(fixture.nativeElement.querySelector('thead').textContent).toContain(
      'Eigener Spaltenkopf',
    );
    expect(fixture.nativeElement.querySelector('thead').textContent).not.toContain('Fallback');
    expect(
      fixture.nativeElement.querySelectorAll(
        'button[aria-current="page"], nav button[aria-label^="Seite "]',
      ).length,
    ).toBe(3);

    (fixture.nativeElement.querySelector('thead button') as HTMLButtonElement).click();
    const nextButton = fixture.nativeElement.querySelector(
      'button[aria-label="Nächste Seite"]',
    ) as HTMLButtonElement;
    nextButton.click();

    expect(fixture.componentInstance.sort()).toBe('name');
    expect(fixture.componentInstance.page()).toBe(1);
  });
});
