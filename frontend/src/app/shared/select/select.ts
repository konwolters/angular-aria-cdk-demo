import { Combobox, ComboboxPopup, ComboboxWidget } from '@angular/aria/combobox';
import { Listbox, Option } from '@angular/aria/listbox';
import { ConnectedPosition, OverlayModule } from '@angular/cdk/overlay';
import {
  afterRenderEffect,
  Component,
  computed,
  ElementRef,
  input,
  model,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { FormValueControl, ValidationError, WithOptionalFieldTree } from '@angular/forms/signals';
import { IconComponent } from '../icon/icon';

const BELOW_FIRST_POSITIONS: ConnectedPosition[] = [
  { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetY: 6 },
  { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom', offsetY: -6 },
];

const ABOVE_FIRST_POSITIONS: ConnectedPosition[] = [
  { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom', offsetY: -6 },
  { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetY: 6 },
];

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

@Component({
  selector: 'app-select',
  imports: [Combobox, ComboboxPopup, ComboboxWidget, IconComponent, Listbox, Option, OverlayModule],
  templateUrl: './select.html',
  host: { class: 'block' },
})
export class SelectComponent implements FormValueControl<string> {
  protected readonly overlayPositions = signal(BELOW_FIRST_POSITIONS);

  readonly label = input.required<string>();
  readonly options = input.required<readonly SelectOption[]>();
  readonly placeholder = input('Auswählen…');
  readonly initialValue = input<string>();
  readonly changed = input<boolean>();
  readonly changedLabel = input('GEÄNDERT');
  readonly previousValueLabel = input('Wert vorher');
  readonly labelSize = input<'small' | 'medium'>('small');

  readonly value = model('');
  readonly touched = input(false);
  readonly touch = output<void>();
  readonly disabled = input(false);
  readonly invalid = input(false);
  readonly required = input(false);
  readonly readonly = input(false);
  readonly errors = input<readonly WithOptionalFieldTree<ValidationError>[]>([]);

  protected readonly expanded = signal(false);
  protected readonly capturedInitialValue = signal<string | null>(null);
  protected readonly origin = viewChild<ElementRef<HTMLElement>>('origin');
  protected readonly listbox = viewChild(Listbox);
  protected readonly selectedValues = computed(() => (this.value() ? [this.value()] : []));
  protected readonly originalValue = computed(
    () => this.initialValue() ?? this.capturedInitialValue() ?? this.value(),
  );
  protected readonly originalLabel = computed(
    () =>
      this.options().find((option) => option.value === this.originalValue())?.label ??
      this.originalValue(),
  );
  protected readonly isChanged = computed(
    () =>
      this.changed() ?? (this.originalValue().length > 0 && this.value() !== this.originalValue()),
  );
  protected readonly selectedLabel = computed(
    () => this.options().find((option) => option.value === this.value())?.label ?? '',
  );

  constructor() {
    afterRenderEffect(() => {
      if (this.initialValue() === undefined && this.capturedInitialValue() === null) {
        this.capturedInitialValue.set(this.value());
      }

      if (this.expanded()) {
        this.listbox()?.scrollActiveItemIntoView();
        this.updateOverlayPosition();
      }
    });
  }

  protected onExpandedChange(expanded: boolean): void {
    this.expanded.set(expanded && !this.readonly());
    if (expanded && !this.readonly()) this.updateOverlayPosition();
  }

  protected preventReadonlyFocus(event: MouseEvent): void {
    if (this.readonly()) event.preventDefault();
  }

  private updateOverlayPosition(): void {
    const originRect = this.origin()?.nativeElement.getBoundingClientRect();
    if (!originRect) return;

    const viewportHeight = window.innerHeight;
    const viewportMargin = 8;
    const spaceBelow = viewportHeight - originRect.bottom - viewportMargin;
    const spaceAbove = originRect.top - viewportMargin;
    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
    const optionHeight = rem * 2.5;
    const popupChromeHeight = rem * 0.5 + 2;
    const popupMaxHeight = rem * 16 + popupChromeHeight;
    const popupHeight = Math.min(
      this.options().length * optionHeight + popupChromeHeight,
      popupMaxHeight,
    );
    const fitsBelow = spaceBelow >= popupHeight;
    const fitsAbove = spaceAbove >= popupHeight;
    const shouldOpenBelow = fitsBelow || (!fitsAbove && spaceBelow >= spaceAbove);

    this.overlayPositions.set(shouldOpenBelow ? BELOW_FIRST_POSITIONS : ABOVE_FIRST_POSITIONS);
  }

  protected selectOption(values: string[]): void {
    if (this.readonly()) return;
    this.value.set(values[0] ?? '');
    this.close();
  }

  protected close(): void {
    this.expanded.set(false);
    this.touch.emit();
  }
}
