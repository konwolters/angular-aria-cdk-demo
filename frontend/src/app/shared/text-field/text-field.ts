import {
  Component,
  afterRenderEffect,
  computed,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { FormValueControl, ValidationError, WithOptionalFieldTree } from '@angular/forms/signals';

export type TextFieldType = 'text' | 'email' | 'search' | 'url' | 'tel' | 'password';

@Component({
  selector: 'app-text-field',
  templateUrl: './text-field.html',
  host: { class: 'block' },
})
export class TextFieldComponent implements FormValueControl<string> {
  readonly label = input.required<string>();
  readonly type = input<TextFieldType>('text');
  readonly placeholder = input('');
  readonly prefix = input('');
  readonly initialValue = input<string>();
  readonly changed = input<boolean>();
  readonly changedLabel = input('GEÄNDERT');
  readonly previousValueLabel = input('Wert vorher');

  readonly value = model('');
  readonly touched = input(false);
  readonly touch = output<void>();
  readonly disabled = input(false);
  readonly invalid = input(false);
  readonly required = input(false);
  readonly readonly = input(false);
  readonly errors = input<readonly WithOptionalFieldTree<ValidationError>[]>([]);

  protected readonly capturedInitialValue = signal<string | null>(null);
  protected readonly originalValue = computed(
    () => this.initialValue() ?? this.capturedInitialValue() ?? this.value(),
  );
  protected readonly isChanged = computed(
    () =>
      this.changed() ?? (this.originalValue().length > 0 && this.value() !== this.originalValue()),
  );

  constructor() {
    afterRenderEffect(() => {
      if (this.initialValue() === undefined && this.capturedInitialValue() === null) {
        this.capturedInitialValue.set(this.value());
      }
    });
  }

  protected updateValue(event: Event): void {
    this.value.set((event.target as HTMLInputElement).value);
  }
}
