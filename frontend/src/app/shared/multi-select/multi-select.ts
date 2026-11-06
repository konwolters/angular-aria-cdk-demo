import { Combobox, ComboboxPopup, ComboboxWidget } from '@angular/aria/combobox';
import { Listbox, Option } from '@angular/aria/listbox';
import { OverlayModule } from '@angular/cdk/overlay';
import { IconComponent } from '../icon/icon';
import {
  afterRenderEffect,
  Component,
  computed,
  input,
  inject,
  model,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { FormValueControl, ValidationError, WithOptionalFieldTree } from '@angular/forms/signals';
import { SelectOption } from '../select/select';
import { ControlIdService } from '../field-messages/field-messages';
import { FieldWrapperComponent } from '../field-wrapper/field-wrapper';

@Component({
  selector: 'app-multi-select',
  imports: [
    Combobox,
    ComboboxPopup,
    ComboboxWidget,
    IconComponent,
    Listbox,
    Option,
    OverlayModule,
    FieldWrapperComponent,
  ],
  templateUrl: './multi-select.html',
  host: { class: 'block' },
})
export class MultiSelectComponent implements FormValueControl<string[]> {
  protected readonly messagesId = inject(ControlIdService).next();
  readonly disabled = input(false);
  readonly required = input(false);
  readonly invalid = input(false);
  readonly touched = input(false);
  readonly touch = output<void>();
  readonly errors = input<readonly WithOptionalFieldTree<ValidationError>[]>([]);
  readonly hint = input('');
  readonly hideLabel = input(false);
  readonly placeholder = input('Alle');
  readonly label = input.required<string>();
  readonly options = input<readonly (string | SelectOption)[]>([]);
  readonly value = model<string[]>([]);
  protected readonly normalizedOptions = computed(() =>
    this.options().map((option) =>
      typeof option === 'string' ? { value: option, label: option } : option,
    ),
  );
  protected labelFor(value: string, short = false): string {
    const option = this.normalizedOptions().find((option) => option.value === value);
    return (short ? option?.shortLabel : undefined) ?? option?.label ?? value;
  }
  protected readonly originalLabels = computed(() =>
    this.originalValues()
      .map((value) => this.labelFor(value))
      .join(', '),
  );
  readonly searchable = input(false);
  readonly maxDisplayedValues = input(2);
  readonly initialValue = input<readonly string[]>();
  readonly changed = input<boolean>();
  readonly readonly = input(false);
  readonly changedLabel = input('GEÄNDERT');
  readonly previousValueLabel = input('Wert vorher');
  readonly labelSize = input<'small' | 'medium'>('small');

  protected readonly expanded = signal(false);
  protected readonly searchTerm = signal('');
  protected readonly capturedInitialValue = signal<readonly string[] | null>(null);
  protected readonly listbox = viewChild(Listbox);
  protected readonly combobox = viewChild(Combobox);
  protected readonly visibleOptions = computed(() => {
    const term = this.searchTerm().trim().toLocaleLowerCase();
    const selected = this.value();

    return this.normalizedOptions().filter(
      (option) =>
        selected.includes(option.value) ||
        term.length === 0 ||
        option.label.toLocaleLowerCase().includes(term) ||
        option.value.toLocaleLowerCase().includes(term),
    );
  });
  protected readonly selectionSummary = computed(() => {
    const values = this.value();
    const displayLimit = Math.max(0, this.maxDisplayedValues());
    const displayValue =
      values.length > displayLimit
        ? `${values.length} ausgewählt`
        : values.map((value) => this.labelFor(value, true)).join(', ');

    return {
      displayValue,
      accessibleLabel:
        values.length > 0
          ? `${this.label()}: ${values.map((value) => this.labelFor(value)).join(', ')}`
          : this.label(),
    };
  });
  protected readonly originalValues = computed(
    () => this.initialValue() ?? this.capturedInitialValue() ?? this.value(),
  );
  protected readonly isChanged = computed(() => {
    const changed = this.changed();
    if (changed !== undefined) return changed;

    const original = this.originalValues();
    const selected = this.value();
    return (
      original.length > 0 &&
      (original.length !== selected.length || original.some((value) => !selected.includes(value)))
    );
  });

  constructor() {
    afterRenderEffect(() => {
      if (this.initialValue() === undefined && this.capturedInitialValue() === null) {
        this.capturedInitialValue.set([...this.value()]);
      }

      if (this.expanded()) {
        this.listbox()?.scrollActiveItemIntoView();
      }
    });
  }

  protected updateSearchTerm(event: Event): void {
    this.searchTerm.set((event.target as HTMLInputElement).value);
  }

  protected openSearch(input: HTMLInputElement): void {
    if (this.readonly() || this.disabled()) return;
    input.focus();
    this.onExpandedChange(true);
  }

  protected onExpandedChange(expanded: boolean): void {
    this.expanded.set(expanded && !this.readonly() && !this.disabled());
  }

  protected preventReadonlyFocus(event: MouseEvent): void {
    if (this.readonly()) event.preventDefault();
  }

  protected close(): void {
    this.expanded.set(false);
    this.searchTerm.set('');
    this.touch.emit();
  }

  protected setSelected(values: string[]): void {
    if (this.readonly() || this.disabled()) return;
    this.value.set(values);
    this.searchTerm.set('');
  }
}
