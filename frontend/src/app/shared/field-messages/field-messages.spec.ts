import { TestBed } from '@angular/core/testing';
import { TextFieldComponent } from '../text-field/text-field';
import { TextareaComponent } from '../textarea/textarea';

describe('Shared field feedback', () => {
  it('does not add vertical spacing when feedback is empty', () => {
    const fixture = TestBed.createComponent(TextFieldComponent);
    fixture.componentRef.setInput('label', 'Suche');
    fixture.detectChanges();

    const messages = fixture.nativeElement.querySelector('app-field-messages div');
    expect(messages.classList.contains('mt-1')).toBe(false);

    fixture.componentRef.setInput('hint', 'Ein Hinweis');
    fixture.detectChanges();
    expect(messages.classList.contains('mt-1')).toBe(true);
  });

  for (const component of [TextFieldComponent, TextareaComponent]) {
    it(`connects hints/errors and maxlength to ${component.name}`, () => {
      const fixture = TestBed.createComponent(component as typeof TextFieldComponent);
      fixture.componentRef.setInput('label', 'Name');
      fixture.componentRef.setInput('hint', 'Maximal 10 Zeichen');
      fixture.componentRef.setInput('maxLength', 10);
      fixture.componentRef.setInput('invalid', true);
      fixture.componentRef.setInput('errors', [{ kind: 'required', message: 'Pflichtfeld' }]);
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent).not.toContain('Pflichtfeld');
      fixture.componentRef.setInput('touched', true);
      fixture.detectChanges();
      const input = fixture.nativeElement.querySelector('input, textarea') as HTMLInputElement;
      expect(input.maxLength).toBe(10);
      const description = fixture.nativeElement.querySelector(
        `[id="${input.getAttribute('aria-describedby')}"]`,
      );
      expect(description.textContent).toContain('Maximal 10 Zeichen');
      expect(description.textContent).toContain('Pflichtfeld');
      fixture.componentRef.setInput('readonly', true);
      fixture.detectChanges();
      expect(input.readOnly).toBe(true);
      expect(input.disabled).toBe(false);
      expect(fixture.nativeElement.textContent).not.toContain('Pflichtfeld');
    });
  }
});
