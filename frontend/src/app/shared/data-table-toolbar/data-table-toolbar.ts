import { Component, input, output } from '@angular/core';
import { ButtonComponent } from '../button/button';

@Component({
  selector: 'app-data-table-toolbar',
  imports: [ButtonComponent],
  templateUrl: './data-table-toolbar.html',
})
export class DataTableToolbarComponent {
  readonly resetLabel = input('Zurücksetzen');

  readonly apply = output<void>();
  readonly reset = output<void>();

  protected submit(event: Event): void {
    event.preventDefault();
    this.apply.emit();
  }

  protected resetFilters(): void {
    this.reset.emit();
  }
}
