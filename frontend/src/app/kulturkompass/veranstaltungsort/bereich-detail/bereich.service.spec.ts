import { TestBed } from '@angular/core/testing';
import { BereichService } from './bereich.service';
import { KulturkompassDatenService } from '../../daten/kulturkompass-daten.service';

describe('BereichService', () => {
  it('übernimmt Bereichszusatzdaten erst nach Bestätigung', () => {
    TestBed.configureTestingModule({ providers: [BereichService, KulturkompassDatenService] });
    const bereich = TestBed.inject(BereichService);

    const original = bereich.datenbestand()['10010001'][0].wert;
    bereich.prepare({ bereichnummer: '10010001' });
    bereich.zusatzdaten.update((rows) =>
      rows.map((row, index) => (index ? row : { ...row, wert: 'Neu' })),
    );
    expect(bereich.datenbestand()['10010001'][0].wert).toBe(original);
    bereich.accept();
    expect(bereich.datenbestand()['10010001'][0].wert).toBe('Neu');
  });
});
