import { TestBed } from '@angular/core/testing';
import { MultiSelectComponent } from './multi-select';

describe('MultiSelectComponent', () => {
  it('shows the previous selected values when a prefilled selection changes', async () => {
    await TestBed.configureTestingModule({ imports: [MultiSelectComponent] }).compileComponents();

    const fixture = TestBed.createComponent(MultiSelectComponent);
    fixture.componentRef.setInput('label', 'Region');
    fixture.componentRef.setInput('initialValue', ['Europe']);
    fixture.componentRef.setInput('selected', ['Asia Pacific']);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('GEÄNDERT');
    expect(fixture.nativeElement.textContent).toContain('Wert vorher: Europe');
  });

  it('shows only the total selected count when the display limit is exceeded', async () => {
    await TestBed.configureTestingModule({ imports: [MultiSelectComponent] }).compileComponents();

    const fixture = TestBed.createComponent(MultiSelectComponent);
    fixture.componentRef.setInput('label', 'Region');
    fixture.componentRef.setInput('selected', [
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
    fixture.componentRef.setInput('selected', ['North America', 'Europe', 'Asia Pacific']);
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
    fixture.componentRef.setInput('selected', ['North America', 'Europe']);
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
