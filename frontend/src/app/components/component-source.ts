/** Paths are relative to src/app/shared and are copied as build assets without transformation. */
export const componentSources: Record<string, readonly string[]> = {
  button: ['button/button.ts', 'button/button.html'],
  'text-field': [
    'text-field/text-field.ts',
    'text-field/text-field.html',
    'field-messages/field-messages.ts',
  ],
  textarea: ['textarea/textarea.ts', 'textarea/textarea.html', 'field-messages/field-messages.ts'],
  select: ['select/select.ts', 'select/select.html', 'field-messages/field-messages.ts'],
  'multi-select': [
    'multi-select/multi-select.ts',
    'multi-select/multi-select.html',
    'field-messages/field-messages.ts',
  ],
  tabs: ['tabs/tabs.ts', 'tabs/tabs.html', 'tabs/tab-panel-template.directive.ts'],
  stepper: ['stepper/stepper.ts'],
  'file-picker': ['file-picker/file-picker.ts'],
  'data-table-toolbar': [
    'data-table-toolbar/data-table-toolbar.ts',
    'data-table-toolbar/data-table-toolbar.html',
  ],
  'data-table': [
    'data-table/data-table.ts',
    'data-table/data-table.html',
    'data-table/data-table-cell.directive.ts',
    'data-table/data-table-header.directive.ts',
  ],
  'data-table-combined': [
    'data-table-toolbar/data-table-toolbar.ts',
    'data-table-toolbar/data-table-toolbar.html',
    'data-table/data-table.ts',
    'data-table/data-table.html',
    'data-table/data-table-cell.directive.ts',
    'data-table/data-table-header.directive.ts',
  ],
  'inline-message': ['inline-message/inline-message.ts'],
  'diff-view': ['diff-view/diff-view.ts'],
  'side-drawer': [
    'side-drawer/side-drawer.ts',
    'side-drawer/side-drawer.html',
    'dialog/dialog-base.ts',
  ],
  modal: ['modal/modal.ts', 'modal/modal.html', 'dialog/dialog-base.ts'],
  toast: ['toast/toast.ts'],
};
