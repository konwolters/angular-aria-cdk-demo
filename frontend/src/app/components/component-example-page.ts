import { Component, computed, effect, inject, signal } from '@angular/core';
import { componentApis } from './component-api';
import { componentSources } from './component-source';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { ButtonComponent } from '../shared/button/button';
import { TextFieldComponent } from '../shared/text-field/text-field';
import { TextareaComponent } from '../shared/textarea/textarea';
import { SelectComponent } from '../shared/select/select';
import { MultiSelectComponent } from '../shared/multi-select/multi-select';
import { TabsComponent } from '../shared/tabs/tabs';
import { TabPanelTemplateDirective } from '../shared/tabs/tab-panel-template.directive';
import { StepperComponent } from '../shared/stepper/stepper';
import { FilePickerComponent } from '../shared/file-picker/file-picker';
import { DataTableToolbarComponent } from '../shared/data-table-toolbar/data-table-toolbar';
import { DataTableComponent, DataTableColumn } from '../shared/data-table/data-table';
import { DataTableCellDirective } from '../shared/data-table/data-table-cell.directive';
import { InlineMessageComponent } from '../shared/inline-message/inline-message';
import { DiffViewComponent } from '../shared/diff-view/diff-view';
import { SideDrawerComponent } from '../shared/side-drawer/side-drawer';
import { ModalComponent } from '../shared/modal/modal';
import { ToastOutletComponent, ToastService } from '../shared/toast/toast';

interface ComponentExample {
  id: string;
  title: string;
  html: string;
  typescript: string;
}

interface ComponentDocumentation {
  name: string;
  description: string;
  examples: readonly ComponentExample[];
}

interface SelectablePerson {
  id: string;
  name: string;
  email: string;
  disabled: boolean;
}

const sample = (id: string, title: string, html: string, typescript: string): ComponentExample => ({
  id,
  title,
  html,
  typescript,
});

function formatHtmlSnippet(source: string): string {
  const tokens = source.replace(/>\s*</g, '>\n<').match(/<[^>]+>|[^<]+/g) ?? [];
  const lines: string[] = [];
  let depth = 0;
  for (const token of tokens) {
    const text = token.trim();
    if (!text) continue;
    if (text.startsWith('</')) depth = Math.max(0, depth - 1);
    const indent = '  '.repeat(depth);
    const match = text.match(/^<([\w-]+)([\s\S]*?)(\/?)>$/);
    if (!match || text.startsWith('<!--')) {
      lines.push(indent + text);
      continue;
    }
    const [, name, attributeText, selfClosing] = match;
    const attributes = attributeText.match(/[^\s=]+(?:=(?:"[^"]*"|'[^']*'|[^\s]+))?/g) ?? [];
    const ending = selfClosing ? ' />' : '>';
    const singleLine = `${indent}<${name}${attributes.length ? ` ${attributes.join(' ')}` : ''}${ending}`;
    if (singleLine.length <= 96 || text.startsWith('</')) {
      lines.push(singleLine);
    } else {
      lines.push(`${indent}<${name}`);
      for (const attribute of attributes) lines.push(`${indent}  ${attribute}`);
      lines.push(`${indent}${ending.trimStart()}`);
    }
    if (!selfClosing && !text.startsWith('</')) depth++;
  }
  return lines.join('\n');
}

function formatTypeScriptSnippet(source: string): string {
  const output: string[] = [];
  const componentMembers = source.split('\n').map((line) => {
    if (
      !line ||
      line.startsWith(' ') ||
      line.startsWith('//') ||
      line.startsWith('import ') ||
      line.startsWith('interface ') ||
      line.startsWith('type ') ||
      /^(public|protected|private)\s/.test(line)
    ) {
      return line;
    }

    if (/^[\w$]+\s*\([^)]*\)\s*:\s*[^{}]+\s*\{/.test(line)) {
      return `protected ${line}`;
    }
    if (/^[\w$]+\??(?:\s*:\s*[^=]+)?\s*=/.test(line)) {
      return `protected readonly ${line}`;
    }
    return line;
  });

  for (const original of componentMembers) {
    let line = original.trimEnd();
    if (line.length <= 100 || line.trimStart().startsWith('//')) {
      output.push(line);
      continue;
    }
    while (line.length > 100) {
      let quote = '';
      let split = -1;
      for (let i = 0; i < Math.min(line.length, 100); i++) {
        const char = line[i];
        if (quote) {
          if (char === quote && line[i - 1] !== '\\') quote = '';
        } else if (char === '"' || char === "'" || char === '`') {
          quote = char;
        } else if (char === ',') {
          split = i + 1;
        }
      }
      if (split < 30) split = line.lastIndexOf(' ', 100);
      if (split < 30) break;
      output.push(line.slice(0, split).trimEnd());
      line = `  ${line.slice(split).trimStart()}`;
    }
    output.push(line);
  }
  return output.join('\n');
}

const examples: Record<string, ComponentDocumentation> = {
  button: {
    name: 'Button',
    description: 'Aktionen in klar unterscheidbaren Varianten und Größen.',
    examples: [
      sample(
        'primary',
        'Primäre Aktion',
        '<button appButton type="button">Speichern</button>',
        '// Keine zusätzliche Konfiguration erforderlich.',
      ),
      sample(
        'variants',
        'Varianten',
        '<button appButton>Primär</button>\n<button appButton variant="secondary">Sekundär</button>\n<button appButton variant="ghost">Ghost</button>\n<button appButton variant="link">Link</button>\n<button appButton variant="danger">Gefahr</button>',
        "import { ButtonComponent } from '../shared/button/button';\n\n@Component({ imports: [ButtonComponent] })\n// variant: primary | secondary | ghost | link | danger",
      ),
      sample(
        'sizes',
        'Größen',
        '<button appButton size="small">Klein</button>\n<button appButton size="medium">Mittel</button>\n<button appButton size="large">Groß</button>',
        '// size: small | medium | large (Standard: medium)',
      ),
      sample(
        'icon',
        'Mit Icon',
        '<button appButton icon="plus">Hinzufügen</button>\n<button appButton icon="arrow-right" iconPosition="end">Weiter</button>',
        '// icon akzeptiert einen IconName; iconPosition: start | end',
      ),
      sample(
        'states',
        'Deaktiviert und aktiv',
        '<button appButton [disabled]="true">Nicht verfügbar</button>\n<button appButton [active]="true">Ausgewählt</button>',
        '// disabled stammt vom nativen Button.\n// active markiert einen anhaltend ausgewählten Zustand.',
      ),
    ],
  },
  'text-field': {
    name: 'TextField',
    description: 'Einzeilige Eingabe mit Labels, Hinweisen und Formularanbindung.',
    examples: [
      sample(
        'basic',
        'Basisfeld',
        '<app-text-field label="Vorname" [(value)]="firstName" />',
        "import { signal } from '@angular/core';\n\nfirstName = signal('');",
      ),
      sample(
        'hint',
        'Mit Hinweis',
        '<app-text-field label="E-Mail" hint="Wir verwenden die Adresse nur für Rückfragen." />',
        '// hint ist optional und wird nur bei expliziter Angabe angezeigt.',
      ),
      sample(
        'changed',
        'Geänderter Wert',
        '<app-text-field label="Name" [value]="name" [initialValue]="originalName" [changed]="true" previousValueLabel="Wert vorher" />',
        "import { signal } from '@angular/core';\n\nname = signal('Neuer Name');\noriginalName = 'Alter Name';\n// previousValueLabel ist optional; Standardwert: 'Wert vorher'.",
      ),
      sample(
        'error',
        'Validierungsfehler',
        '<app-text-field label="Name" [value]="name" [invalid]="true" [touched]="true" [errors]="nameErrors" />',
        "import { signal } from '@angular/core';\n\nname = signal('');\nnameErrors = [{ kind: 'required', message: 'Bitte einen Namen eingeben.' }];",
      ),
      sample(
        'disabled',
        'Deaktiviert',
        '<app-text-field label="Kundennummer" value="K-1042" [disabled]="true" />',
        '// disabled sperrt die Eingabe und signalisiert den Zustand.',
      ),
      sample(
        'readonly',
        'Nur lesbar',
        '<app-text-field label="E-Mail" value="alex@example.com" [readonly]="true" />',
        '// readonly bleibt fokussier- und kopierbar, aber nicht editierbar.',
      ),
      sample(
        'prefix',
        'Mit Prefix',
        '<app-text-field label="Betrag" prefix="€" />',
        '// prefix eignet sich z. B. für Währung oder Einheiten.',
      ),
    ],
  },
  textarea: {
    name: 'Textarea',
    description: 'Mehrzeilige Eingabe für längere Texte.',
    examples: [
      sample(
        'basic',
        'Basisfeld',
        '<app-textarea label="Notiz" [(value)]="note" />',
        "import { signal } from '@angular/core';\n\nnote = signal('');",
      ),
      sample(
        'hint',
        'Mit Hinweis',
        '<app-textarea label="Kommentar" hint="Maximal 255 Zeichen." [maxLength]="255" />',
        '// hint und maxLength sind optionale Inputs.',
      ),
      sample(
        'changed',
        'Geänderter Text',
        '<app-textarea label="Beschreibung" [value]="description" [initialValue]="originalDescription" [changed]="true" />',
        "import { signal } from '@angular/core';\n\ndescription = signal('Aktuelle Fassung');\noriginalDescription = 'Vorherige Fassung';",
      ),
      sample(
        'error',
        'Validierungsfehler',
        '<app-textarea label="Kommentar" [value]="comment" [invalid]="true" [touched]="true" [errors]="commentErrors" />',
        "import { signal } from '@angular/core';\n\ncomment = signal('');\ncommentErrors = [{ kind: 'required', message: 'Bitte einen Kommentar eingeben.' }];",
      ),
      sample(
        'disabled',
        'Deaktiviert und nur lesbar',
        '<app-textarea label="Archivnotiz" value="Abgeschlossen" [disabled]="true" />\n<app-textarea label="Protokoll" value="Nur lesbar" [readonly]="true" />',
        '// disabled ist gesperrt; readonly bleibt fokussierbar.',
      ),
    ],
  },
  select: {
    name: 'Select',
    description: 'Durchsuchbare Einfachauswahl mit getrenntem Wert und Label.',
    examples: [
      sample(
        'basic',
        'Ohne Suche',
        '<app-select label="Status" [options]="statuses" [(value)]="status" />',
        "import { signal } from '@angular/core';\n\nstatuses = [{ value: 'draft', label: 'Entwurf' }, { value: 'active', label: 'Aktiv' }, { value: 'archived', label: 'Archiviert' }];\nstatus = signal('');",
      ),
      sample(
        'search',
        'Durchsuchbar',
        '<app-select label="Depot" [options]="depots" [(value)]="depot" [searchable]="true" />',
        "import { signal } from '@angular/core';\n\ndepots = [{ value: 'd1', label: 'Hauptdepot' }, { value: 'd2', label: 'Zweitdepot' }];\ndepot = signal('');",
      ),
      sample(
        'hint',
        'Mit Hinweis',
        '<app-select label="Depot" [options]="depots" hint="Bitte ein bevorzugtes Depot wählen." />',
        '// hint erscheint nur, wenn ein Hinweistext übergeben wird.',
      ),
      sample(
        'changed',
        'Geänderter Wert',
        '<app-select label="Depot" [options]="depots" value="d1" initialValue="d2" [changed]="true" />',
        "depots = [{ value: 'd1', label: 'Hauptdepot' }, { value: 'd2', label: 'Zweitdepot' }];\n// d1 ist aktuell; d2 ist der vorherige Wert.",
      ),
      sample(
        'error',
        'Fehler und deaktivierte Option',
        '<app-select label="Depot" [options]="depots" [invalid]="true" [touched]="true" [errors]="feedbackErrors" />',
        "feedbackErrors = [{ kind: 'required', message: 'Bitte ein Depot auswählen.' }];\n// Optionen können { value, label, disabled } enthalten.",
      ),
      sample(
        'disabled',
        'Deaktiviert und readonly',
        '<app-select label="Status" [options]="statuses" value="active" [disabled]="true" />\n<app-select label="Typ" [options]="statuses" value="archived" [readonly]="true" />',
        "statuses = [{ value: 'active', label: 'Aktiv' }, { value: 'archived', label: 'Archiviert' }];\n// disabled verhindert Nutzung; readonly zeigt einen unveränderlichen Wert.",
      ),
    ],
  },
  'multi-select': {
    name: 'MultiSelect',
    description: 'Durchsuchbare Auswahl mehrerer Optionen.',
    examples: [
      sample(
        'basic',
        'Mehrere Werte',
        '<app-multi-select label="Teams" [options]="teams" [(value)]="selectedTeams" />',
        "import { signal } from '@angular/core';\n\nteams = [{ value: 'a', label: 'Design' }, { value: 'b', label: 'Engineering' }];\nselectedTeams = signal<string[]>(['a']);",
      ),
      sample(
        'search',
        'Mit Suche und begrenzter Anzeige',
        '<app-multi-select label="Depots" [options]="depots" [searchable]="true" [maxDisplayedValues]="2" />',
        "depots = [{ value: 'd1', label: 'Hauptdepot' }, { value: 'd2', label: 'Zweitdepot' }];\n// searchable aktiviert Filterung; maxDisplayedValues begrenzt sichtbare Auswahlchips.",
      ),
      sample(
        'hint',
        'Mit Hinweis',
        '<app-multi-select label="Teams" [options]="teams" hint="Mehrere Teams können gewählt werden." />',
        '// hint wird unter dem Auswahlfeld angezeigt.',
      ),
      sample(
        'changed',
        'Geänderte Auswahl',
        '<app-multi-select label="Teams" [options]="teams" [value]="selected" [initialValue]="original" [changed]="true" />',
        "teams = [{ value: 'a', label: 'Design' }, { value: 'b', label: 'Engineering' }];\nselected = ['a', 'b'];\noriginal = ['a'];",
      ),
      sample(
        'error',
        'Fehler und gesperrte Optionen',
        '<app-multi-select label="Teams" [options]="teams" [invalid]="true" [touched]="true" [errors]="feedbackErrors" />',
        "teams = [{ value: 'a', label: 'Design' }, { value: 'b', label: 'Engineering' }, { value: 'c', label: 'Extern', disabled: true }];\nfeedbackErrors = [{ kind: 'required', message: 'Mindestens ein Team wählen.' }];",
      ),
      sample(
        'disabled',
        'Deaktiviert und readonly',
        '<app-multi-select label="Teams" [options]="teams" [value]="[\'a\']" [disabled]="true" />\n<app-multi-select label="Teams" [options]="teams" [value]="[\'b\']" [readonly]="true" />',
        "teams = [{ value: 'a', label: 'Design' }, { value: 'b', label: 'Engineering' }];\n// Beide Zustände verhindern Änderungen; readonly bleibt visuell lesbar.",
      ),
    ],
  },
  tabs: {
    name: 'Tabs',
    description: 'Zugängliche Reiter mit Tastaturnavigation und zugeordneten Panels.',
    examples: [
      sample(
        'basic',
        'Einfaches Tabset',
        '<app-tabs [tabs]="tabs" [(selectedTab)]="activeTab">\n  <ng-template appTabPanel="general">Allgemeine Einstellungen</ng-template>\n  <ng-template appTabPanel="details">Details</ng-template>\n</app-tabs>',
        "import { signal } from '@angular/core';\n\ntabs = [{ value: 'general', label: 'Allgemein' }, { value: 'details', label: 'Details' }];\nactiveTab = signal('general');",
      ),
      sample(
        'disabled',
        'Mit deaktiviertem Tab',
        '<app-tabs [tabs]="disabledTabs" [(selectedTab)]="activeTab">\n  <ng-template appTabPanel="general">Allgemein</ng-template>\n</app-tabs>',
        "import { signal } from '@angular/core';\n\ndisabledTabs = [{ value: 'general', label: 'Allgemein' }, { value: 'locked', label: 'Gesperrt', disabled: true }];\nactiveTab = signal('general');",
      ),
      sample(
        'keyboard',
        'Explizite Tastaturaktivierung',
        '<app-tabs [tabs]="tabs" [(selectedTab)]="activeTab" selectionMode="explicit" orientation="vertical">\n  <ng-template appTabPanel="general">Allgemein</ng-template>\n</app-tabs>',
        "import { signal } from '@angular/core';\n\ntabs = [{ value: 'general', label: 'Allgemein' }];\nactiveTab = signal('general');\n// Pfeiltasten fokussieren; Enter oder Leertaste aktiviert.",
      ),
    ],
  },
  stepper: {
    name: 'Stepper',
    description: 'Zeigt Fortschritt und Status in mehrstufigen Abläufen.',
    examples: [
      sample(
        'first',
        'Erster Schritt',
        '<app-stepper [steps]="steps" current="file" [completed]="[]" />',
        "steps = [{ value: 'file', label: 'Datei' }, { value: 'review', label: 'Prüfen' }, { value: 'group', label: 'Gruppierung' }, { value: 'finish', label: 'Abschluss' }];",
      ),
      sample(
        'progress',
        'Fortschritt mit abgeschlossenen Schritten',
        '<app-stepper [steps]="steps" current="group" [completed]="completed" />',
        "steps = [{ value: 'file', label: 'Datei' }, { value: 'review', label: 'Prüfen' }, { value: 'group', label: 'Gruppierung' }, { value: 'finish', label: 'Abschluss' }];\ncompleted = ['file', 'review'];\ncurrent = 'group';",
      ),
    ],
  },
  'file-picker': {
    name: 'FilePicker',
    description: 'Dateiauswahl per Dateidialog oder Droparea mit Größenlimit.',
    examples: [
      sample(
        'basic',
        'CSV-Datei auswählen',
        '<app-file-picker label="CSV-Datei" [(value)]="file" accept=".csv,text/csv" [maxBytes]="1048576" />',
        "import { signal } from '@angular/core';\n\nfile = signal<File | null>(null);\n// Größenlimit bleibt Bestandteil des Inputs maxBytes.",
      ),
      sample(
        'disabled',
        'Deaktiviert',
        '<app-file-picker label="Importdatei" [disabled]="true" />',
        '// disabled sperrt Datei-Dialog und Droparea.',
      ),
      sample(
        'types',
        'Andere Dateitypen und Limit',
        '<app-file-picker label="Dokument" accept=".pdf,application/pdf" [maxBytes]="5242880" />',
        '// accept folgt dem HTML-accept-Attribut.\n// maxBytes wird in Bytes angegeben.',
      ),
    ],
  },
  'data-table-toolbar': {
    name: 'DataTableToolbar',
    description: 'Erweiterbare Such- und Aktionsleiste für Tabellen.',
    examples: [
      sample(
        'basic',
        'Suche und Aktionen',
        '<app-data-table-toolbar (apply)="applyFilters()" (reset)="resetFilters()">\n  <div data-table-searches><app-text-field label="Suche" [(value)]="query" /></div>\n  <span data-table-summary>12 Einträge</span>\n  <button data-table-actions appButton>Neu</button>\n</app-data-table-toolbar>',
        "import { signal } from '@angular/core';\n\nquery = signal('');\n\napplyFilters(): void { /* Filter übernehmen */ }\nresetFilters(): void { this.query.set(''); }",
      ),
      sample(
        'no-reset',
        'Ohne Zurücksetzen',
        '<app-data-table-toolbar [showReset]="false" [applyDisabled]="!hasChanges()">\n  <div data-table-searches><!-- Filter --></div>\n</app-data-table-toolbar>',
        'hasChanges(): boolean { return false; }',
      ),
      sample(
        'multiple',
        'Mehrere Filter',
        '<app-data-table-toolbar>\n  <div data-table-searches class="grid gap-3 sm:grid-cols-2">\n    <app-text-field label="Name" />\n    <app-select label="Status" [options]="statuses" />\n  </div>\n</app-data-table-toolbar>',
        "statuses = [{ value: 'draft', label: 'Entwurf' }, { value: 'active', label: 'Aktiv' }, { value: 'archived', label: 'Archiviert' }];",
      ),
    ],
  },
  'data-table': {
    name: 'DataTable',
    description: 'Datentabelle mit Sortierung, Ladezustand und Pagination.',
    examples: [
      sample(
        'basic',
        'Einfache Tabelle',
        '<app-data-table [rows]="rows" [columns]="columns" [pagination]="false" />',
        "import { DataTableColumn } from '../shared/data-table/data-table';\n\ninterface Person { name: string; role: string; email: string }\nrows: Person[] = [\n  { name: 'Ada Lovelace', role: 'Mathematik', email: 'ada@example.test' },\n  { name: 'Grace Hopper', role: 'Informatik', email: 'grace@example.test' },\n  { name: 'Linus Torvalds', role: 'Software', email: 'linus@example.test' },\n];\ncolumns: DataTableColumn<Person>[] = [\n  { key: 'name', header: 'Name', value: row => row.name },\n  { key: 'role', header: 'Rolle', value: row => row.role },\n  { key: 'email', header: 'E-Mail', value: row => row.email },\n];",
      ),
      sample(
        'sorting',
        'Sortierbare Spalte',
        '<app-data-table [rows]="rows" [columns]="columns" [sort]="sort" [direction]="direction" (sortChange)="sortBy($event)" />',
        "import { signal } from '@angular/core';\nimport { DataTableColumn } from '../shared/data-table/data-table';\n\ninterface Person { name: string; role: string; email: string }\nrows: Person[] = [\n  { name: 'Ada Lovelace', role: 'Mathematik', email: 'ada@example.test' },\n  { name: 'Grace Hopper', role: 'Informatik', email: 'grace@example.test' },\n  { name: 'Linus Torvalds', role: 'Software', email: 'linus@example.test' },\n];\ncolumns: DataTableColumn<Person>[] = [\n  { key: 'name', header: 'Name', value: row => row.name, sortable: true },\n  { key: 'role', header: 'Rolle', value: row => row.role },\n  { key: 'email', header: 'E-Mail', value: row => row.email },\n];\nsort = signal('name');\ndirection = signal<'asc' | 'desc'>('asc');\nsortBy(key: string): void { this.sort.set(key); }",
      ),
      sample(
        'pagination',
        'Pagination',
        '<app-data-table [rows]="pageRows()" [columns]="columns" [total]="3" [totalPages]="3" [pageSize]="1" [page]="page()" (pageChange)="page.set($event)" />',
        "import { computed, signal } from '@angular/core';\nimport { DataTableColumn } from '../shared/data-table/data-table';\n\ninterface Person { name: string; role: string; email: string }\nallRows: Person[] = [\n  { name: 'Ada Lovelace', role: 'Mathematik', email: 'ada@example.test' },\n  { name: 'Grace Hopper', role: 'Informatik', email: 'grace@example.test' },\n  { name: 'Linus Torvalds', role: 'Software', email: 'linus@example.test' },\n];\npage = signal(0);\npageRows = computed(() => this.allRows.slice(this.page(), this.page() + 1));\ncolumns: DataTableColumn<Person>[] = [\n  { key: 'name', header: 'Name', value: row => row.name },\n  { key: 'role', header: 'Rolle', value: row => row.role },\n  { key: 'email', header: 'E-Mail', value: row => row.email },\n];",
      ),
      sample(
        'empty',
        'Leerer Zustand',
        '<app-data-table [rows]="[]" [columns]="columns" emptyMessage="Keine passenden Einträge." />',
        "import { DataTableColumn } from '../shared/data-table/data-table';\n\ninterface Person { name: string; role: string; email: string }\ncolumns: DataTableColumn<Person>[] = [\n  { key: 'name', header: 'Name', value: row => row.name },\n  { key: 'role', header: 'Rolle', value: row => row.role },\n  { key: 'email', header: 'E-Mail', value: row => row.email },\n];",
      ),
      sample(
        'loading',
        'Ladezustand',
        '<app-data-table [rows]="[]" [columns]="columns" [loading]="true" />',
        "import { DataTableColumn } from '../shared/data-table/data-table';\n\ninterface Person { name: string; role: string; email: string }\ncolumns: DataTableColumn<Person>[] = [\n  { key: 'name', header: 'Name', value: row => row.name },\n  { key: 'role', header: 'Rolle', value: row => row.role },\n  { key: 'email', header: 'E-Mail', value: row => row.email },\n];",
      ),
      sample(
        'table-error',
        'Fehlerzustand',
        '<app-data-table [rows]="[]" [columns]="columns" error="Die Daten konnten nicht geladen werden." />',
        "import { DataTableColumn } from '../shared/data-table/data-table';\n\ninterface Person { name: string; role: string; email: string }\ncolumns: DataTableColumn<Person>[] = [\n  { key: 'name', header: 'Name', value: row => row.name },\n  { key: 'role', header: 'Rolle', value: row => row.role },\n  { key: 'email', header: 'E-Mail', value: row => row.email },\n];",
      ),
      sample(
        'selection',
        'Individuelle Zeilenauswahl',
        '<app-data-table [rows]="people" [columns]="columns" [pagination]="false" [trackBy]="trackPerson">\n  <ng-template appDataTableCell="select" let-row>\n    <input type="checkbox" [attr.aria-label]="row.name + \' auswählen\'" [checked]="selectedIds().includes(row.id)" [disabled]="row.disabled" (change)="togglePerson(row, $event)" />\n  </ng-template>\n</app-data-table>',
        "import { signal } from '@angular/core';\nimport { DataTableColumn } from '../shared/data-table/data-table';\nimport { DataTableCellDirective } from '../shared/data-table/data-table-cell.directive';\n\ninterface Person { id: string; name: string; email: string; disabled: boolean }\npeople: Person[] = [\n  { id: 'ada', name: 'Ada Lovelace', email: 'ada@example.test', disabled: false },\n  { id: 'grace', name: 'Grace Hopper', email: 'grace@example.test', disabled: false },\n  { id: 'linus', name: 'Linus Torvalds', email: 'linus@example.test', disabled: true },\n];\ncolumns: DataTableColumn<Person>[] = [\n  { key: 'select', header: 'Auswahl', value: () => '' },\n  { key: 'name', header: 'Name', value: person => person.name },\n  { key: 'email', header: 'E-Mail', value: person => person.email },\n];\nselectedIds = signal<string[]>([]);\ntrackPerson = (person: Person) => person.id;\ntogglePerson(person: Person, event: Event): void {\n  const checked = (event.target as HTMLInputElement).checked;\n  this.selectedIds.update(ids => checked ? [...ids, person.id] : ids.filter(id => id !== person.id));\n}",
      ),
    ],
  },
  'data-table-combined': {
    name: 'DataTable + Toolbar',
    description: 'Such- und Filterleiste mit einer gemeinsam gesteuerten Datentabelle.',
    examples: [
      sample(
        'combined-filter',
        'Kontakte suchen und filtern',
        `<app-data-table-toolbar (apply)="applyCombinedFilters()" (reset)="resetCombinedFilters()">
  <div data-table-searches>
    <app-text-field label="Suche" [(value)]="combinedQuery" />
  </div>
  <div data-table-filters>
    <app-select label="Rolle" [options]="roleOptions" [(value)]="combinedRole" />
  </div>
  <span data-table-summary>{{ filteredContacts().length }} Treffer</span>
</app-data-table-toolbar>
<app-data-table [rows]="filteredContacts()" [columns]="columns" [pagination]="false" [framed]="false" caption="Gefilterte Kontakte" />`,
        `import { computed, signal } from '@angular/core';
import { DataTableColumn } from '../shared/data-table/data-table';

interface Contact { name: string; role: string; email: string }

protected readonly contacts: Contact[] = [
  { name: 'Ada Lovelace', role: 'Mathematik', email: 'ada@example.test' },
  { name: 'Grace Hopper', role: 'Informatik', email: 'grace@example.test' },
  { name: 'Linus Torvalds', role: 'Software', email: 'linus@example.test' },
];
protected readonly columns: DataTableColumn<Contact>[] = [
  { key: 'name', header: 'Name', value: row => row.name },
  { key: 'role', header: 'Rolle', value: row => row.role },
  { key: 'email', header: 'E-Mail', value: row => row.email },
];
protected readonly roleOptions = [
  { value: '', label: 'Alle Rollen' },
  { value: 'Mathematik', label: 'Mathematik' },
  { value: 'Informatik', label: 'Informatik' },
  { value: 'Software', label: 'Software' },
];
protected readonly combinedQuery = signal('');
protected readonly combinedRole = signal('');
private readonly appliedQuery = signal('');
private readonly appliedRole = signal('');
protected readonly filteredContacts = computed(() => {
  const query = this.appliedQuery().toLocaleLowerCase('de');
  const role = this.appliedRole();
  return this.contacts.filter(contact =>
    (contact.name.toLocaleLowerCase('de').includes(query) ||
      contact.email.toLocaleLowerCase('de').includes(query)) &&
    (!role || contact.role === role)
  );
});

protected applyCombinedFilters(): void {
  this.appliedQuery.set(this.combinedQuery().trim());
  this.appliedRole.set(this.combinedRole());
}
protected resetCombinedFilters(): void {
  this.combinedQuery.set('');
  this.combinedRole.set('');
  this.applyCombinedFilters();
}`,
      ),
    ],
  },
  'inline-message': {
    name: 'InlineMessage',
    description: 'Kontextbezogene Information, Warnung, Erfolg oder Fehlermeldung.',
    examples: [
      sample(
        'info',
        'Information',
        '<app-inline-message severity="info" title="Hinweis">Weitere Informationen.</app-inline-message>',
        '// severity: info | success | warning | error',
      ),
      sample(
        'success',
        'Erfolg',
        '<app-inline-message severity="success" title="Gespeichert">Die Änderungen wurden übernommen.</app-inline-message>',
        '// Erfolgsmeldung nach einer abgeschlossenen Aktion.',
      ),
      sample(
        'warning',
        'Warnung',
        '<app-inline-message severity="warning" title="Achtung">Bitte die Auswirkungen prüfen.</app-inline-message>',
        '// Warnung für wichtige, aber nicht blockierende Hinweise.',
      ),
      sample(
        'error',
        'Fehler ohne Titel',
        '<app-inline-message severity="error">Die Anfrage konnte nicht abgeschlossen werden.</app-inline-message>',
        '// title ist optional; severity steuert die Semantik.',
      ),
    ],
  },
  'diff-view': {
    name: 'DiffView',
    description: 'Vergleicht vorherige und neue Werte übersichtlich.',
    examples: [
      sample(
        'changed',
        'Geänderter Wert',
        '<app-diff-view [entries]="changes" />',
        "changes = [{ key: 'name', label: 'Name', before: 'Alt', after: 'Neu' }];",
      ),
      sample(
        'added',
        'Neuer Wert',
        '<app-diff-view [entries]="addedEntries" />',
        "addedEntries = [{ key: 'phone', label: 'Telefon', before: null, after: '01234' }];",
      ),
      sample(
        'removed',
        'Entfernter Wert',
        '<app-diff-view [entries]="removedEntries" />',
        "removedEntries = [{ key: 'fax', label: 'Fax', before: '05678', after: null }];",
      ),
      sample(
        'labels',
        'Eigene Spaltenbeschriftungen',
        '<app-diff-view [entries]="changes" beforeLabel="Aktuell" afterLabel="Vorgeschlagen" />',
        '// beforeLabel und afterLabel benennen die Vergleichsspalten.',
      ),
      sample(
        'unchanged',
        'Unveränderter Wert',
        '<app-diff-view [entries]="unchangedEntries" />',
        "unchangedEntries = [{ key: 'city', label: 'Ort', before: 'Berlin', after: 'Berlin' }];",
      ),
    ],
  },
  'side-drawer': {
    name: 'SideDrawer',
    description: 'Seitlich eingeblendeter Bereich für ergänzende Inhalte und Formulare.',
    examples: [
      sample(
        'basic',
        'Einfacher Drawer',
        '<button appButton (click)="drawerOpen.set(true)">Öffnen</button>\n<app-side-drawer [(open)]="drawerOpen" title="Details">Inhalt</app-side-drawer>',
        "import { signal } from '@angular/core';\n\ndrawerOpen = signal(false);",
      ),
      sample(
        'form',
        'Formular mit Footer-Aktion',
        '<app-side-drawer [(open)]="drawerOpen" title="Bearbeiten">\n  <app-text-field label="Name" />\n  <div dialog-footer><button appButton>Speichern</button></div>\n</app-side-drawer>',
        "import { signal } from '@angular/core';\n\ndrawerOpen = signal(false);\n// Footer-Inhalt wird über dialog-footer projiziert.",
      ),
      sample(
        'close',
        'Schließverhalten konfigurieren',
        '<app-side-drawer [(open)]="drawerOpen" title="Hinweis" [closeOnEscape]="false" [closeOnBackdrop]="false">Inhalt</app-side-drawer>',
        "import { signal } from '@angular/core';\n\ndrawerOpen = signal(false);\n// Escape und Backdrop lassen sich unabhängig konfigurieren.",
      ),
    ],
  },
  modal: {
    name: 'Modal',
    description: 'Zentrierter Dialog mit Fokusverwaltung und Tastaturbedienung.',
    examples: [
      sample(
        'basic',
        'Hinweisdialog',
        '<button appButton (click)="basicModalOpen.set(true)">Dialog öffnen</button>\n<app-modal [(open)]="basicModalOpen" title="Information">Weitere Informationen.</app-modal>',
        "import { signal } from '@angular/core';\n\nbasicModalOpen = signal(false);",
      ),
      sample(
        'form',
        'Dialog mit Aktionen',
        '<button appButton (click)="formModalOpen.set(true)">Dialog öffnen</button>\n<app-modal [(open)]="formModalOpen" title="Bearbeiten">\n  <app-text-field label="Name" />\n  <div dialog-footer class="mt-5 flex justify-end">\n    <button appButton>Übernehmen</button>\n  </div>\n</app-modal>',
        "import { signal } from '@angular/core';\n\nformModalOpen = signal(false);\n// dialog-footer platziert die Aktionen im Dialogfuß.",
      ),
      sample(
        'close',
        'Escape und Backdrop sperren',
        '<button appButton (click)="closeModalOpen.set(true)">Dialog öffnen</button>\n<app-modal [(open)]="closeModalOpen" title="Aktion läuft" [closeOnEscape]="false" [closeOnBackdrop]="false">Bitte warten…</app-modal>',
        "import { signal } from '@angular/core';\n\ncloseModalOpen = signal(false);\n// Schließverhalten nur sperren, wenn der Ablauf es erfordert.",
      ),
    ],
  },
  toast: {
    name: 'Toast',
    description: 'Kurzlebige Rückmeldung außerhalb des aktuellen Inhaltsflusses.',
    examples: [
      sample(
        'success',
        'Erfolgsmeldung',
        '<button appButton (click)="toasts.show(\'Änderungen gespeichert\')">Speichern</button>\n<app-toast-outlet />',
        "import { inject } from '@angular/core';\nimport { ToastService } from '../shared/toast/toast';\n\ntoasts = inject(ToastService);\n// Der Toast verschwindet automatisch.",
      ),
      sample(
        'multiple',
        'Mehrere Meldungen',
        '<button appButton (click)="notify()">Meldungen anzeigen</button>\n<app-toast-outlet />',
        "import { inject } from '@angular/core';\nimport { ToastService } from '../shared/toast/toast';\n\ntoasts = inject(ToastService);\n\nnotify(): void {\n  this.toasts.show('Import gestartet');\n  this.toasts.show('3 Einträge verarbeitet');\n}",
      ),
    ],
  },
};

@Component({
  selector: 'app-component-example-page',
  imports: [
    ButtonComponent,
    TextFieldComponent,
    TextareaComponent,
    SelectComponent,
    MultiSelectComponent,
    TabsComponent,
    TabPanelTemplateDirective,
    StepperComponent,
    FilePickerComponent,
    DataTableToolbarComponent,
    DataTableComponent,
    DataTableCellDirective,
    InlineMessageComponent,
    DiffViewComponent,
    SideDrawerComponent,
    ModalComponent,
    ToastOutletComponent,
  ],
  templateUrl: './component-example-page.html',
})
export class ComponentExamplePage {
  private readonly route = inject(ActivatedRoute);
  private readonly slug = toSignal(this.route.paramMap, {
    initialValue: this.route.snapshot.paramMap,
  });
  protected readonly example = computed(
    () => examples[this.slug().get('slug') ?? ''] ?? examples['button'],
  );
  protected readonly api = computed(
    () => componentApis[this.slug().get('slug') ?? ''] ?? componentApis['button'],
  );
  protected readonly pageTabs = [
    { value: 'examples', label: 'Beispiele' },
    { value: 'api', label: 'API' },
    { value: 'source', label: 'Quellcode' },
  ];
  protected readonly selectedPageTab = signal('examples');
  protected readonly sourceFiles = computed(
    () => componentSources[this.slug().get('slug') ?? ''] ?? componentSources['button'],
  );
  private readonly selectedSource = signal('');
  protected readonly currentSource = computed(() =>
    this.sourceFiles().includes(this.selectedSource())
      ? this.selectedSource()
      : this.sourceFiles()[0],
  );
  protected readonly sourceText = signal('');
  protected readonly highlightedSource = computed(() =>
    this.highlight(
      this.sourceText(),
      this.currentSource().endsWith('.html') ? 'html' : 'typescript',
    ),
  );
  protected readonly sourceLoading = signal(false);
  protected readonly sourceError = signal('');
  protected readonly sourceCopyStatus = signal('');
  private readonly loadSource = effect((onCleanup) => {
    if (this.selectedPageTab() !== 'source') return;
    const path = this.currentSource();
    const controller = new AbortController();
    onCleanup(() => controller.abort());
    this.sourceText.set('');
    this.sourceError.set('');
    this.sourceCopyStatus.set('');
    this.sourceLoading.set(true);
    fetch(new URL(`component-source/${path}`, document.baseURI), { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error('Quellcode konnte nicht geladen werden.');
        return response.text();
      })
      .then((text) => {
        if (!controller.signal.aborted) this.sourceText.set(text);
      })
      .catch(() => {
        if (!controller.signal.aborted)
          this.sourceError.set('Quellcode konnte nicht geladen werden.');
      })
      .finally(() => {
        if (!controller.signal.aborted) this.sourceLoading.set(false);
      });
  });
  protected readonly codeTabs = signal<Record<string, 'preview' | 'html' | 'typescript'>>({});
  protected readonly copyStatuses = signal<Record<string, string>>({});
  protected readonly value = signal('');
  protected readonly note = signal('');
  protected readonly name = signal('');
  protected readonly comment = signal('');
  protected readonly status = signal('');
  protected readonly depot = signal('');
  protected readonly firstName = signal('Mira');
  protected readonly query = signal('');
  protected readonly combinedQuery = signal('');
  protected readonly combinedRole = signal('');
  private readonly appliedQuery = signal('');
  private readonly appliedRole = signal('');
  protected readonly roleOptions = [
    { value: '', label: 'Alle Rollen' },
    { value: 'Mathematik', label: 'Mathematik' },
    { value: 'Informatik', label: 'Informatik' },
    { value: 'Software', label: 'Software' },
  ];
  protected readonly selection = signal('');
  protected readonly selections = signal<string[]>([]);
  protected readonly selectedTeams = signal<string[]>(['a']);
  protected readonly selectedIds = signal<string[]>([]);
  protected readonly page = signal(0);
  protected readonly sort = signal('name');
  protected readonly direction = signal<'asc' | 'desc'>('asc');
  protected readonly file = signal<File | null>(null);
  protected readonly statuses = [
    { value: 'draft', label: 'Entwurf' },
    { value: 'active', label: 'Aktiv' },
    { value: 'archived', label: 'Archiviert' },
  ];
  protected readonly depots = [
    { value: 'd1', label: 'Hauptdepot' },
    { value: 'd2', label: 'Zweitdepot' },
    { value: 'd3', label: 'Archiv', disabled: true },
  ];
  protected readonly teams = [
    { value: 'a', label: 'Design' },
    { value: 'b', label: 'Engineering' },
    { value: 'c', label: 'Extern', disabled: true },
  ];
  protected readonly drawerOpen = signal(false);
  protected readonly basicModalOpen = signal(false);
  protected readonly formModalOpen = signal(false);
  protected readonly closeModalOpen = signal(false);
  protected readonly activeTab = signal('general');
  protected readonly currentStep = signal('details');
  protected readonly toast = inject(ToastService);
  protected readonly options = [
    { value: 'd1', label: 'Hauptdepot' },
    { value: 'd2', label: 'Zweitdepot' },
    { value: 'd3', label: 'Archiv', disabled: true },
  ];
  protected readonly steps = [
    { value: 'file', label: 'Datei' },
    { value: 'review', label: 'Prüfen' },
    { value: 'group', label: 'Gruppierung' },
    { value: 'finish', label: 'Abschluss' },
  ];
  protected readonly rows = [
    { name: 'Ada Lovelace', role: 'Mathematik', email: 'ada@example.test' },
    { name: 'Grace Hopper', role: 'Informatik', email: 'grace@example.test' },
    { name: 'Linus Torvalds', role: 'Software', email: 'linus@example.test' },
  ];
  protected readonly filteredContacts = computed(() => {
    const query = this.appliedQuery().toLocaleLowerCase('de');
    const role = this.appliedRole();
    return this.rows.filter(
      (contact) =>
        (contact.name.toLocaleLowerCase('de').includes(query) ||
          contact.email.toLocaleLowerCase('de').includes(query)) &&
        (!role || contact.role === role),
    );
  });
  protected readonly pageRows = computed(() => this.rows.slice(this.page(), this.page() + 1));
  protected readonly sortedRows = computed(() =>
    [...this.rows].sort(
      (a, b) => a.name.localeCompare(b.name, 'de') * (this.direction() === 'asc' ? 1 : -1),
    ),
  );
  protected readonly columns: DataTableColumn<{
    name: string;
    role: string;
    email: string;
  }>[] = [
    { key: 'name', header: 'Name', value: (row) => row.name },
    { key: 'role', header: 'Rolle', value: (row) => row.role },
    { key: 'email', header: 'E-Mail', value: (row) => row.email },
  ];
  protected readonly sortableColumns: DataTableColumn<{
    name: string;
    role: string;
    email: string;
  }>[] = [
    { key: 'name', header: 'Name', value: (row) => row.name, sortable: true },
    { key: 'role', header: 'Rolle', value: (row) => row.role },
    { key: 'email', header: 'E-Mail', value: (row) => row.email },
  ];
  protected readonly people: SelectablePerson[] = [
    { id: 'ada', name: 'Ada Lovelace', email: 'ada@example.test', disabled: false },
    { id: 'grace', name: 'Grace Hopper', email: 'grace@example.test', disabled: false },
    { id: 'linus', name: 'Linus Torvalds', email: 'linus@example.test', disabled: true },
  ];
  protected readonly selectableColumns: DataTableColumn<SelectablePerson>[] = [
    { key: 'select', header: 'Auswahl', value: () => '' },
    { key: 'name', header: 'Name', value: (person) => person.name },
    { key: 'email', header: 'E-Mail', value: (person) => person.email },
  ];
  protected readonly feedbackErrors = [
    { kind: 'required', message: 'Bitte einen Namen eingeben.' },
  ];
  protected readonly nameErrors = [{ kind: 'required', message: 'Bitte einen Namen eingeben.' }];
  protected readonly commentErrors = [
    { kind: 'required', message: 'Bitte einen Kommentar eingeben.' },
  ];
  protected readonly changes = [
    { key: 'name', label: 'Name', before: 'Alter Name', after: 'Neuer Name' },
  ];
  protected readonly addedChanges = [
    { key: 'phone', label: 'Telefon', before: null, after: '01234' },
  ];
  protected readonly removedChanges = [{ key: 'fax', label: 'Fax', before: '05678', after: null }];
  protected readonly unchangedChanges = [
    { key: 'city', label: 'Ort', before: 'Berlin', after: 'Berlin' },
  ];
  protected readonly tabs = [
    { value: 'general', label: 'Allgemein' },
    { value: 'details', label: 'Details' },
  ];
  protected readonly disabledTabs = [
    { value: 'general', label: 'Allgemein' },
    { value: 'locked', label: 'Gesperrt', disabled: true },
  ];

  protected hasChanges(): boolean {
    return false;
  }

  protected applyFilters(): void {
    // Die Vorschau verwendet statische Demodaten.
  }

  protected resetFilters(): void {
    this.query.set('');
  }

  protected applyCombinedFilters(): void {
    this.appliedQuery.set(this.combinedQuery().trim());
    this.appliedRole.set(this.combinedRole());
  }

  protected resetCombinedFilters(): void {
    this.combinedQuery.set('');
    this.combinedRole.set('');
    this.applyCombinedFilters();
  }

  protected sortBy(key: string): void {
    this.direction.update((direction) => (direction === 'asc' ? 'desc' : 'asc'));
    this.sort.set(key);
  }

  protected readonly trackPerson = (person: SelectablePerson) => person.id;

  protected togglePerson(person: SelectablePerson, event: Event): void {
    if (person.disabled) return;
    const checked = (event.target as HTMLInputElement).checked;
    this.selectedIds.update((ids) =>
      checked ? [...ids, person.id] : ids.filter((id) => id !== person.id),
    );
  }

  protected tabFor(id: string): 'preview' | 'html' | 'typescript' {
    return this.codeTabs()[id] ?? 'preview';
  }

  protected setTab(id: string, tab: 'preview' | 'html' | 'typescript'): void {
    this.codeTabs.update((tabs) => ({ ...tabs, [id]: tab }));
  }

  protected codeFor(item: ComponentExample): string {
    return this.tabFor(item.id) === 'html'
      ? formatHtmlSnippet(item.html)
      : formatTypeScriptSnippet(item.typescript);
  }

  protected highlightedCode(item: ComponentExample): string {
    return this.highlight(this.codeFor(item), this.tabFor(item.id));
  }

  private highlight(source: string, language: 'preview' | 'html' | 'typescript'): string {
    const pattern =
      language === 'html'
        ? /<!--[\s\S]*?-->|<\/?[\w-]+|\/?\s*>|[\w-]+(?=\s*=)|"[^"\n]*"|'[^'\n]*'|=/g
        : /\/\/[^\n]*|\b(?:import|from|export|const|let|var|function|return|class|new|true|false|null|void|protected|private|public|readonly|interface|type|async|await)\b|\b\d+\b|'[^'\n]*'|"[^"\n]*"|`[^`\n]*`/g;
    const escape = (value: string) =>
      value.replace(
        /[&<>"']/g,
        (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]!,
      );
    let result = '';
    let cursor = 0;
    for (const match of source.matchAll(pattern)) {
      const token = match[0];
      const start = match.index!;
      result += escape(source.slice(cursor, start));
      const category =
        language === 'html'
          ? token.startsWith('<!--')
            ? 'text-content-subtle'
            : token.startsWith('<') || token === '>' || token === '/>'
              ? 'text-brand-strong'
              : token.startsWith('"') || token.startsWith("'")
                ? 'text-success'
                : token === '='
                  ? 'text-content-muted'
                  : 'text-violet-700'
          : token.startsWith('//')
            ? 'text-content-subtle'
            : token.startsWith('"') || token.startsWith("'") || token.startsWith('`')
              ? 'text-success'
              : /^\d/.test(token)
                ? 'text-amber-700'
                : 'text-violet-700';
      result += `<span class="${category}">${escape(token)}</span>`;
      cursor = start + token.length;
    }
    return result + escape(source.slice(cursor));
  }

  protected async copyCode(item: ComponentExample): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.codeFor(item));
      this.copyStatuses.update((statuses) => ({ ...statuses, [item.id]: 'Code kopiert.' }));
    } catch {
      this.copyStatuses.update((statuses) => ({
        ...statuses,
        [item.id]: 'Kopieren ist in diesem Browser nicht verfügbar.',
      }));
    }
  }

  protected selectSource(path: string): void {
    this.selectedSource.set(path);
  }

  protected async copySource(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.sourceText());
      this.sourceCopyStatus.set('Quellcode kopiert.');
    } catch {
      this.sourceCopyStatus.set('Kopieren ist in diesem Browser nicht verfügbar.');
    }
  }

  protected showMultipleToasts(): void {
    this.toast.show('Import gestartet');
    this.toast.show('3 Einträge verarbeitet');
  }
}
