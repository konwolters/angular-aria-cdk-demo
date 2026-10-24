import { Directive, inject, input, TemplateRef } from '@angular/core';

@Directive({
  selector: 'ng-template[appTabPanel]',
})
export class TabPanelTemplateDirective {
  readonly appTabPanel = input.required<string>();
  readonly template = inject<TemplateRef<unknown>>(TemplateRef);
}
