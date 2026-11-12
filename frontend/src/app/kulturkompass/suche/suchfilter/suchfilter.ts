import { Component, input, model, output } from '@angular/core';
import { ButtonComponent } from '../../../shared/button/button';
import { DataTableToolbarComponent } from '../../../shared/data-table-toolbar/data-table-toolbar';
import { MultiSelectComponent } from '../../../shared/multi-select/multi-select';
import { SelectComponent, SelectOption } from '../../../shared/select/select';
import { TextFieldComponent } from '../../../shared/text-field/text-field';

@Component({
  selector: 'app-suchfilter',
  imports: [
    ButtonComponent,
    DataTableToolbarComponent,
    MultiSelectComponent,
    SelectComponent,
    TextFieldComponent,
  ],
  templateUrl: './suchfilter.html',
})
export class SuchfilterComponent {
  readonly page = input.required<'veranstaltungsorte' | 'angebot' | 'staging'>();
  readonly count = input.required<number>();
  readonly statuses = input.required<readonly SelectOption[]>();
  readonly query = model.required<string>();
  readonly customerNumber = model.required<string>();
  readonly status = model.required<string>();
  readonly countries = model.required<string[]>();
  readonly businessTypes = model.required<string[]>();
  readonly referenceTypes = model.required<string[]>();
  readonly apply = output<void>();
  readonly reset = output<void>();
  readonly export = output<void>();
}
