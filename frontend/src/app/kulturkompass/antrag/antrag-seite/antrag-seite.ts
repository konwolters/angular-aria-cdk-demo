import { VeranstaltungsortService } from '../../veranstaltungsort/veranstaltungsort.service';
import { GUI_STATUSES } from '../../daten/gui-status';
import { Component, inject, signal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { StagingService } from '../staging.service';
import { REQUEST_BEREICH_COLUMNS, REQUEST_ANGEBOT_COLUMNS } from '../../daten/gui-spalten';
import { ButtonComponent } from '../../../shared/button/button';
import { DiffEntry, DiffViewComponent } from '../../../shared/diff-view/diff-view';
import { ModalComponent } from '../../../shared/modal/modal';
import { SideDrawerComponent } from '../../../shared/side-drawer/side-drawer';
import { TextareaComponent } from '../../../shared/textarea/textarea';
import { AntragVergleich } from '../antrag-vergleich/antrag-vergleich';
import { antragDiff } from '../antrag-diff';
import { GuiRow } from '../../daten/gui-modelle';

@Component({
  selector: 'app-antrag-seite',
  imports: [
    AntragVergleich,
    ButtonComponent,
    DiffViewComponent,
    FormField,
    ModalComponent,
    RouterLink,
    SideDrawerComponent,
    TextareaComponent,
  ],
  templateUrl: './antrag-seite.html',
})
export class AntragSeite {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly stagingService = inject(StagingService);
  private readonly veranstaltungsortService = inject(VeranstaltungsortService);

  protected readonly routeError = signal('');
  protected readonly diffOpen = signal(false);
  protected readonly diff = signal<{ title: string; entries: DiffEntry[] }>({
    title: '',
    entries: [],
  });
  protected readonly actionDialogOpen = signal(false);
  protected readonly actionTitle = signal('');
  private readonly note = signal('');
  protected readonly noteForm = form(this.note);
  protected readonly request = this.stagingService.request;
  protected readonly customer = this.stagingService.customer;
  protected readonly comparison = () => this.stagingService.comparison;
  protected readonly tabs = this.stagingService.tabs;
  protected readonly selectedTab = this.stagingService.requestTab;
  protected readonly statuses = () => GUI_STATUSES;
  protected readonly bereichs = this.stagingService.bereichs;
  protected readonly bereichColumns = () => REQUEST_BEREICH_COLUMNS;
  protected readonly angebot = this.stagingService.angebot;
  protected readonly angebotColumns = () => REQUEST_ANGEBOT_COLUMNS;

  constructor() {
    this.route.paramMap.pipe(takeUntilDestroyed()).subscribe((params) => {
      const id = params.get('id');
      const request = this.stagingService.findById(id);
      this.veranstaltungsortService.editing.set(false);
      this.stagingService.request.set(request);
      this.routeError.set(request ? '' : 'Antrag nicht gefunden.');
      this.stagingService.requestTab.set(
        request?.['bereich'] === 'Angebote' ? 'angebot' : 'stammdaten',
      );
    });
  }

  protected showRequestDiff(kind: 'angebot' | 'bereich', row: GuiRow): void {
    this.diff.set({
      title: kind === 'bereich' ? 'Bereich-Detail' : 'Angebotsdetail',
      entries: antragDiff(kind, row),
    });
    this.diffOpen.set(true);
  }

  protected openActionDialog(title: string): void {
    this.actionTitle.set(title);
    this.actionDialogOpen.set(true);
  }

  protected editRequest(): void {
    const scope = this.request()?.['bereich'] === 'Angebote' ? 'angebot' : 'veranstaltungsort';
    const ort = this.customer();

    if (!ort) return;

    void this.router.navigate(['/gui/veranstaltungsorte', ort['kundennummer']], {
      queryParams: { tab: scope === 'angebot' ? 'angebot' : 'stammdaten' },
      state: { editScope: scope },
    });
  }
}
