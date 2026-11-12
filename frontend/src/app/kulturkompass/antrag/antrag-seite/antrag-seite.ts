import { VeranstaltungsortService } from '../../veranstaltungsort/veranstaltungsort.service';
import { GUI_STATUSES } from '../../daten/gui-status';
import { GuiDialogService } from '../../daten/gui-dialog.service';
import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { SucheService } from '../../suche/suche.service';
import { RouterLink } from '@angular/router';
import { StagingService } from '../staging.service';
import { REQUEST_BEREICH_COLUMNS, REQUEST_ANGEBOT_COLUMNS } from '../../daten/gui-spalten';
import { ButtonComponent } from '../../../shared/button/button';
import { AntragVergleich } from '../antrag-vergleich/antrag-vergleich';
import { antragDiff } from '../antrag-diff';
import { GuiRow } from '../../daten/gui-modelle';

@Component({
  selector: 'app-antrag-seite',
  imports: [AntragVergleich, ButtonComponent, RouterLink],
  templateUrl: './antrag-seite.html',
})
export class AntragSeite {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly suche = inject(SucheService);
  protected readonly routeError = signal('');
  protected readonly dialog = inject(GuiDialogService);
  protected readonly state = inject(StagingService);
  protected readonly request = this.state.request;
  protected readonly customer = this.state.customer;
  protected readonly comparison = () => this.state.comparison;
  protected readonly tabs = this.state.tabs;
  protected readonly selectedTab = this.state.requestTab;
  protected readonly statuses = () => GUI_STATUSES;
  protected readonly bereichs = this.state.bereichs;
  protected readonly bereichColumns = () => REQUEST_BEREICH_COLUMNS;
  protected readonly angebot = this.state.angebot;
  protected readonly angebotColumns = () => REQUEST_ANGEBOT_COLUMNS;
  private readonly detail = inject(VeranstaltungsortService);
  constructor() {
    this.route.paramMap.pipe(takeUntilDestroyed()).subscribe((params) => {
      const id = params.get('id');
      const request = this.state.findById(id);
      this.suche.page.set('antrag');
      this.detail.editing.set(false);
      this.state.request.set(request);
      this.routeError.set(request ? '' : 'Antrag nicht gefunden.');
      this.state.requestTab.set(request?.['bereich'] === 'Angebote' ? 'angebot' : 'stammdaten');
    });
  }
  protected showRequestDiff(kind: 'angebot' | 'bereich', row: GuiRow): void {
    this.dialog.openDiff(
      kind === 'bereich' ? 'Bereich-Detail' : 'Angebotsdetail',
      antragDiff(kind, row),
    );
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
