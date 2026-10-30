import { TestBed } from '@angular/core/testing';
import { DiffViewComponent } from './diff-view';

describe('DiffViewComponent', () => {
  it('distinguishes empty, added, removed and overridden values and escapes text', () => {
    const fixture = TestBed.createComponent(DiffViewComponent);
    fixture.componentRef.setInput('entries', [
      { key: 'empty', label: 'Leer', before: '', after: 'Wert' },
      { key: 'new', label: 'Neu', before: null, after: '<script>bad</script>' },
      { key: 'removed', label: 'Entfernt', before: 'alt', after: null },
      { key: 'same', label: 'Gleich', before: 'A', after: 'B', changed: false },
    ]);
    fixture.detectChanges();
    const rows = [...fixture.nativeElement.querySelectorAll('tbody tr')] as HTMLTableRowElement[];
    expect(rows.map((row) => row.cells[3].textContent?.trim())).toEqual([
      'Geändert',
      'Neu',
      'Entfernt',
      'Unverändert',
    ]);
    expect(rows[0].cells[1].textContent).toBe('');
    expect(fixture.nativeElement.querySelector('script')).toBeNull();
  });
});
