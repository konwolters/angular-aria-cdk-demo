import { Component, Injectable, input } from '@angular/core';
import { ValidationError, WithOptionalFieldTree } from '@angular/forms/signals';

@Injectable({ providedIn: 'root' })
export class ControlIdService {
  private nextId = 0;
  next(): string {
    return `app-control-${this.nextId++}`;
  }
}

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
