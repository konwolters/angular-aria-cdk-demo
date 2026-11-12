import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from '../app.routes';

describe('Kulturkompass-Routing', () => {
  it('öffnet Direktlinks und meldet unbekannte Datensätze', async () => {
    TestBed.configureTestingModule({ providers: [provideRouter(routes)] });
    const harness = await RouterTestingHarness.create();

    await harness.navigateByUrl('/gui/veranstaltungsorte');
    const exportButton = Array.from(harness.routeNativeElement!.querySelectorAll('button')).find(
      (button) => button.textContent?.trim() === 'CSV exportieren',
    );
    expect(exportButton?.disabled).toBe(true);
    const searchInput = harness.routeNativeElement!.querySelector('input') as HTMLInputElement;
    searchInput.value = 'Sonnenhof';
    searchInput.dispatchEvent(new Event('input'));
    harness.detectChanges();
    const search = Array.from(harness.routeNativeElement!.querySelectorAll('button')).find(
      (button) => button.textContent?.trim() === 'Suchen',
    );
    expect(search).toBeDefined();
    search!.click();
    await harness.fixture.whenStable();
    harness.detectChanges();
    expect(harness.routeNativeElement?.textContent).toContain('Kulturhaus Sonnenhof');
    expect(harness.routeNativeElement?.textContent).not.toContain('Forum Lindenpark');
    const create = Array.from(harness.routeNativeElement!.querySelectorAll('button')).find(
      (button) => button.textContent?.trim() === 'Veranstaltungsort anlegen',
    );
    expect(create).toBeDefined();
    create!.click();
    await harness.fixture.whenStable();
    harness.detectChanges();
    expect(harness.routeNativeElement?.textContent).toContain('Änderungsumfang: Veranstaltungsort');

    await harness.navigateByUrl('/gui/veranstaltungsorte/100001?tab=bereichs');
    expect(harness.routeNativeElement?.textContent).toContain('Kulturhaus Sonnenhof');

    await harness.navigateByUrl('/gui/staging/E-2026-0042');
    expect(harness.routeNativeElement?.textContent).toContain('E-2026-0042');

    const edit = Array.from(harness.routeNativeElement!.querySelectorAll('button')).find(
      (button) => button.textContent?.trim() === 'Bearbeiten',
    );
    expect(edit).toBeDefined();
    edit!.click();
    await harness.fixture.whenStable();
    harness.detectChanges();
    expect(harness.routeNativeElement?.textContent).toContain('Änderungsumfang: Angebote');

    await harness.navigateByUrl('/gui/veranstaltungsorte/neu');
    expect(harness.routeNativeElement?.textContent).toContain('Veranstaltungsort anlegen');

    await harness.navigateByUrl('/gui/veranstaltungsorte/unbekannt');
    expect(harness.routeNativeElement?.textContent).toContain('Veranstaltungsort nicht gefunden.');

    await harness.navigateByUrl('/gui/staging/unbekannt');
    expect(harness.routeNativeElement?.textContent).toContain('Antrag nicht gefunden.');

    await harness.navigateByUrl('/gui/angebot');
    expect(harness.routeNativeElement?.textContent).toContain('Angebotssuche');
    expect(harness.routeNativeElement?.textContent).toContain('Angebotsmerkmale');

    await harness.navigateByUrl('/gui/staging');
    expect(harness.routeNativeElement?.textContent).toContain('Staging & Freigaben');
    expect(harness.routeNativeElement?.textContent).toContain('Änderungsumfang');
  });
});
