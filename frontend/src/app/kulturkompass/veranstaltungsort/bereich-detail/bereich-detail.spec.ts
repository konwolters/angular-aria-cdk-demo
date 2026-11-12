import { TestBed } from '@angular/core/testing';
import { BereichDetail } from './bereich-detail';

describe('BereichDetail', () => {
  it('übernimmt Änderungen an dynamischen Zusatzdaten in das bestehende Modell', () => {
    const fixture = TestBed.createComponent(BereichDetail);
    fixture.componentRef.setInput('editing', true);
    fixture.componentRef.setInput('statuses', []);
    fixture.componentRef.setInput('zusatzarten', []);
    fixture.componentRef.setInput('zusatzdaten', [
      { id: 1, art: 'KONTAKT', wert: 'Alt', beschreibung: '' },
    ]);
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector(
      'tbody tr td:nth-child(2) input',
    ) as HTMLInputElement;
    expect(input).not.toBeNull();
    input.value = 'Neu';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(fixture.componentInstance.zusatzdaten()[0].wert).toBe('Neu');
  });
});
