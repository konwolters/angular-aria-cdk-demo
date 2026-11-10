import { Component, input, output } from '@angular/core';
import { ButtonComponent, ButtonSize } from '../button/button';

@Component({
  selector: 'app-data-table-toolbar',
  imports: [ButtonComponent],
  templateUrl: './data-table-toolbar.html',
})
export class DataTableToolbarComponent {
  readonly resetLabel = input('Zurücksetzen');
  readonly showReset = input(true);
  readonly showApply = input(true);
  readonly compactTop = input(false);
  readonly applyDisabled = input(false);
  readonly buttonSize = input<ButtonSize>('small');

  readonly apply = output<void>();
  readonly reset = output<void>();

  protected submit(event: Event): void {
    event.preventDefault();
    if (!this.applyDisabled()) this.apply.emit();
  }

  protected resetFilters(): void {
    this.reset.emit();
  }
}
