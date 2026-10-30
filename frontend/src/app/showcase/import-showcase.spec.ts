import { TestBed } from '@angular/core/testing';
import { ImportShowcaseComponent, parseCsv } from './import-showcase';

describe('Import showcase', () => {
  it('reads quoted CSV values and rejects unclosed quotes', () => {
    expect(parseCsv('Name;E-Mail\n"Weber; Mira";mira@example.test')).toEqual([
      ['Name', 'E-Mail'],
      ['Weber; Mira', 'mira@example.test'],
    ]);
    expect(() => parseCsv('Name,E-Mail\n"Mira,mira@example.test')).toThrow();
  });

  it('starts a demo with selectable valid rows and disables incomplete rows', async () => {
    const fixture = TestBed.createComponent(ImportShowcaseComponent);
    fixture.detectChanges();
    const buttons = Array.from(
      fixture.nativeElement.querySelectorAll('button'),
    ) as HTMLButtonElement[];
    buttons.find((button) => button.textContent?.includes('Mit Beispieldaten starten'))?.click();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const checkboxes = Array.from(
      fixture.nativeElement.querySelectorAll('input[type=checkbox]'),
    ) as HTMLInputElement[];
    expect(checkboxes.length).toBe(3);
    expect(checkboxes.filter((checkbox) => checkbox.disabled).length).toBe(1);
  });
});
