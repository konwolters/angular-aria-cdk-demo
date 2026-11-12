import { TestBed } from '@angular/core/testing';
import { VeranstaltungsortStammdaten } from './veranstaltungsort-stammdaten';

describe('VeranstaltungsortStammdaten', () => {
  it('behält lokale Eingaben und gibt Name und Standortnummer weiter', () => {
    const fixture = TestBed.createComponent(VeranstaltungsortStammdaten);
    fixture.componentRef.setInput('editing', true);
    fixture.componentRef.setInput('statuses', []);
    fixture.componentRef.setInput('selected', { alertId: 'ALT' });
    fixture.detectChanges();
    const inputs = fixture.nativeElement.querySelectorAll('input') as NodeListOf<HTMLInputElement>;
    inputs[2].value = 'NEU';
    inputs[2].dispatchEvent(new Event('input'));
    fixture.detectChanges();
    inputs[0].value = 'Sonnenhof';
    inputs[0].dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(fixture.componentInstance.name()).toBe('Sonnenhof');
    expect(inputs[2].value).toBe('NEU');
  });
});
