import { TestBed } from '@angular/core/testing';
import { StepperComponent } from './stepper';

describe('StepperComponent', () => {
  it('announces current and completed steps without enabling navigation', () => {
    const fixture = TestBed.createComponent(StepperComponent);
    fixture.componentRef.setInput('steps', [
      { value: 'file', label: 'Datei' },
      { value: 'preview', label: 'Vorschau' },
    ]);
    fixture.componentRef.setInput('current', 'preview');
    fixture.componentRef.setInput('completed', ['file']);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[aria-current="step"]').textContent).toContain(
      'Vorschau',
    );
    expect(fixture.nativeElement.textContent).toContain('abgeschlossen');
    expect(fixture.nativeElement.querySelector('button')).toBeNull();
  });
});
