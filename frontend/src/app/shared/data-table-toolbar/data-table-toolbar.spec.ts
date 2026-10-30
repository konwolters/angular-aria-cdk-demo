import { TestBed } from '@angular/core/testing';
import { DataTableToolbarComponent } from './data-table-toolbar';
import { Component } from '@angular/core';

@Component({
  imports: [DataTableToolbarComponent],
  template: `<app-data-table-toolbar [showReset]="false" [applyDisabled]="true">
    <span data-table-summary>3 Treffer</span>
    <button data-table-actions type="button">Export</button>
  </app-data-table-toolbar>`,
})
class ToolbarHost {}

describe('DataTableToolbarComponent', () => {
  it('projects summary and custom actions and can hide reset or disable apply', () => {
    const fixture = TestBed.createComponent(ToolbarHost);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('3 Treffer');
    const buttons = [...fixture.nativeElement.querySelectorAll('button')] as HTMLButtonElement[];
    expect(buttons.map((button) => button.textContent?.trim())).toEqual(['Export', 'Suchen']);
    expect(buttons[1].disabled).toBe(true);
    const summary = fixture.nativeElement.querySelector('[data-table-summary]');
    const summaryRow = summary.parentElement as HTMLElement;
    expect(summaryRow.classList.contains('basis-full')).toBe(true);
    expect(summaryRow.classList.contains('text-xs')).toBe(true);
    expect(summaryRow.classList.contains('text-content-muted')).toBe(true);
    expect(summaryRow.previousElementSibling).toBe(buttons[1]);
  });

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
    expect(fixture.nativeElement.querySelector('.basis-full').matches(':empty')).toBe(true);

    const buttons = [...fixture.nativeElement.querySelectorAll('button')];
    buttons.find((button) => button.textContent?.trim() === 'Suchen')?.click();
    buttons.find((button) => button.textContent?.includes('Zurücksetzen'))?.click();

    expect(applyCount).toBe(1);
    expect(resetCount).toBe(1);
  });
});
