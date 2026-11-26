import { Directive, inject, input, TemplateRef } from '@angular/core';

@Directive({ selector: 'ng-template[appDataTableHeader]' })
export class DataTableHeaderDirective {
  readonly template = inject<TemplateRef<unknown>>(TemplateRef);

  readonly appDataTableHeader = input.required<string>();
}
