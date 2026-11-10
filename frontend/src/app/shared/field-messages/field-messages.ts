import { Component, input } from '@angular/core';
import { ValidationError, WithOptionalFieldTree } from '@angular/forms/signals';

@Component({
  selector: 'app-field-messages',
  templateUrl: './field-messages.html',
})
export class FieldMessagesComponent {
  readonly id = input.required<string>();
  readonly hint = input('');
  readonly showErrors = input(false);
  readonly errors = input<readonly WithOptionalFieldTree<ValidationError>[]>([]);
}
