import { form, FormField } from '@angular/forms/signals';
import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SelectComponent, SelectOption } from './select';

@Component({
  imports: [FormField, SelectComponent],
  template: `
    <app-select label="Bereich" [options]="options" [formField]="teamForm.department" />
  `,
})
class SelectHostComponent {
  readonly model = signal({ department: '' });
  readonly teamForm = form(this.model);
  readonly options: readonly SelectOption[] = [
    { value: 'Design', label: 'Design' },
    { value: 'Engineering', label: 'Engineering' },
  ];
}

describe('SelectComponent', () => {
  it('marks a changed prefilled value and shows the previous option label', async () => {
    await TestBed.configureTestingModule({ imports: [SelectComponent] }).compileComponents();

    const fixture = TestBed.createComponent(SelectComponent);
    fixture.componentRef.setInput('label', 'Bereich');
    fixture.componentRef.setInput('options', [
      { value: 'design', label: 'Design' },
      { value: 'engineering', label: 'Engineering' },
    ]);
    fixture.componentRef.setInput('initialValue', 'design');
    fixture.componentRef.setInput('value', 'engineering');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('GEÄNDERT');
    expect(fixture.nativeElement.textContent).toContain('Wert vorher: Design');
  });

  it('opens its accessible options and updates a Signal Form field', async () => {
    await TestBed.configureTestingModule({ imports: [SelectHostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(SelectHostComponent);
    fixture.detectChanges();

    (fixture.nativeElement.querySelector('[ngCombobox]') as HTMLButtonElement).click();
    await fixture.whenStable();
    TestBed.tick();

    const engineeringOption = [...document.querySelectorAll('[ngOption]')].find((option) =>
      option.textContent?.includes('Engineering'),
    ) as HTMLElement;
    engineeringOption.click();
    await fixture.whenStable();

    expect(fixture.componentInstance.model().department).toBe('Engineering');
  });
});
