import { TestBed } from '@angular/core/testing';
import { MultiSelectComponent } from './multi-select';
import { Component, signal } from '@angular/core';
import { form, FormField, required } from '@angular/forms/signals';

@Component({
  imports: [FormField, MultiSelectComponent],
  template: `<app-multi-select label="Status" [options]="options" [formField]="fields.status" />`,
})
class FormHost {
  readonly data = signal({ status: [] as string[] });
  readonly fields = form(this.data, (path) => required(path.status));
  readonly options = [
    { value: 'OPEN', label: 'Offen' },
    { value: 'LOCKED', label: 'Gesperrt', disabled: true },
  ];
}

describe('MultiSelectComponent', () => {
  it('opens and focuses the searchable field when clicking its arrow icon', async () => {
    const fixture = TestBed.createComponent(MultiSelectComponent);
    fixture.componentRef.setInput('label', 'Region');
    fixture.componentRef.setInput('options', ['Europe', 'Asia Pacific']);
    fixture.componentRef.setInput('searchable', true);
    fixture.detectChanges();

    (fixture.nativeElement.querySelector('app-icon') as HTMLElement).click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(document.activeElement).toBe(fixture.nativeElement.querySelector('input'));
    expect(
      [...document.querySelectorAll('[ngOption]')].map((option) => option.textContent?.trim()),
    ).toEqual(['Europe', 'Asia Pacific']);
  });

  for (const state of ['disabled', 'readonly']) {
    it(`does not open from the arrow icon when ${state}`, async () => {
      const fixture = TestBed.createComponent(MultiSelectComponent);
      fixture.componentRef.setInput('label', 'Region');
      fixture.componentRef.setInput('options', ['Europe']);
      fixture.componentRef.setInput('searchable', true);
      fixture.componentRef.setInput(state, true);
      fixture.detectChanges();
      (fixture.nativeElement.querySelector('app-icon') as HTMLElement).click();
      fixture.detectChanges();
      await fixture.whenStable();
      expect(document.querySelector('[ngOption]')).toBeNull();
      expect(document.activeElement).not.toBe(fixture.nativeElement.querySelector('input'));
    });
  }

  it('binds technical values to Signal Forms and displays labels', async () => {
    const fixture = TestBed.createComponent(FormHost);
    fixture.detectChanges();
    (fixture.nativeElement.querySelector('[ngCombobox]') as HTMLElement).click();
    fixture.detectChanges();
    await fixture.whenStable();
    const options = [...document.querySelectorAll('[ngOption]')] as HTMLElement[];
    options[1].click();
    expect(fixture.componentInstance.data().status).toEqual([]);
    options[0].click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(fixture.componentInstance.data().status).toEqual(['OPEN']);
    expect(fixture.nativeElement.querySelector('[ngCombobox]').textContent).toContain('Offen');
  });

  it('does not open when disabled and uses a configurable empty label', async () => {
    const fixture = TestBed.createComponent(MultiSelectComponent);
    fixture.componentRef.setInput('label', 'Status');
    fixture.componentRef.setInput('disabled', true);
    fixture.componentRef.setInput('placeholder', 'Keine Einschränkung');
    fixture.detectChanges();
    (fixture.nativeElement.querySelector('[ngCombobox]') as HTMLElement).click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(document.querySelector('[ngOption]')).toBeNull();
    expect(fixture.nativeElement.textContent).toContain('Keine Einschränkung');
  });

  it('shows the previous selected values when a prefilled selection changes', async () => {
    await TestBed.configureTestingModule({ imports: [MultiSelectComponent] }).compileComponents();

    const fixture = TestBed.createComponent(MultiSelectComponent);
    fixture.componentRef.setInput('label', 'Region');
    fixture.componentRef.setInput('initialValue', ['Europe']);
    fixture.componentRef.setInput('value', ['Asia Pacific']);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('GEÄNDERT');
    expect(fixture.nativeElement.textContent).toContain('Wert vorher: Europe');
  });

  it('shows only the total selected count when the display limit is exceeded', async () => {
    await TestBed.configureTestingModule({ imports: [MultiSelectComponent] }).compileComponents();

    const fixture = TestBed.createComponent(MultiSelectComponent);
    fixture.componentRef.setInput('label', 'Region');
    fixture.componentRef.setInput('value', [
      'North America',
      'Europe',
      'Asia Pacific',
      'Latin America',
    ]);
    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector('[ngCombobox]') as HTMLElement;
    expect(trigger.textContent).toContain('4 ausgewählt');
    expect(trigger.textContent).not.toContain('North America');
    expect(trigger.textContent).not.toContain('Europe');
  });

  it('allows configuring how many selected values are shown inline', async () => {
    await TestBed.configureTestingModule({ imports: [MultiSelectComponent] }).compileComponents();

    const fixture = TestBed.createComponent(MultiSelectComponent);
    fixture.componentRef.setInput('label', 'Region');
    fixture.componentRef.setInput('value', ['North America', 'Europe', 'Asia Pacific']);
    fixture.componentRef.setInput('maxDisplayedValues', 1);
    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector('[ngCombobox]') as HTMLElement;
    expect(trigger.textContent).toContain('3 ausgewählt');
    expect(trigger.textContent).not.toContain('North America');
  });

  it('shows selected labels comma-separated while within the display limit', async () => {
    await TestBed.configureTestingModule({ imports: [MultiSelectComponent] }).compileComponents();

    const fixture = TestBed.createComponent(MultiSelectComponent);
    fixture.componentRef.setInput('label', 'Region');
    fixture.componentRef.setInput('value', ['North America', 'Europe']);
    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector('[ngCombobox]') as HTMLElement;
    expect(trigger.textContent).toContain('North America, Europe');
    expect(trigger.textContent).not.toContain('ausgewählt');
  });

  it('shows all searchable options when its trigger is opened', async () => {
    await TestBed.configureTestingModule({ imports: [MultiSelectComponent] }).compileComponents();

    const fixture = TestBed.createComponent(MultiSelectComponent);
    fixture.componentRef.setInput('label', 'Region');
    fixture.componentRef.setInput('options', ['Europe', 'Asia Pacific', 'North America']);
    fixture.componentRef.setInput('searchable', true);
    fixture.detectChanges();

    (fixture.nativeElement.querySelector('[ngCombobox]') as HTMLInputElement).click();
    TestBed.tick();
    await fixture.whenStable();

    const options = [...document.querySelectorAll('[ngOption]')].map((option) =>
      option.textContent?.trim(),
    );
    expect(options).toEqual(['Europe', 'Asia Pacific', 'North America']);
  });
});
