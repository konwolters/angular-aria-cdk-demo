import { Component, computed, inject, signal } from '@angular/core';
import { ButtonComponent } from '../shared/button/button';
import { DataTableCellDirective } from '../shared/data-table/data-table-cell.directive';
import { DataTableColumn, DataTableComponent } from '../shared/data-table/data-table';
import { DataTableToolbarComponent } from '../shared/data-table-toolbar/data-table-toolbar';
import { DiffViewComponent } from '../shared/diff-view/diff-view';
import { FilePickerComponent } from '../shared/file-picker/file-picker';
import { InlineMessageComponent } from '../shared/inline-message/inline-message';
import { ModalComponent } from '../shared/modal/modal';
import { MultiSelectComponent } from '../shared/multi-select/multi-select';
import { SelectComponent } from '../shared/select/select';
import { SideDrawerComponent } from '../shared/side-drawer/side-drawer';
import { StepperComponent } from '../shared/stepper/stepper';
import { TabPanelTemplateDirective } from '../shared/tabs/tab-panel-template.directive';
import { TabsComponent } from '../shared/tabs/tabs';
import { TextFieldComponent } from '../shared/text-field/text-field';
import { TextareaComponent } from '../shared/textarea/textarea';
import { ToastOutletComponent } from '../shared/toast/toast';
import { ToastService } from '../shared/toast/toast.service';

interface ImportRow {
  id: number;
  name: string;
  email: string;
  note: string;
  depot: string;
  teams: string[];
  imported: boolean;
}

// CSV-Felder können Trennzeichen, Zeilenumbrüche und maskierte Anführungszeichen enthalten.
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let quoted = false;
  const firstLine = text.split(/\r?\n/, 1)[0];
  const delimiter = firstLine.includes(';') ? ';' : ',';
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '"') {
      if (quoted && text[i + 1] === '"') {
        field += '"';
        i++;
      } else {
        quoted = !quoted;
      }
    } else if (!quoted && char === delimiter) {
      row.push(field.trim());
      field = '';
    } else if (!quoted && (char === '\n' || char === '\r')) {
      if (char === '\r' && text[i + 1] === '\n') i++;
      row.push(field.trim());
      if (row.some(Boolean)) rows.push(row);
      row = [];
      field = '';
    } else {
      field += char;
    }
  }
  if (quoted) throw new Error('Die CSV-Datei enthält ein nicht geschlossenes Anführungszeichen.');
  row.push(field.trim());
  if (row.some(Boolean)) rows.push(row);
  return rows;
}

@Component({
  selector: 'app-import-showcase',
  imports: [
    ButtonComponent,
    DataTableComponent,
    DataTableCellDirective,
    DataTableToolbarComponent,
    DiffViewComponent,
    FilePickerComponent,
    InlineMessageComponent,
    ModalComponent,
    MultiSelectComponent,
    SelectComponent,
    SideDrawerComponent,
    StepperComponent,
    TabPanelTemplateDirective,
    TabsComponent,
    TextFieldComponent,
    TextareaComponent,
    ToastOutletComponent,
  ],
  templateUrl: './import-showcase.html',
})
export class ImportShowcaseComponent {
  private readonly toast = inject(ToastService);
  private loadVersion = 0;
  protected readonly file = signal<File | null>(null);
  protected readonly stage = signal<'file' | 'review' | 'done'>('file');
  protected readonly rows = signal<ImportRow[]>([]);
  protected readonly selected = signal<number[]>([]);
  protected readonly query = signal('');
  protected readonly appliedQuery = signal('');
  protected readonly statusFilter = signal('all');
  protected readonly appliedStatus = signal('all');
  protected readonly sort = signal('name');
  protected readonly direction = signal<'asc' | 'desc'>('asc');
  protected readonly page = signal(0);
  protected readonly pageSize = signal(8);
  protected readonly loading = signal(false);
  protected readonly error = signal('');
  protected readonly drawerOpen = signal(false);
  protected readonly confirmOpen = signal(false);
  protected readonly editing = signal<ImportRow | null>(null);
  protected readonly draftName = signal('');
  protected readonly draftEmail = signal('');
  protected readonly draftNote = signal('');
  protected readonly draftDepot = signal('');
  protected readonly draftTeams = signal<string[]>([]);
  protected readonly attempted = signal(false);
  protected readonly activeTab = signal('details');
  protected readonly steps = [
    { value: 'file', label: 'Datei auswählen' },
    { value: 'review', label: 'Prüfen und zuordnen' },
    { value: 'done', label: 'Abschluss' },
  ];
  protected readonly tabs = [
    { value: 'details', label: 'Stammdaten' },
    { value: 'assignment', label: 'Zuordnung' },
    { value: 'changes', label: 'Änderungen' },
  ];
  protected readonly depots = [
    { value: 'north', label: 'Nord' },
    { value: 'south', label: 'Süd' },
  ];
  protected readonly teams = [
    { value: 'sales', label: 'Vertrieb' },
    { value: 'service', label: 'Service' },
  ];
  protected readonly statuses = [
    { value: 'all', label: 'Alle' },
    { value: 'ready', label: 'Bereit' },
    { value: 'invalid', label: 'Prüfung nötig' },
    { value: 'imported', label: 'Übernommen' },
  ];
  protected readonly nameErrors = [{ kind: 'required', message: 'Bitte einen Namen eingeben.' }];
  protected readonly emailErrors = [
    { kind: 'email', message: 'Bitte eine gültige E-Mail-Adresse eingeben.' },
  ];
  protected readonly columns: DataTableColumn<ImportRow>[] = [
    { key: 'select', header: 'Auswahl', value: () => '' },
    { key: 'name', header: 'Name', value: (row) => row.name || '—', sortable: true },
    { key: 'email', header: 'E-Mail', value: (row) => row.email || '—', sortable: true },
    { key: 'status', header: 'Status', value: (row) => this.rowStatus(row) },
    { key: 'actions', header: 'Prüfen', value: () => '' },
  ];
  protected readonly filteredRows = computed(() => {
    const query = this.appliedQuery().toLocaleLowerCase('de');
    const status = this.appliedStatus();
    const key = this.sort();
    const direction = this.direction() === 'asc' ? 1 : -1;
    return this.rows()
      .filter(
        (row) =>
          `${row.name} ${row.email}`.toLocaleLowerCase('de').includes(query) &&
          (status === 'all' ||
            (status === 'imported'
              ? row.imported
              : !row.imported && (status === 'ready' ? this.isValid(row) : !this.isValid(row)))),
      )
      .sort(
        (a, b) =>
          (key === 'email'
            ? a.email.localeCompare(b.email, 'de')
            : a.name.localeCompare(b.name, 'de')) * direction,
      );
  });
  protected readonly pageRows = computed(() =>
    this.filteredRows().slice(this.page() * this.pageSize(), (this.page() + 1) * this.pageSize()),
  );
  protected readonly totalPages = computed(() =>
    Math.ceil(this.filteredRows().length / this.pageSize()),
  );
  protected readonly changes = computed(() => {
    const row = this.editing();
    return row
      ? [
          { key: 'name', label: 'Name', before: row.name, after: this.draftName() },
          { key: 'email', label: 'E-Mail', before: row.email, after: this.draftEmail() },
          { key: 'note', label: 'Notiz', before: row.note, after: this.draftNote() },
          {
            key: 'depot',
            label: 'Depot',
            before: this.depotLabel(row.depot),
            after: this.depotLabel(this.draftDepot()),
          },
          {
            key: 'teams',
            label: 'Teams',
            before: this.teamLabels(row.teams),
            after: this.teamLabels(this.draftTeams()),
          },
        ]
      : [];
  });
  protected readonly completed = computed(() =>
    this.stage() === 'done' ? ['file', 'review'] : this.stage() === 'review' ? ['file'] : [],
  );
  protected readonly trackRow = (row: ImportRow) => row.id;

  protected isValid(row: ImportRow): boolean {
    return !!row.name.trim() && this.validEmail(row.email) && !!row.depot;
  }
  protected validEmail(value: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  }
  protected rowStatus(row: ImportRow): string {
    return row.imported ? 'Übernommen' : this.isValid(row) ? 'Bereit' : 'Prüfung nötig';
  }
  private depotLabel(value: string): string {
    return this.depots.find((option) => option.value === value)?.label ?? 'Nicht zugeordnet';
  }
  private teamLabels(values: string[]): string {
    return (
      values
        .map((value) => this.teams.find((option) => option.value === value)?.label ?? value)
        .join(', ') || 'Keine'
    );
  }

  protected async loadFile(): Promise<void> {
    const file = this.file();
    if (!file || this.loading()) return;
    const version = ++this.loadVersion;
    this.loading.set(true);
    this.error.set('');
    try {
      const data = parseCsv((await file.text()).replace(/^\uFEFF/, ''));
      if (version !== this.loadVersion) return;
      const header = data.shift()?.map((value) => value.toLocaleLowerCase('de')) ?? [];
      const nameIndex = header.indexOf('name');
      const emailIndex = header.findIndex((value) => ['email', 'e-mail'].includes(value));
      if (nameIndex < 0 || emailIndex < 0)
        throw new Error('Die CSV benötigt die Spalten „Name“ und „E-Mail“.');
      if (!data.length) throw new Error('Die CSV enthält keine Datensätze.');
      this.rows.set(
        data.map((values, id) => ({
          id,
          name: values[nameIndex] ?? '',
          email: values[emailIndex] ?? '',
          note: '',
          depot: '',
          teams: [],
          imported: false,
        })),
      );
      this.selected.set([]);
      this.query.set('');
      this.appliedQuery.set('');
      this.statusFilter.set('all');
      this.appliedStatus.set('all');
      this.page.set(0);
      this.stage.set('review');
    } catch (error) {
      if (version === this.loadVersion)
        this.error.set(
          error instanceof Error ? error.message : 'Die Datei konnte nicht gelesen werden.',
        );
    } finally {
      if (version === this.loadVersion) this.loading.set(false);
    }
  }
  protected useDemo(): void {
    this.rows.set([
      {
        id: 1,
        name: 'Mira Weber',
        email: 'mira@example.test',
        note: '',
        depot: 'north',
        teams: ['sales'],
        imported: false,
      },
      {
        id: 2,
        name: 'Jonas Klein',
        email: 'jonas@example.test',
        note: 'Zuordnung prüfen',
        depot: '',
        teams: [],
        imported: false,
      },
      {
        id: 3,
        name: 'Aylin Koch',
        email: 'aylin@example.test',
        note: '',
        depot: 'south',
        teams: ['service'],
        imported: false,
      },
    ]);
    this.selected.set([]);
    this.error.set('');
    this.page.set(0);
    this.stage.set('review');
  }
  protected reset(): void {
    this.loadVersion++;
    this.loading.set(false);
    this.file.set(null);
    this.rows.set([]);
    this.selected.set([]);
    this.query.set('');
    this.appliedQuery.set('');
    this.statusFilter.set('all');
    this.appliedStatus.set('all');
    this.page.set(0);
    this.error.set('');
    this.stage.set('file');
  }
  protected applyFilters(): void {
    this.appliedQuery.set(this.query().trim());
    this.appliedStatus.set(this.statusFilter());
    this.page.set(0);
  }
  protected resetFilters(): void {
    this.query.set('');
    this.statusFilter.set('all');
    this.applyFilters();
  }
  protected sortBy(key: string): void {
    this.direction.set(this.sort() === key && this.direction() === 'asc' ? 'desc' : 'asc');
    this.sort.set(key);
    this.page.set(0);
  }
  protected toggle(row: ImportRow, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.selected.update((ids) =>
      checked ? [...ids.filter((id) => id !== row.id), row.id] : ids.filter((id) => id !== row.id),
    );
  }
  protected edit(row: ImportRow): void {
    this.editing.set(row);
    this.draftName.set(row.name);
    this.draftEmail.set(row.email);
    this.draftNote.set(row.note);
    this.draftDepot.set(row.depot);
    this.draftTeams.set([...row.teams]);
    this.attempted.set(false);
    this.activeTab.set('details');
    this.drawerOpen.set(true);
  }
  protected save(): void {
    const row = this.editing();
    if (!row || row.imported) return;
    this.attempted.set(true);
    const updated = {
      ...row,
      name: this.draftName().trim(),
      email: this.draftEmail().trim(),
      note: this.draftNote(),
      depot: this.draftDepot(),
      teams: this.draftTeams(),
    };
    if (!this.isValid(updated)) {
      this.activeTab.set(
        !updated.name || !this.validEmail(updated.email) ? 'details' : 'assignment',
      );
      return;
    }
    this.rows.update((rows) => rows.map((item) => (item.id === row.id ? updated : item)));
    this.drawerOpen.set(false);
    this.toast.show('Datensatz für diesen Demo-Import aktualisiert.');
  }
  protected confirm(): void {
    const ids = this.selected();
    if (!ids.length) return;
    this.rows.update((rows) =>
      rows.map((row) =>
        ids.includes(row.id) && this.isValid(row) ? { ...row, imported: true } : row,
      ),
    );
    this.confirmOpen.set(false);
    this.selected.set([]);
    this.stage.set('done');
    this.toast.show(`${ids.length} Datensätze in der Demo übernommen.`);
  }
}
