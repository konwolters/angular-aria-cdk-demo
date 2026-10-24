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

@Component({
  selector: 'app-textarea',
  templateUrl: './textarea.html',
  host: { class: 'block' },
})
export class TextareaComponent implements FormValueControl<string> {
  readonly label = input.required<string>();
  readonly placeholder = input('');
  readonly rows = input(4);
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
    this.value.set((event.target as HTMLTextAreaElement).value);
  }
}
