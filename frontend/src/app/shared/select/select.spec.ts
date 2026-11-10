import { form, FormField } from '@angular/forms/signals';
import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SelectComponent, SelectOption } from './select';

@Component({
  imports: [FormField, SelectComponent],
  templateUrl: './select.spec.html',
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
  it('renders a dropdown arrow for searchable selection and opens on icon click', async () => {
    const fixture = TestBed.createComponent(SelectComponent);
    fixture.componentRef.setInput('label', 'Depot');
    fixture.componentRef.setInput('options', [{ value: 'd1', label: 'Hauptdepot' }]);
    fixture.componentRef.setInput('searchable', true);
    fixture.detectChanges();
    (fixture.nativeElement.querySelector('app-icon') as HTMLElement).click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(document.activeElement).toBe(fixture.nativeElement.querySelector('input'));
    expect(document.querySelector('[ngOption]')?.textContent).toContain('Hauptdepot');
  });

  it('filters searchable options without accepting free text or offering a clear button', async () => {
    const fixture = TestBed.createComponent(SelectComponent);
    fixture.componentRef.setInput('label', 'Depot');
    fixture.componentRef.setInput('options', [
      { value: 'd1', label: '10001' },
      { value: 'd2', label: '20002' },
    ]);
    fixture.componentRef.setInput('searchable', true);
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    input.click();
    input.value = '200';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    await fixture.whenStable();
    expect(fixture.componentInstance.value()).toBe('');
    const options = [...document.querySelectorAll('[ngOption]')] as HTMLElement[];
    expect(options.map((option) => option.textContent?.trim())).toEqual(['20002']);
    options[0].click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(fixture.componentInstance.value()).toBe('d2');
    expect(
      fixture.nativeElement.querySelector('button[aria-label$="Auswahl entfernen"]'),
    ).toBeNull();
  });

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
    const badge = [...fixture.nativeElement.querySelectorAll('span')].find(
      (element) => (element as HTMLElement).textContent?.trim() === 'GEÄNDERT',
    ) as HTMLElement;
    expect(badge.classList.contains('bg-brand')).toBe(true);
    expect(badge.classList.contains('text-on-brand')).toBe(true);
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
