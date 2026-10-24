import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DataTableCellDirective } from './data-table-cell.directive';
import { DataTableColumn, DataTableComponent } from './data-table';

interface DemoRow {
  id: number;
  name: string;
}

@Component({
  imports: [DataTableCellDirective, DataTableComponent],
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
  ];
}

describe('DataTableComponent', () => {
  it('renders projected cells and emits sorting and pagination events', async () => {
    await TestBed.configureTestingModule({ imports: [DataTableHostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(DataTableHostComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('strong')?.textContent).toBe('First row');
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
