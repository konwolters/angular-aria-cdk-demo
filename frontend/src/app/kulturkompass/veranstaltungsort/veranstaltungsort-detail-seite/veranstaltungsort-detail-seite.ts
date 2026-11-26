import { KulturkompassDatenService } from '../../daten/kulturkompass-daten.service';
import { GUI_STATUSES } from '../../daten/gui-status';
import { AngebotDetail } from '../../angebot/angebot-detail/angebot-detail';
import { BereichDetail } from '../bereich-detail/bereich-detail';
import { BereichService } from '../bereich-detail/bereich.service';
import { GuiRow } from '../../daten/gui-modelle';
import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { RouterLink } from '@angular/router';
import { VeranstaltungsortService } from '../veranstaltungsort.service';
import { GuiSessionService } from '../../daten/gui-session.service';
import { ReferenzdatenService } from '../../referenzdaten/referenzdaten.service';
import { BEREICH_COLUMNS, DETAIL_ANGEBOT_COLUMNS, HISTORY_COLUMNS } from '../../daten/gui-spalten';
import { ButtonComponent } from '../../../shared/button/button';
import { ModalComponent } from '../../../shared/modal/modal';
import { SideDrawerComponent } from '../../../shared/side-drawer/side-drawer';
import { VeranstaltungsortDetailTabs } from '../veranstaltungsort-detail-tabs/veranstaltungsort-detail-tabs';

type DetailDrawer = {
  kind: 'angebot' | 'bereich';
  title: string;
  row: GuiRow | null;
  editing: boolean;
};

@Component({
  selector: 'app-veranstaltungsort-detail-seite',
  imports: [
    AngebotDetail,
    BereichDetail,
    ButtonComponent,
    ModalComponent,
    RouterLink,
    SideDrawerComponent,
    VeranstaltungsortDetailTabs,
  ],
  templateUrl: './veranstaltungsort-detail-seite.html',
})
export class VeranstaltungsortDetailSeite {
  private readonly bereichService = inject(BereichService);
  private readonly kulturkompassDatenService = inject(KulturkompassDatenService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  protected readonly veranstaltungsortService = inject(VeranstaltungsortService);
  private readonly guiSessionService = inject(GuiSessionService);
  private readonly referenzdatenService = inject(ReferenzdatenService);

  protected readonly routeError = signal('');
  protected readonly drawer = signal<DetailDrawer | null>(null);
  protected readonly drawerOpen = signal(false);
  protected readonly submitDialogOpen = signal(false);
  protected readonly tabs = this.veranstaltungsortService.tabs;
  protected readonly selected = this.veranstaltungsortService.selected;
  protected readonly historical = this.veranstaltungsortService.historical;
  protected readonly editing = this.veranstaltungsortService.editing;
  protected readonly editScope = this.veranstaltungsortService.editScope;
  protected readonly activeTab = this.veranstaltungsortService.activeTab;
  protected readonly name = this.veranstaltungsortService.name;
  protected readonly customerNumber = this.guiSessionService.customerNumber;
  protected readonly status = this.guiSessionService.status;
  protected readonly bereichFilter = this.veranstaltungsortService.bereichFilter;
  protected readonly bereichStatus = this.veranstaltungsortService.bereichStatus;
  protected readonly statuses = () => GUI_STATUSES;
  protected readonly bereichs = this.veranstaltungsortService.filteredBereichs;
  protected readonly totalBereichs = () => this.veranstaltungsortService.bereichs().length;
  protected readonly bereichColumns = () => BEREICH_COLUMNS;
  protected readonly zusatzdaten = this.bereichService.datenbestand;
  protected readonly zusatzdatenEntwurf = this.bereichService.zusatzdaten;
  protected readonly zusatzarten = () => this.referenzdatenService.zusatzarten;
  protected readonly bereichOptions = this.veranstaltungsortService.bereichOptions;
  protected readonly angebot = this.veranstaltungsortService.angebot;
  protected readonly totalAngebot = this.veranstaltungsortService.totalAngebot;
  protected readonly angebotColumns = () => DETAIL_ANGEBOT_COLUMNS;
  protected readonly historyRows = () => this.kulturkompassDatenService.historie;
  protected readonly historyColumns = () => HISTORY_COLUMNS;

  constructor() {
    combineLatest([this.route.paramMap, this.route.queryParamMap])
      .pipe(takeUntilDestroyed())
      .subscribe(([params, query]) => {
        const id = params.get('id');
        this.veranstaltungsortService.historical.set(null);
        this.routeError.set('');

        if (id === 'neu') {
          this.veranstaltungsortService.selected.set(null);
          this.veranstaltungsortService.name.set('');
          this.guiSessionService.customerNumber.set('');
          this.veranstaltungsortService.editScope.set('veranstaltungsort');
          this.veranstaltungsortService.editing.set(true);
        } else {
          const ort = this.veranstaltungsortService.findByNumber(id);
          this.veranstaltungsortService.selected.set(ort);

          if (!ort) this.routeError.set('Veranstaltungsort nicht gefunden.');

          const scope = this.router.currentNavigation()?.extras.state?.['editScope'];

          if (ort && (scope === 'angebot' || scope === 'veranstaltungsort')) {
            this.veranstaltungsortService.beginEditing(scope);
          } else {
            this.veranstaltungsortService.editing.set(false);
          }
        }

        const tab = query.get('tab');

        if (tab === 'stammdaten' || tab === 'bereichs' || tab === 'angebot' || tab === 'historie')
          this.veranstaltungsortService.activeTab.set(tab);
      });
  }

  protected showDetails(kind: 'angebot' | 'bereich', row: GuiRow): void {
    if (kind === 'bereich') this.bereichService.prepare(row);

    const title = kind === 'angebot' ? 'Angebotsdetail' : 'Bereich-Detail';
    this.drawer.set({ kind, title, row, editing: false });
    this.drawerOpen.set(true);
  }

  protected openEditor(kind: 'angebot' | 'bereich', row: GuiRow | null): void {
    if (kind === 'bereich') this.bereichService.prepare(row);

    const value =
      kind === 'angebot' && !row && this.veranstaltungsortService.bereichFilter() !== 'alle'
        ? { bereichnummer: this.veranstaltungsortService.bereichFilter() }
        : row;
    const subject = kind === 'angebot' ? 'Angebote' : 'Bereich';
    const title = `${subject} ${row ? 'bearbeiten' : 'hinzufügen'}`;
    this.drawer.set({ kind, title, row: value, editing: true });
    this.drawerOpen.set(true);
  }

  protected acceptBereich(): void {
    this.bereichService.accept();
    this.drawerOpen.set(false);
  }
}
