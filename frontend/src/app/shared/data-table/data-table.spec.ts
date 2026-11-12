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
  templateUrl: './data-table.spec.html',
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
  it('supports compact cells and a fixed table layout without changing the defaults', () => {
    const fixture = TestBed.createComponent(DataTableComponent);
    fixture.componentRef.setInput('rows', [{ name: 'Test' }]);
    fixture.componentRef.setInput('columns', [
      { key: 'name', header: 'Name', value: (row: { name: string }) => row.name, width: '12rem' },
    ]);
    fixture.detectChanges();
    const table = fixture.nativeElement.querySelector('table') as HTMLTableElement;
    const cell = fixture.nativeElement.querySelector('tbody td') as HTMLTableCellElement;
    expect(table.classList.contains('table-auto')).toBe(true);
    expect(cell.classList.contains('py-2')).toBe(true);

    fixture.componentRef.setInput('compact', true);
    fixture.componentRef.setInput('layout', 'fixed');
    fixture.detectChanges();
    expect(table.classList.contains('table-fixed')).toBe(true);
    expect(table.classList.contains('table-auto')).toBe(false);
    expect(cell.classList.contains('py-1')).toBe(true);
    expect(cell.classList.contains('align-middle')).toBe(true);
    expect((fixture.nativeElement.querySelector('th') as HTMLElement).style.width).toBe('12rem');

    fixture.componentRef.setInput('rows', []);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('tbody td').classList.contains('py-3')).toBe(true);
  });

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
