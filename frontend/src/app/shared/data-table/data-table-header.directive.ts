import { Directive, inject, input, TemplateRef } from '@angular/core';

@Directive({ selector: 'ng-template[appDataTableHeader]' })
export class DataTableHeaderDirective {
  readonly appDataTableHeader = input.required<string>();
  readonly template = inject<TemplateRef<unknown>>(TemplateRef);
}
