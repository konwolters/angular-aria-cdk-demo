import { Combobox, ComboboxPopup, ComboboxWidget } from '@angular/aria/combobox';
import { Listbox, Option } from '@angular/aria/listbox';
import { OverlayModule } from '@angular/cdk/overlay';
import { IconComponent } from '../icon/icon';
import {
  afterRenderEffect,
  Component,
  computed,
  input,
  model,
  signal,
  viewChild,
} from '@angular/core';

@Component({
  selector: 'app-multi-select',
  imports: [Combobox, ComboboxPopup, ComboboxWidget, IconComponent, Listbox, Option, OverlayModule],
  templateUrl: './multi-select.html',
  host: { class: 'block' },
})
export class MultiSelectComponent {
  readonly label = input.required<string>();
  readonly options = input<readonly string[]>([]);
  readonly selected = model<string[]>([]);
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
    const selected = this.selected();

    return this.options().filter(
      (option) =>
        selected.includes(option) || term.length === 0 || option.toLocaleLowerCase().includes(term),
    );
  });
  protected readonly selectionSummary = computed(() => {
    const values = this.selected();
    const displayLimit = Math.max(0, this.maxDisplayedValues());
    const displayValue =
      values.length > displayLimit ? `${values.length} ausgewählt` : values.join(', ');

    return {
      displayValue,
      accessibleLabel: values.length > 0 ? `${this.label()}: ${values.join(', ')}` : this.label(),
    };
  });
  protected readonly originalValues = computed(
    () => this.initialValue() ?? this.capturedInitialValue() ?? this.selected(),
  );
  protected readonly isChanged = computed(() => {
    const changed = this.changed();
    if (changed !== undefined) return changed;

    const original = this.originalValues();
    const selected = this.selected();
    return (
      original.length > 0 &&
      (original.length !== selected.length || original.some((value) => !selected.includes(value)))
    );
  });

  constructor() {
    afterRenderEffect(() => {
      if (this.initialValue() === undefined && this.capturedInitialValue() === null) {
        this.capturedInitialValue.set([...this.selected()]);
      }

      if (this.expanded()) {
        this.listbox()?.scrollActiveItemIntoView();
      }
    });
  }

  protected updateSearchTerm(event: Event): void {
    this.searchTerm.set((event.target as HTMLInputElement).value);
  }

  protected onExpandedChange(expanded: boolean): void {
    this.expanded.set(expanded && !this.readonly());
  }

  protected preventReadonlyFocus(event: MouseEvent): void {
    if (this.readonly()) event.preventDefault();
  }

  protected close(): void {
    this.expanded.set(false);
    this.searchTerm.set('');
  }

  protected setSelected(values: string[]): void {
    if (this.readonly()) return;
    this.selected.set(values);
    this.searchTerm.set('');
  }
}
