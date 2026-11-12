import { KulturkompassDatenService } from './daten/kulturkompass-daten.service';
import { Component, computed, inject } from '@angular/core';
import { FormField } from '@angular/forms/signals';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
import { ButtonComponent } from '../shared/button/button';
import { DiffViewComponent } from '../shared/diff-view/diff-view';
import { ModalComponent } from '../shared/modal/modal';
import { SelectComponent } from '../shared/select/select';
import { SideDrawerComponent } from '../shared/side-drawer/side-drawer';
import { TextFieldComponent } from '../shared/text-field/text-field';
import { TextareaComponent } from '../shared/textarea/textarea';
import { AngebotDetail } from './angebot/angebot-detail/angebot-detail';
import { BereichDetail } from './veranstaltungsort/bereich-detail/bereich-detail';
import { BereichService } from './veranstaltungsort/bereich-detail/bereich.service';
import { GuiLayout } from './layout/gui-layout/gui-layout';
import { GuiSessionService } from './daten/gui-session.service';
import { GuiDialogService } from './daten/gui-dialog.service';
import { GUI_STATUSES } from './daten/gui-status';
import { GuiPage } from './daten/gui-modelle';
import { GuiPaginationService } from './gui-pagination.service';
import { SucheService } from './suche/suche.service';
import { VeranstaltungsortService } from './veranstaltungsort/veranstaltungsort.service';
import { ImportService } from './import/import.service';
import { StagingService } from './antrag/staging.service';
import { ReferenzdatenService } from './referenzdaten/referenzdaten.service';

type Page = GuiPage;
@Component({
  selector: 'app-kulturkompass',
  providers: [
    KulturkompassDatenService,
    GuiSessionService,
    SucheService,
    VeranstaltungsortService,
    ImportService,
    StagingService,
    ReferenzdatenService,
    GuiDialogService,
    BereichService,
    GuiPaginationService,
  ],
  imports: [
    ButtonComponent,
    FormField,
    AngebotDetail,
    BereichDetail,
    GuiLayout,
    RouterOutlet,
    DiffViewComponent,
    ModalComponent,
    SelectComponent,
    SideDrawerComponent,
    TextFieldComponent,
    TextareaComponent,
  ],
  templateUrl: './kulturkompass.html',
})
export class Kulturkompass {
  protected readonly dialog = inject(GuiDialogService);
  protected readonly bereich = inject(BereichService);
  protected readonly session = inject(GuiSessionService);
  protected readonly suche = inject(SucheService);
  protected readonly detail = inject(VeranstaltungsortService);
  protected readonly referenzdaten = inject(ReferenzdatenService);
  protected readonly statuses = GUI_STATUSES;
  protected acceptDrawer(): void {
    if (this.dialog.drawerKind() === 'bereich') this.bereich.accept();
    this.dialog.drawerOpen.set(false);
  }
  private readonly router = inject(Router);
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
