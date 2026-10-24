import { TestBed } from '@angular/core/testing';
import { DataTableToolbarComponent } from './data-table-toolbar';

describe('DataTableToolbarComponent', () => {
  it('emits apply and reset actions without rendering a built-in search field', async () => {
    await TestBed.configureTestingModule({
      imports: [DataTableToolbarComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(DataTableToolbarComponent);
    fixture.detectChanges();

    let applyCount = 0;
    let resetCount = 0;
    fixture.componentInstance.apply.subscribe(() => applyCount++);
    fixture.componentInstance.reset.subscribe(() => resetCount++);

    expect(fixture.nativeElement.querySelector('input')).toBeNull();

    const buttons = [...fixture.nativeElement.querySelectorAll('button')];
    buttons.find((button) => button.textContent?.trim() === 'Suchen')?.click();
    buttons.find((button) => button.textContent?.includes('Zurücksetzen'))?.click();

    expect(applyCount).toBe(1);
    expect(resetCount).toBe(1);
  });
});
