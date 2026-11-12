import { Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { AngebotDetailDrawerComponent } from './angebot-detail/angebot-detail-drawer';
import { BereichDetailComponent, BereichZusatzdatum } from './bereich-detail/bereich-detail';
import { GuiLayoutComponent } from './layout/gui-layout';
import { GuiSessionStore } from './daten/gui-session-store';
import { SucheZustand } from './suche/suche-zustand';
import { VeranstaltungsortDetailZustand } from './veranstaltungsorte/veranstaltungsort-detail-zustand';
import { ImportZustand } from './import/import-zustand';
import { StagingZustand } from './staging/staging-zustand';
import { antragDiff } from './staging/antrag-diff';
import { ReferenzdatenZustand } from './referenzdaten/referenzdaten-zustand';
import { DEMO_CUSTOMERS, DEMO_REQUESTS } from './daten/gui-demodaten';
import { GuiPage, GuiRow } from './daten/gui-modelle';
import { GuiPagination } from './gui-pagination';
import { ButtonComponent } from '../shared/button/button';
import { DiffEntry, DiffViewComponent } from '../shared/diff-view/diff-view';
import { ModalComponent } from '../shared/modal/modal';
import { SelectComponent } from '../shared/select/select';
import { SideDrawerComponent } from '../shared/side-drawer/side-drawer';
import { TextFieldComponent } from '../shared/text-field/text-field';
import { TextareaComponent } from '../shared/textarea/textarea';

type Page = GuiPage;
type Row = GuiRow;

@Component({
  selector: 'app-kulturkompass',
  providers: [
    GuiSessionStore,
    SucheZustand,
    VeranstaltungsortDetailZustand,
    ImportZustand,
    StagingZustand,
    ReferenzdatenZustand,
  ],
  imports: [
    ButtonComponent,
    AngebotDetailDrawerComponent,
    BereichDetailComponent,
    GuiLayoutComponent,
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
export class KulturkompassComponent {
  private readonly router = inject(Router);
  private readonly session = inject(GuiSessionStore);
  private readonly suche = inject(SucheZustand);
  private readonly detail = inject(VeranstaltungsortDetailZustand);
  private readonly importState = inject(ImportZustand);
  private readonly staging = inject(StagingZustand);
  private readonly referenzdaten = inject(ReferenzdatenZustand);
  private preserveEditingOnDetailNavigation = false;
  protected readonly pagination = new GuiPagination();
  protected readonly page = this.suche.page;
  protected readonly routeError = signal('');
  protected readonly query = this.suche.query;
  protected readonly appliedQuery = this.suche.appliedQuery;
  protected readonly role = this.session.role;
  protected readonly activeTab = this.detail.activeTab;
  protected readonly requestTab = this.staging.requestTab;
  protected readonly referenceTab = this.referenzdaten.selectedTab;
  protected readonly drawerOpen = signal(false);
  protected readonly modalOpen = signal(false);
  protected readonly modalTitle = signal('');
  protected readonly selected = this.session.selected;
  protected readonly historical = this.detail.historical;
  protected readonly drawerRow = signal<Row | null>(null);
  protected readonly drawerZusatzdaten = signal<BereichZusatzdatum[]>([]);
  protected readonly bereichZusatzdaten = this.session.bereichZusatzdaten;
  protected readonly drawerTitle = signal('Angebotsdetail');
  protected readonly note = signal('');
  protected readonly editing = this.detail.editing;
  protected readonly editScope = this.detail.editScope;
  protected readonly bereichFilter = this.detail.bereichFilter;
  protected readonly bereichStatus = this.detail.bereichStatus;
  protected readonly drawerKind = signal<'angebot' | 'bereich' | 'reference' | 'request-diff'>(
    'angebot',
  );
  protected readonly requestDiff = signal<DiffEntry[]>([]);
  protected readonly drawerEditing = signal(false);
  protected readonly name = this.detail.name;
  protected readonly customerNumber = this.session.customerNumber;

  constructor() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.applyRoute());
    this.applyRoute();
  }

  private applyRoute(): void {
    const tree = this.router.parseUrl(this.router.url);
    const segments = tree.root.children['primary']?.segments.map((segment) => segment.path) ?? [];
    const section = segments[1];
    const id = segments[2];
    this.routeError.set('');
    this.historical.set(null);
    if (section === 'veranstaltungsorte' && id) {
      this.page.set('detail');
      if (id === 'neu') {
        this.selected.set(null);
        this.editing.set(true);
      } else {
        const customer = this.demoCustomers.find((row) => row['kundennummer'] === id) ?? null;
        this.selected.set(customer);
        if (!customer) this.routeError.set('Veranstaltungsort nicht gefunden.');
        if (!this.preserveEditingOnDetailNavigation) this.editing.set(false);
      }
      this.preserveEditingOnDetailNavigation = false;
      const tab = tree.queryParams['tab'];
      if (tab === 'stammdaten' || tab === 'bereichs' || tab === 'angebot' || tab === 'historie')
        this.activeTab.set(tab);
    } else if (section === 'staging' && id) {
      this.editing.set(false);
      this.page.set('antrag');
      const request =
        this.demoRequests.find((row) => row['id'] === id) ??
        this.importState.resultRows.find((row) => row['id'] === id) ??
        null;
      this.selected.set(request);
      if (!request) this.routeError.set('Antrag nicht gefunden.');
      this.requestTab.set(request?.['bereich'] === 'Angebote' ? 'angebot' : 'stammdaten');
    } else {
      this.editing.set(false);
      const pages: Page[] = ['veranstaltungsorte', 'angebot', 'import', 'staging', 'referenzdaten'];
      this.page.set(pages.includes(section as Page) ? (section as Page) : 'veranstaltungsorte');
    }
  }

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
  protected readonly statuses = [
    { value: 'aktiv', label: 'Aktiv' },
    { value: 'inaktiv', label: 'Inaktiv' },
    { value: 'alle', label: 'Alle' },
  ];
  protected readonly referenceTabs = this.referenzdaten.tabs;
  protected readonly demoCustomers = DEMO_CUSTOMERS;
  protected readonly demoRequests = DEMO_REQUESTS;
  protected readonly bereichOptions = this.detail.bereichOptions;
  protected readonly zusatzarten = this.referenzdaten.zusatzarten;
  protected readonly requestCustomer = this.staging.customer;
  protected readonly activeNavigation = computed(() =>
    this.page() === 'detail'
      ? 'veranstaltungsorte'
      : this.page() === 'antrag'
        ? 'staging'
        : this.page(),
  );
  protected navigate(page: Page): void {
    if (page === 'antrag')
      this.requestTab.set(this.selected()?.['bereich'] === 'Angebote' ? 'angebot' : 'stammdaten');
    const path =
      page === 'detail'
        ? ['gui', 'veranstaltungsorte', this.selected()?.['kundennummer'] ?? 'neu']
        : page === 'antrag'
          ? ['gui', 'staging', this.selected()?.['id'] ?? 'unbekannt']
          : ['gui', page];
    void this.router.navigate(
      path,
      page === 'detail' ? { queryParams: { tab: this.activeTab() } } : undefined,
    );
    this.query.set('');
    this.appliedQuery.set('');
    this.editing.set(false);
    this.historical.set(null);
    window.scrollTo({ top: 0 });
  }
  protected openRow(row: Row): void {
    this.selected.set(row);
    if (this.page() === 'staging') this.navigate('antrag');
    else if (this.page() === 'angebot' || this.page() === 'detail') {
      this.drawerRow.set(row);
      this.drawerKind.set('angebot');
      this.drawerEditing.set(false);
      this.drawerTitle.set('Angebotsdetail');
      this.drawerOpen.set(true);
    } else {
      this.activeTab.set('stammdaten');
      this.navigate('detail');
    }
  }
  protected openImportResult(row: Row): void {
    this.selected.set(row);
    this.navigate('antrag');
  }
  protected openCustomer(row: Row, tab: 'stammdaten' | 'bereichs'): void {
    this.selected.set(row);
    this.bereichFilter.set('alle');
    this.bereichStatus.set('aktiv');
    this.activeTab.set(tab);
    this.navigate('detail');
  }
  protected createCustomer(): void {
    this.selected.set(null);
    this.name.set('');
    this.customerNumber.set('');
    this.editScope.set('veranstaltungsort');
    this.activeTab.set('stammdaten');
    this.navigate('detail');
  }
  protected beginEditing(scope: 'veranstaltungsort' | 'angebot'): void {
    this.name.set(this.selected()?.['name'] || '');
    this.customerNumber.set(this.selected()?.['kundennummer'] || '');
    this.editScope.set(scope);
    this.editing.set(true);
    this.activeTab.set(scope === 'angebot' ? 'angebot' : 'stammdaten');
  }
  protected openEditor(kind: 'angebot' | 'bereich' | 'reference', row: Row | null): void {
    this.drawerKind.set(kind);
    this.drawerEditing.set(true);
    if (kind === 'bereich') {
      this.drawerZusatzdaten.set(
        (this.bereichZusatzdaten()[row?.['bereichnummer'] ?? ''] ?? []).map((entry) => ({
          ...entry,
        })),
      );
    }
    this.drawerRow.set(
      kind === 'angebot' && !row && this.bereichFilter() !== 'alle'
        ? { bereichnummer: this.bereichFilter() }
        : row,
    );
    const subject =
      kind === 'angebot'
        ? 'Angebote'
        : kind === 'bereich'
          ? 'Bereich'
          : this.referenceTabs.find((tab) => tab.value === this.referenceTab())?.label ||
            'Referenzwert';
    this.drawerTitle.set(`${subject} ${row ? 'bearbeiten' : 'hinzufügen'}`);
    this.drawerOpen.set(true);
  }
  protected showDetails(kind: 'angebot' | 'bereich', row: Row): void {
    if (kind === 'bereich') {
      this.drawerZusatzdaten.set(
        (this.bereichZusatzdaten()[row['bereichnummer']] ?? []).map((entry) => ({ ...entry })),
      );
    }
    this.drawerRow.set(row);
    this.drawerKind.set(kind);
    this.drawerEditing.set(false);
    this.drawerTitle.set(kind === 'angebot' ? 'Angebotsdetail' : 'Bereich-Detail');
    this.drawerOpen.set(true);
  }

  protected acceptDrawer(): void {
    const bereichnummer = this.drawerRow()?.['bereichnummer'];
    if (this.drawerKind() === 'bereich' && bereichnummer) {
      this.bereichZusatzdaten.update((data) => ({
        ...data,
        [bereichnummer]: this.drawerZusatzdaten().map((entry) => ({ ...entry })),
      }));
    }
    this.drawerOpen.set(false);
  }
  protected showRequestDiff(kind: 'angebot' | 'bereich', row: Row): void {
    this.requestDiff.set(antragDiff(kind, row));
    this.drawerKind.set('request-diff');
    this.drawerEditing.set(false);
    this.drawerTitle.set(kind === 'bereich' ? 'Bereich-Detail' : 'Angebotsdetail');
    this.drawerOpen.set(true);
  }
  protected editRequest(): void {
    const scope = this.selected()?.['bereich'] === 'Angebote' ? 'angebot' : 'veranstaltungsort';
    const customer = this.requestCustomer();
    if (!customer) return;
    this.selected.set(customer);
    this.preserveEditingOnDetailNavigation = true;
    this.navigate('detail');
    this.beginEditing(scope);
  }
  protected openRequest(row: Row): void {
    const request = this.demoRequests.find(
      (item) =>
        item['name'] === row['name'] &&
        item['bereich'] ===
          (this.page() === 'angebot' ? 'Angebote' : 'Veranstaltungsort & Bereiche'),
    );
    if (request) {
      this.selected.set(request);
      this.navigate('antrag');
    }
  }
  protected confirm(title: string): void {
    this.modalTitle.set(title);
    this.modalOpen.set(true);
  }

  readonly pageContext = {
    pagination: this.pagination,
    statuses: this.statuses,
    createCustomer: () => this.createCustomer(),
    openRow: (row: Row) => this.openRow(row),
    openRequest: (row: Row) => this.openRequest(row),
    openCustomer: (row: Row, tab: 'stammdaten' | 'bereichs') => this.openCustomer(row, tab),
    showDetails: (kind: 'angebot' | 'bereich', row: Row) => this.showDetails(kind, row),
    openEditor: (kind: 'angebot' | 'bereich' | 'reference', row: Row | null) =>
      this.openEditor(kind, row),
    beginEditing: (scope: 'veranstaltungsort' | 'angebot') => this.beginEditing(scope),
    confirm: (title: string) => this.confirm(title),
    showRequestDiff: (kind: 'angebot' | 'bereich', row: Row) => this.showRequestDiff(kind, row),
    editRequest: () => this.editRequest(),
    openImportResult: (row: Row) => this.openImportResult(row),
    navigateStaging: () => this.navigate('staging'),
  };
}

export type GuiPageContext = KulturkompassComponent['pageContext'];
