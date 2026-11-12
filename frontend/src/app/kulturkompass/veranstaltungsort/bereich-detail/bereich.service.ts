import { inject, Service, signal } from '@angular/core';
import { GuiRow } from '../../daten/gui-modelle';
import { KulturkompassDatenService } from '../../daten/kulturkompass-daten.service';
import { BereichZusatzdatum } from './bereich-detail';

@Service({ autoProvided: false })
export class BereichService {
  private readonly daten = inject(KulturkompassDatenService);
  readonly datenbestand = signal<Record<string, BereichZusatzdatum[]>>(
    structuredClone(this.daten.bereichZusatzdaten),
  );
  readonly zusatzdaten = signal<BereichZusatzdatum[]>([]);
  private nummer: string | undefined;

  prepare(row: GuiRow | null): void {
    this.nummer = row?.['bereichnummer'];
    this.zusatzdaten.set(
      (this.datenbestand()[this.nummer ?? ''] ?? []).map((entry) => ({ ...entry })),
    );
  }

  accept(): void {
    const nummer = this.nummer;
    if (!nummer) return;
    this.datenbestand.update((data) => ({
      ...data,
      [nummer]: this.zusatzdaten().map((entry) => ({ ...entry })),
    }));
  }
}
