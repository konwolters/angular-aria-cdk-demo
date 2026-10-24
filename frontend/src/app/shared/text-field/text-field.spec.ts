import { TestBed } from '@angular/core/testing';
import { TextFieldComponent } from './text-field';

describe('TextFieldComponent', () => {
  it('shows a branded changed badge and the configured previous-value label', async () => {
    await TestBed.configureTestingModule({ imports: [TextFieldComponent] }).compileComponents();

    const fixture = TestBed.createComponent(TextFieldComponent);
    fixture.componentRef.setInput('label', 'Name');
    fixture.componentRef.setInput('initialValue', 'Old value');
    fixture.componentRef.setInput('value', 'New value');
    fixture.componentRef.setInput('previousValueLabel', 'Version 3');
    fixture.detectChanges();

    const badge = fixture.nativeElement.querySelector('span.bg-brand') as HTMLElement;
    expect(badge.textContent.trim()).toBe('GEÄNDERT');
    expect(badge.classList).toContain('text-on-brand');
    expect(fixture.nativeElement.textContent).toContain('Version 3: Old value');
  });

  it('allows a history view to explicitly mark an unchanged-looking value as unchanged', async () => {
    await TestBed.configureTestingModule({ imports: [TextFieldComponent] }).compileComponents();

    const fixture = TestBed.createComponent(TextFieldComponent);
    fixture.componentRef.setInput('label', 'Name');
    fixture.componentRef.setInput('initialValue', 'Old value');
    fixture.componentRef.setInput('value', 'New value');
    fixture.componentRef.setInput('changed', false);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).not.toContain('GEÄNDERT');
  });
});
