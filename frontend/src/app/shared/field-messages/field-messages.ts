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
  template: `
    <div [id]="id()" class="text-xs" [class.mt-1]="hint() || (showErrors() && errors().length > 0)">
      @if (hint()) {
        <p class="text-content-muted">{{ hint() }}</p>
      }
      @if (showErrors()) {
        <ul class="text-danger" aria-live="polite">
          @for (error of errors(); track $index) {
            <li>{{ error.message || 'Ungültiger Wert' }}</li>
          }
        </ul>
      }
    </div>
  `,
})
export class FieldMessagesComponent {
  readonly id = input.required<string>();
  readonly hint = input('');
  readonly showErrors = input(false);
  readonly errors = input<readonly WithOptionalFieldTree<ValidationError>[]>([]);
}
