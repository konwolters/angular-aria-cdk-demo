import { componentApis } from './component-api';
import { componentSources } from './component-source';
import { reflectComponentType, Type } from '@angular/core';
import { ButtonComponent } from '../shared/button/button';
import { TextFieldComponent } from '../shared/text-field/text-field';
import { TextareaComponent } from '../shared/textarea/textarea';
import { SelectComponent } from '../shared/select/select';
import { MultiSelectComponent } from '../shared/multi-select/multi-select';
import { TabsComponent } from '../shared/tabs/tabs';
import { StepperComponent } from '../shared/stepper/stepper';
import { FilePickerComponent } from '../shared/file-picker/file-picker';
import { DataTableToolbarComponent } from '../shared/data-table-toolbar/data-table-toolbar';
import { DataTableComponent } from '../shared/data-table/data-table';
import { InlineMessageComponent } from '../shared/inline-message/inline-message';
import { DiffViewComponent } from '../shared/diff-view/diff-view';
import { SideDrawerComponent } from '../shared/side-drawer/side-drawer';
import { ModalComponent } from '../shared/modal/modal';
import { ToastOutletComponent } from '../shared/toast/toast';

describe('Component API documentation', () => {
  it('documents every component page and its source files', () => {
    const slugs = [
      'button',
      'text-field',
      'textarea',
      'select',
      'multi-select',
      'tabs',
      'stepper',
      'file-picker',
      'data-table-toolbar',
      'data-table',
      'data-table-combined',
      'inline-message',
      'diff-view',
      'side-drawer',
      'modal',
      'toast',
    ];
    expect(Object.keys(componentApis).sort()).toEqual(slugs.sort());
    expect(Object.keys(componentSources).sort()).toEqual(slugs.sort());
    for (const slug of slugs) {
      expect(componentSources[slug].length).toBeGreaterThan(0);
      expect(componentSources[slug].every((path) => !path.includes('..'))).toBe(true);
      expect(
        (componentApis[slug].inputs?.length ?? 0) + (componentApis[slug].methods?.length ?? 0),
      ).toBeGreaterThan(0);
    }
  });

  it('documents model changes and projected table templates', () => {
    expect(componentApis['text-field'].inputs?.map((item) => item.name)).toContain('initialValue');
    expect(componentApis['text-field'].outputs?.map((item) => item.name)).toContain('valueChange');
    expect(componentApis['data-table'].slots?.map((item) => item.name)).toContain(
      'ng-template[appDataTableCell]',
    );
  });

  it('matches the public Angular inputs and outputs of each component', () => {
    const components: Record<string, Type<unknown>> = {
      button: ButtonComponent,
      'text-field': TextFieldComponent,
      textarea: TextareaComponent,
      select: SelectComponent,
      'multi-select': MultiSelectComponent,
      tabs: TabsComponent,
      stepper: StepperComponent,
      'file-picker': FilePickerComponent,
      'data-table-toolbar': DataTableToolbarComponent,
      'data-table': DataTableComponent,
      'inline-message': InlineMessageComponent,
      'diff-view': DiffViewComponent,
      'side-drawer': SideDrawerComponent,
      modal: ModalComponent,
      toast: ToastOutletComponent,
    };
    for (const [slug, component] of Object.entries(components)) {
      const metadata = reflectComponentType(component)!;
      expect((componentApis[slug].inputs ?? []).map((item) => item.name).sort(), slug).toEqual(
        metadata.inputs.map((item) => item.templateName).sort(),
      );
      expect((componentApis[slug].outputs ?? []).map((item) => item.name).sort(), slug).toEqual(
        metadata.outputs.map((item) => item.templateName).sort(),
      );
    }
  });
});
