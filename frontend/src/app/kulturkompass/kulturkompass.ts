import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { form, FormField } from '@angular/forms/signals';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs';
import { ButtonComponent } from '../shared/button/button';
import { ModalComponent } from '../shared/modal/modal';
import { SelectComponent } from '../shared/select/select';
import { StagingService } from './antrag/staging.service';
import { GuiPage } from './daten/gui-modelle';
import { GuiSessionService } from './daten/gui-session.service';
import { KulturkompassDatenService } from './daten/kulturkompass-daten.service';
import { ImportService } from './import/import.service';
import { ReferenzdatenService } from './referenzdaten/referenzdaten.service';
import { BereichService } from './veranstaltungsort/bereich-detail/bereich.service';
import { VeranstaltungsortService } from './veranstaltungsort/veranstaltungsort.service';

type Page = GuiPage;
@Component({
  selector: 'app-kulturkompass',
  providers: [
    KulturkompassDatenService,
    GuiSessionService,
    VeranstaltungsortService,
    ImportService,
    StagingService,
    ReferenzdatenService,
    BereichService,
  ],
  imports: [ButtonComponent, FormField, ModalComponent, RouterLink, RouterOutlet, SelectComponent],
  templateUrl: './kulturkompass.html',
})
export class Kulturkompass {
  private readonly router = inject(Router);
  private readonly guiSessionService = inject(GuiSessionService);

  protected readonly roleForm = form(this.guiSessionService.role);
  protected readonly logoutDialogOpen = signal(false);
  protected readonly settingsOpen = signal(false);

  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects),
    ),
    { initialValue: this.router.url },
  );
  protected readonly activeNavigation = computed(() => {
    const segments =
      this.router.parseUrl(this.currentUrl()).root.children['primary']?.segments ?? [];
    return segments[1]?.path || 'veranstaltungsorte';
  });
  protected readonly navigation: { id: Page; label: string; description: string }[] = [
    {
      id: 'veranstaltungsorte',
      label: 'Veranstaltungsorte',
      description: 'Veranstaltungsorte und ihre Bereiche suchen und bearbeiten.',
    },
    {
      id: 'angebot',
      label: 'Angebotssuche',
      description: 'Veranstaltungsangebote anhand ihrer Merkmale suchen.',
    },
    {
      id: 'import',
      label: 'Import',
      description: 'CSV-Dateien prüfen und Änderungen vorbereiten.',
    },
    {
      id: 'staging',
      label: 'Staging & Freigaben',
      description: 'Änderungsanträge ansehen und zur Freigabe prüfen.',
    },
    {
      id: 'referenzdaten',
      label: 'Referenzdaten',
      description: 'Länder, Veranstaltungsarten und weitere Verzeichnisse anzeigen.',
    },
  ];
  protected readonly roles = [
    { value: 'leser', label: 'Leser' },
    { value: 'bearbeiter', label: 'Fachlicher Bearbeiter' },
    { value: 'angebot', label: 'Angebotsverwaltung' },
    { value: 'referenz', label: 'Referenzdaten-Manager' },
  ];
}
