import { NgTemplateOutlet } from '@angular/common';
import { Component, input } from '@angular/core';
import { ValidationError, WithOptionalFieldTree } from '@angular/forms/signals';
import { FieldMessagesComponent } from '../field-messages/field-messages';

@Component({
  selector: 'app-field-wrapper',
  imports: [FieldMessagesComponent, NgTemplateOutlet],
  host: { class: 'block' },
  templateUrl: './field-wrapper.html',
})
export class FieldWrapperComponent {
  readonly label = input.required<string>();
  readonly controlId = input<string>();
  readonly labelSize = input<'small' | 'medium'>('medium');
  readonly hideLabel = input(false);
  readonly required = input(false);
  readonly changed = input(false);
  readonly changedLabel = input('GEÄNDERT');
  readonly previousValueLabel = input('Wert vorher');
  readonly previousValue = input('');
  readonly messagesId = input.required<string>();
  readonly hint = input('');
  readonly errors = input<readonly WithOptionalFieldTree<ValidationError>[]>([]);
  readonly showErrors = input(false);
}
