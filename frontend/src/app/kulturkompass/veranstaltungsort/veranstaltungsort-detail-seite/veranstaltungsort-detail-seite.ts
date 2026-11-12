import { KulturkompassDatenService } from '../../daten/kulturkompass-daten.service';
import { GUI_STATUSES } from '../../daten/gui-status';
import { GuiDialogService } from '../../daten/gui-dialog.service';
import { BereichService } from '../bereich-detail/bereich.service';
import { GuiRow } from '../../daten/gui-modelle';
import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { SucheService } from '../../suche/suche.service';
import { RouterLink } from '@angular/router';
import { VeranstaltungsortService } from '../veranstaltungsort.service';
import { GuiSessionService } from '../../daten/gui-session.service';
import { ReferenzdatenService } from '../../referenzdaten/referenzdaten.service';
import { BEREICH_COLUMNS, DETAIL_ANGEBOT_COLUMNS, HISTORY_COLUMNS } from '../../daten/gui-spalten';
import { ButtonComponent } from '../../../shared/button/button';
import { VeranstaltungsortDetailTabs } from '../veranstaltungsort-detail-tabs/veranstaltungsort-detail-tabs';

@Component({
  selector: 'app-veranstaltungsort-detail-seite',
  imports: [ButtonComponent, VeranstaltungsortDetailTabs, RouterLink],
  templateUrl: './veranstaltungsort-detail-seite.html',
})
export class VeranstaltungsortDetailSeite {
  private readonly bereich = inject(BereichService);
  private readonly daten = inject(KulturkompassDatenService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly suche = inject(SucheService);
  protected readonly routeError = signal('');
  protected readonly dialog = inject(GuiDialogService);
  protected readonly state = inject(VeranstaltungsortService);
  protected readonly session = inject(GuiSessionService);
  protected readonly references = inject(ReferenzdatenService);
  protected readonly tabs = this.state.tabs;
  protected readonly selected = this.state.selected;
  protected readonly historical = this.state.historical;
  protected readonly editing = this.state.editing;
  protected readonly editScope = this.state.editScope;
  protected readonly activeTab = this.state.activeTab;
  protected readonly name = this.state.name;
  protected readonly customerNumber = this.session.customerNumber;
  protected readonly status = this.session.status;
  protected readonly bereichFilter = this.state.bereichFilter;
  protected readonly bereichStatus = this.state.bereichStatus;
  protected readonly statuses = () => GUI_STATUSES;
  protected readonly bereichs = this.state.filteredBereichs;
  protected readonly totalBereichs = () => this.state.bereichs().length;
  protected readonly bereichColumns = () => BEREICH_COLUMNS;
  protected readonly zusatzdaten = this.bereich.datenbestand;
  protected readonly zusatzarten = () => this.references.zusatzarten;
  protected readonly bereichOptions = this.state.bereichOptions;
  protected readonly angebot = this.state.angebot;
  protected readonly totalAngebot = this.state.totalAngebot;
  protected readonly angebotColumns = () => DETAIL_ANGEBOT_COLUMNS;
  protected readonly historyRows = () => this.daten.historie;
  protected readonly historyColumns = () => HISTORY_COLUMNS;
  constructor() {
    combineLatest([this.route.paramMap, this.route.queryParamMap])
      .pipe(takeUntilDestroyed())
      .subscribe(([params, query]) => {
        const id = params.get('id');
        this.suche.page.set('detail');
        this.state.historical.set(null);
        this.routeError.set('');
        if (id === 'neu') {
          this.state.selected.set(null);
          this.state.name.set('');
          this.session.customerNumber.set('');
          this.state.editScope.set('veranstaltungsort');
          this.state.editing.set(true);
        } else {
          const ort = this.state.findByNumber(id);
          this.state.selected.set(ort);
          if (!ort) this.routeError.set('Veranstaltungsort nicht gefunden.');
          const scope = this.router.currentNavigation()?.extras.state?.['editScope'];
          if (ort && (scope === 'angebot' || scope === 'veranstaltungsort'))
            this.state.beginEditing(scope);
          else this.state.editing.set(false);
        }
        const tab = query.get('tab');
        if (tab === 'stammdaten' || tab === 'bereichs' || tab === 'angebot' || tab === 'historie')
          this.state.activeTab.set(tab);
      });
  }
  protected showDetails(kind: 'angebot' | 'bereich', row: GuiRow): void {
    if (kind === 'bereich') this.bereich.prepare(row);
    this.dialog.openDrawer(
      kind,
      kind === 'angebot' ? 'Angebotsdetail' : 'Bereich-Detail',
      row,
      false,
    );
  }
  protected openEditor(kind: 'angebot' | 'bereich', row: GuiRow | null): void {
    if (kind === 'bereich') this.bereich.prepare(row);
    const value =
      kind === 'angebot' && !row && this.state.bereichFilter() !== 'alle'
        ? { bereichnummer: this.state.bereichFilter() }
        : row;
    const subject = kind === 'angebot' ? 'Angebote' : 'Bereich';
    this.dialog.openDrawer(kind, `${subject} ${row ? 'bearbeiten' : 'hinzufügen'}`, value, true);
  }
}
