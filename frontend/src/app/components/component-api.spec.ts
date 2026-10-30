import { componentApis } from './component-api';
import { componentSources } from './component-source';

describe('Component API documentation', () => {
  it('documents every component page and its import', () => {
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
      expect(componentApis[slug].importCode).toContain('import {');
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
});
