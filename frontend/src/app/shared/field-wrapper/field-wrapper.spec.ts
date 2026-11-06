import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MultiSelectComponent } from '../multi-select/multi-select';
import { SelectComponent } from '../select/select';
import { TextFieldComponent } from '../text-field/text-field';
import { TextareaComponent } from '../textarea/textarea';

@Component({
  imports: [TextFieldComponent, TextareaComponent, SelectComponent, MultiSelectComponent],
  template: `
    <app-text-field
      label="Name"
      hint="Hinweis"
      [invalid]="true"
      [touched]="true"
      [errors]="errors"
    />
    <app-textarea label="Text" hint="Hinweis" [invalid]="true" [touched]="true" [errors]="errors" />
    <app-select
      label="Auswahl"
      [options]="[]"
      hint="Hinweis"
      [invalid]="true"
      [touched]="true"
      [errors]="errors"
    />
    <app-select
      label="Suche"
      [options]="[]"
      hint="Hinweis"
      [searchable]="true"
      [invalid]="true"
      [touched]="true"
      [errors]="errors"
    />
    <app-multi-select
      label="Mehrfach"
      hint="Hinweis"
      [invalid]="true"
      [touched]="true"
      [errors]="errors"
    />
    <app-multi-select
      label="Mehrfachsuche"
      hint="Hinweis"
      [searchable]="true"
      [invalid]="true"
      [touched]="true"
      [errors]="errors"
    />
  `,
})
class FieldHost {
  readonly errors = [{ kind: 'required', message: 'Pflichtfeld' }];
}

describe('shared field wrapper', () => {
  it('associates each control with its own label and messages', () => {
    const fixture = TestBed.createComponent(FieldHost);
    fixture.detectChanges();
    const fields = fixture.nativeElement.querySelectorAll(
      'app-text-field, app-textarea, app-select, app-multi-select',
    ) as NodeListOf<HTMLElement>;
    const messageIds = new Set<string>();
    for (const field of fields) {
      const control = field.querySelector('input, textarea, [ngCombobox]') as HTMLElement;
      const messageId = control.getAttribute('aria-describedby')!;
      const messages = field.querySelector(`#${messageId}`)!;
      expect(messages.textContent).toContain('Hinweis');
      expect(messages.textContent).toContain('Pflichtfeld');
      expect(messageIds.has(messageId)).toBe(false);
      messageIds.add(messageId);
      if (
        (control instanceof HTMLInputElement && control.type === 'text' && control.id) ||
        control instanceof HTMLTextAreaElement
      ) {
        expect((field.querySelector('label') as HTMLLabelElement).htmlFor).toBe(control.id);
      } else {
        expect(control.getAttribute('aria-label')).toBeTruthy();
      }
    }
    expect(fields.length).toBe(6);
  });
});
