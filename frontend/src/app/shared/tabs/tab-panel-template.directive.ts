import { Directive, inject, input, TemplateRef } from '@angular/core';

@Directive({
  selector: 'ng-template[appTabPanel]',
})
export class TabPanelTemplateDirective {
  readonly template = inject<TemplateRef<unknown>>(TemplateRef);

  readonly appTabPanel = input.required<string>();
}
