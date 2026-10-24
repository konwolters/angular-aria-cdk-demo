import { Directive, inject, input, TemplateRef } from '@angular/core';

@Directive({
  selector: 'ng-template[appDataTableCell]',
})
export class DataTableCellDirective<T = unknown> {
  readonly appDataTableCell = input.required<string>();
  readonly template = inject<TemplateRef<{ $implicit: T }>>(TemplateRef);
}
