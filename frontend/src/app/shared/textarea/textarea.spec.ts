import { TestBed } from '@angular/core/testing';
import { TextareaComponent } from './textarea';

describe('TextareaComponent', () => {
  it('shows the original text when the prefilled value changes', async () => {
    await TestBed.configureTestingModule({ imports: [TextareaComponent] }).compileComponents();

    const fixture = TestBed.createComponent(TextareaComponent);
    fixture.componentRef.setInput('label', 'Beschreibung');
    fixture.componentRef.setInput('initialValue', 'Original description');
    fixture.componentRef.setInput('value', 'Updated description');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('GEÄNDERT');
    expect(fixture.nativeElement.textContent).toContain('Wert vorher: Original description');
  });
});
