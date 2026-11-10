export interface ApiEntry {
  name: string;
  type: string;
  defaultValue: string;
  description: string;
}

export interface ComponentApi {
  importCode: string;
  inputs?: readonly ApiEntry[];
  outputs?: readonly ApiEntry[];
  slots?: readonly ApiEntry[];
  methods?: readonly ApiEntry[];
  notes?: string;
}

const entry = (
  name: string,
  type: string,
  defaultValue: string,
  description: string,
): ApiEntry => ({ name, type, defaultValue, description });
const output = (name: string, type: string, description: string) =>
  entry(name, type, '—', description);
const slot = (name: string, description: string) => entry(name, 'Content', '—', description);
const importFrom = (symbols: string, path: string) =>
  `import { ${symbols} } from '../shared/${path}';`;

const feedback: ApiEntry[] = [
  entry('hint', 'string', "''", 'Optionaler Hinweis unter dem Feld.'),
  entry('hideLabel', 'boolean', 'false', 'Blendet das Label visuell aus; es bleibt zugänglich.'),
  entry('touched', 'boolean', 'false', 'Steuert zusammen mit invalid die Fehleranzeige.'),
  entry('disabled', 'boolean', 'false', 'Deaktiviert das Feld.'),
  entry('invalid', 'boolean', 'false', 'Markiert den Wert als ungültig.'),
  entry('required', 'boolean', 'false', 'Kennzeichnet einen Pflichtwert.'),
  entry('readonly', 'boolean', 'false', 'Verhindert Änderungen.'),
  entry(
    'errors',
    'readonly WithOptionalFieldTree<ValidationError>[]',
    '[]',
    'Validierungsfehler für die Anzeige.',
  ),
];
const changed: ApiEntry[] = [
  entry(
    'initialValue',
    'string | undefined',
    'undefined',
    'Vergleichswert; ohne Angabe wird der Anfangswert erfasst.',
  ),
  entry(
    'changed',
    'boolean | undefined',
    'undefined',
    'Überschreibt die automatische Änderungserkennung.',
  ),
  entry('changedLabel', 'string', "'GEÄNDERT'", 'Beschriftung des Änderungsstatus.'),
  entry('previousValueLabel', 'string', "'Wert vorher'", 'Beschriftung des vorherigen Werts.'),
];
const touch = output('touch', 'void', 'Wird beim Verlassen des Feldes ausgelöst.');
const controlSize = entry('size', "'small' | 'medium'", "'small'", 'Größe des Eingabefelds.');
const fieldWrapperNote =
  'Label, Änderungsanzeige und Feldmeldungen werden intern durch den gemeinsamen FieldWrapper dargestellt. Ein zusätzlicher Wrapper bei der Verwendung ist nicht nötig.';
const dialogInputs = [
  entry('open', 'model<boolean>', 'false', 'Öffnungszustand; unterstützt [(open)].'),
  entry('title', 'string', 'erforderlich', 'Titel und zugängliche Beschriftung.'),
  entry('closeOnEscape', 'boolean', 'true', 'Schließen per Escape zulassen.'),
  entry('closeOnBackdrop', 'boolean', 'true', 'Schließen per Klick auf den Hintergrund zulassen.'),
  entry('closeOnRequest', 'boolean', 'true', 'Schließanfragen automatisch ausführen.'),
];
const dialogOutputs = [
  output('openChange', 'boolean', 'Änderung des Öffnungszustands (Model).'),
  output(
    'closeRequested',
    "'escape' | 'backdrop' | 'button'",
    'Meldet eine Schließanfrage mit Grund.',
  ),
];
const dialogSlots = [
  slot('Standardinhalt', 'Inhalt des Dialogs.'),
  slot('[dialog-header]', 'Zusätzlicher Inhalt im Kopf.'),
  slot('[dialog-footer]', 'Aktionen im Fuß.'),
];

export const componentApis: Record<string, ComponentApi> = {
  button: {
    importCode: importFrom('ButtonComponent', 'button/button'),
    inputs: [
      entry(
        'variant',
        "'primary' | 'secondary' | 'ghost' | 'link' | 'danger'",
        "'primary'",
        'Visuelle Variante.',
      ),
      entry('size', "'small' | 'medium' | 'large'", "'small'", 'Größe.'),
      entry('icon', 'IconName | undefined', 'undefined', 'Optionales Icon.'),
      entry('iconPosition', "'start' | 'end'", "'start'", 'Position des Icons.'),
      entry('active', 'boolean', 'false', 'Markiert einen ausgewählten Zustand.'),
    ],
    notes:
      'Selektor: button[appButton]. Native Button-Attribute und Events wie type, disabled und click gelten weiterhin.',
    slots: [slot('Standardinhalt', 'Beschriftung des Buttons.')],
  },
  'text-field': {
    importCode: importFrom('TextFieldComponent', 'text-field/text-field'),
    inputs: [
      entry('label', 'string', 'erforderlich', 'Feldbeschriftung.'),
      controlSize,
      entry(
        'monospace',
        'boolean',
        'false',
        'Stellt den Eingabewert in nichtproportionaler Schrift dar.',
      ),
      entry('value', 'model<string>', "''", 'Aktueller Wert; unterstützt [(value)].'),
      entry(
        'type',
        "'text' | 'email' | 'search' | 'url' | 'tel' | 'password'",
        "'text'",
        'Typ des Eingabefelds.',
      ),
      entry('placeholder', 'string', "''", 'Platzhalter.'),
      entry('prefix', 'string', "''", 'Text vor der Eingabe.'),
      entry('maxLength', 'number | undefined', 'undefined', 'Maximale Zeichenanzahl.'),
      ...changed,
      ...feedback,
    ],
    outputs: [output('valueChange', 'string', 'Wertänderung (Model).'), touch],
    notes: `Unterstützt Angular Signal Forms über FormValueControl. ${fieldWrapperNote}`,
  },
  textarea: {
    importCode: importFrom('TextareaComponent', 'textarea/textarea'),
    inputs: [
      entry('label', 'string', 'erforderlich', 'Feldbeschriftung.'),
      controlSize,
      entry('value', 'model<string>', "''", 'Aktueller Wert; unterstützt [(value)].'),
      entry('placeholder', 'string', "''", 'Platzhalter.'),
      entry('rows', 'number', '4', 'Anzahl sichtbarer Zeilen.'),
      entry('maxLength', 'number | undefined', 'undefined', 'Maximale Zeichenanzahl.'),
      ...changed,
      ...feedback,
    ],
    outputs: [output('valueChange', 'string', 'Wertänderung (Model).'), touch],
    notes: `Unterstützt Angular Signal Forms über FormValueControl. ${fieldWrapperNote}`,
  },
  select: {
    importCode: importFrom('SelectComponent, SelectOption', 'select/select'),
    inputs: [
      entry('label', 'string', 'erforderlich', 'Feldbeschriftung.'),
      controlSize,
      entry(
        'options',
        'readonly SelectOption[]',
        'erforderlich',
        'Optionen mit value, label und optional disabled.',
      ),
      entry('value', 'model<string>', "''", 'Ausgewählter Wert; unterstützt [(value)].'),
      entry('placeholder', 'string', "'Auswählen…'", 'Text ohne Auswahl.'),
      entry('searchable', 'boolean', 'false', 'Aktiviert die Suche.'),
      entry('emptyMessage', 'string', "'Keine Treffer'", 'Text bei fehlenden Suchtreffern.'),
      entry('labelSize', "'small' | 'medium'", "'medium'", 'Größe der Beschriftung.'),
      ...changed,
      ...feedback,
    ],
    outputs: [output('valueChange', 'string', 'Wertänderung (Model).'), touch],
    notes: `Unterstützt Angular Signal Forms über FormValueControl. ${fieldWrapperNote}`,
  },
  'multi-select': {
    importCode: importFrom('MultiSelectComponent', 'multi-select/multi-select'),
    inputs: [
      entry('label', 'string', 'erforderlich', 'Feldbeschriftung.'),
      controlSize,
      entry('fullWidth', 'boolean', 'false', 'Füllt die verfügbare Breite aus.'),
      entry('options', 'readonly (string | SelectOption)[]', '[]', 'Verfügbare Optionen.'),
      entry('value', 'model<string[]>', '[]', 'Ausgewählte Werte; unterstützt [(value)].'),
      entry('placeholder', 'string', "'Alle'", 'Text ohne Auswahl.'),
      entry('searchable', 'boolean', 'false', 'Aktiviert die Suche.'),
      entry('maxDisplayedValues', 'number', '2', 'Anzahl einzeln angezeigter Werte.'),
      entry('labelSize', "'small' | 'medium'", "'medium'", 'Größe der Beschriftung.'),
      { ...changed[0], type: 'readonly string[] | undefined' },
      ...changed.slice(1),
      ...feedback,
    ],
    outputs: [output('valueChange', 'string[]', 'Wertänderung (Model).'), touch],
    notes: `SelectOption wird aus select/select exportiert. Unterstützt Angular Signal Forms. ${fieldWrapperNote}`,
  },
  tabs: {
    importCode: `${importFrom('TabsComponent, TabItem', 'tabs/tabs')}\n${importFrom('TabPanelTemplateDirective', 'tabs/tab-panel-template.directive')}`,
    inputs: [
      entry(
        'tabs',
        'readonly TabItem[]',
        'erforderlich',
        'Reiter mit value, label und optional disabled.',
      ),
      entry(
        'selectedTab',
        'model<string>',
        'erforderlich',
        'Aktiver Reiter; unterstützt [(selectedTab)].',
      ),
      entry('orientation', "'horizontal' | 'vertical'", "'horizontal'", 'Ausrichtung der Reiter.'),
      entry('framed', 'boolean', 'true', 'Zeigt den äußeren Rahmen.'),
      entry(
        'selectionMode',
        "'follow' | 'explicit'",
        "'follow'",
        'Aktivierung bei Fokus oder explizit per Tastatur.',
      ),
    ],
    outputs: [output('selectedTabChange', 'string', 'Änderung des aktiven Reiters (Model).')],
    slots: [
      slot(
        'ng-template[appTabPanel]',
        'Paneltemplate; der Direktivenwert entspricht dem Tab-value.',
      ),
    ],
  },
  stepper: {
    importCode: importFrom('StepperComponent, StepItem', 'stepper/stepper'),
    inputs: [
      entry('steps', 'readonly StepItem[]', 'erforderlich', 'Schritte mit value und label.'),
      entry('current', 'string', 'erforderlich', 'Wert des aktuellen Schritts.'),
      entry('completed', 'readonly string[]', '[]', 'Werte abgeschlossener Schritte.'),
      entry('label', 'string', "'Fortschritt'", 'Zugängliche Beschriftung.'),
    ],
    notes:
      'Reine Fortschrittsanzeige; Navigation und Validierung liegen bei der aufrufenden Seite.',
  },
  'file-picker': {
    importCode: importFrom('FilePickerComponent', 'file-picker/file-picker'),
    inputs: [
      entry('label', 'string', "'Datei'", 'Feldbeschriftung.'),
      entry('accept', 'string', "'.csv,text/csv'", 'Erlaubte Dateitypen.'),
      entry('maxBytes', 'number', '10485760', 'Maximale Dateigröße in Bytes.'),
      entry('buttonSize', "'small' | 'medium' | 'large'", "'small'", 'Größe des Auswahlbuttons.'),
      entry('disabled', 'boolean', 'false', 'Deaktiviert Auswahl und Droparea.'),
      entry('value', 'model<File | null>', 'null', 'Ausgewählte Datei; unterstützt [(value)].'),
    ],
    outputs: [
      output('valueChange', 'File | null', 'Änderung der Datei (Model).'),
      output('rejected', 'string', 'Fehlermeldung bei abgelehnter Datei.'),
    ],
  },
  'data-table-toolbar': {
    importCode: importFrom('DataTableToolbarComponent', 'data-table-toolbar/data-table-toolbar'),
    inputs: [
      entry('resetLabel', 'string', "'Zurücksetzen'", 'Beschriftung der Reset-Aktion.'),
      entry('showReset', 'boolean', 'true', 'Zeigt die Reset-Aktion.'),
      entry('showApply', 'boolean', 'true', 'Zeigt die Suchaktion.'),
      entry('compactTop', 'boolean', 'false', 'Reduziert den oberen Innenabstand.'),
      entry('applyDisabled', 'boolean', 'false', 'Deaktiviert die Suchaktion.'),
      entry('buttonSize', "'small' | 'medium' | 'large'", "'small'", 'Größe der Toolbar-Buttons.'),
    ],
    outputs: [
      output('apply', 'void', 'Wird beim Absenden ausgelöst.'),
      output('reset', 'void', 'Wird beim Zurücksetzen ausgelöst.'),
    ],
    slots: [
      slot('[data-table-searches]', 'Suchfelder.'),
      slot('[data-table-filters]', 'Weitere Filter.'),
      slot('[data-table-summary]', 'Zusammenfassung.'),
      slot('[data-table-actions]', 'Zusätzliche Aktionen.'),
    ],
  },
  'data-table': {
    importCode: `${importFrom('DataTableComponent, DataTableColumn', 'data-table/data-table')}\n${importFrom('DataTableCellDirective', 'data-table/data-table-cell.directive')}\n${importFrom('DataTableHeaderDirective', 'data-table/data-table-header.directive')}`,
    inputs: [
      entry('rows', 'readonly T[]', 'erforderlich', 'Zeilen der aktuellen Seite.'),
      entry(
        'columns',
        'readonly DataTableColumn<T>[]',
        'erforderlich',
        'Spalten mit key, header, value und optional sortable.',
      ),
      entry('framed', 'boolean', 'true', 'Zeigt den äußeren Rahmen.'),
      entry('striped', 'boolean', 'true', 'Färbt jede zweite Datenzeile abwechselnd.'),
      entry('pagination', 'boolean', 'true', 'Zeigt die Seitensteuerung.'),
      entry('total', 'number', '0', 'Gesamtzahl der Ergebnisse.'),
      entry('totalPages', 'number', '0', 'Anzahl der Seiten.'),
      entry('page', 'number', '0', 'Nullbasierte aktuelle Seite.'),
      entry('pageSize', 'number', '8', 'Zeilen pro Seite.'),
      entry('pageSizeOptions', 'readonly number[]', '[8, 16, 32]', 'Wählbare Seitengrößen.'),
      entry('pageWindowSize', 'number', '5', 'Maximal sichtbare Seitennummern.'),
      entry('sort', 'string', "''", 'Sortierschlüssel.'),
      entry('direction', "'asc' | 'desc'", "'asc'", 'Sortierrichtung.'),
      entry('loading', 'boolean', 'false', 'Zeigt den Ladezustand.'),
      entry('error', 'string | null', 'null', 'Fehlermeldung.'),
      entry('emptyMessage', 'string', "'Keine Einträge gefunden.'", 'Text bei leerem Ergebnis.'),
      entry('caption', 'string', "'Datenübersicht'", 'Zugängliche Tabellenbeschriftung.'),
      entry('trackBy', '(row: T) => unknown', '(row) => row', 'Stabiler Schlüssel für Zeilen.'),
    ],
    outputs: [
      output('sortChange', 'string', 'Angeforderter Sortierschlüssel.'),
      output('pageChange', 'number', 'Angeforderte nullbasierte Seite.'),
      output('pageSizeChange', 'number', 'Angeforderte Seitengröße.'),
    ],
    slots: [
      slot(
        'ng-template[appDataTableCell]',
        'Zelltemplate für den angegebenen Spaltenschlüssel; let-row enthält die Zeile.',
      ),
      slot('ng-template[appDataTableHeader]', 'Kopftemplate für den angegebenen Spaltenschlüssel.'),
    ],
    notes:
      'Sortierung und Pagination werden von der aufrufenden Seite umgesetzt. DataTableColumn unterstützt width und minWidth als CSS-Breiten; bei Platzmangel scrollt die Tabelle horizontal.',
  },
  'inline-message': {
    importCode: importFrom('InlineMessageComponent', 'inline-message/inline-message'),
    inputs: [
      entry('severity', "'info' | 'success' | 'warning' | 'error'", "'info'", 'Art der Meldung.'),
      entry('title', 'string', "''", 'Optionaler Titel.'),
    ],
    slots: [
      slot('Standardinhalt', 'Meldungstext.'),
      slot('[message-actions]', 'Zusätzliche Aktionen.'),
    ],
  },
  'diff-view': {
    importCode: importFrom('DiffViewComponent, DiffEntry', 'diff-view/diff-view'),
    inputs: [
      entry(
        'entries',
        'readonly DiffEntry[]',
        'erforderlich',
        'Vergleichseinträge mit key, label, before, after und optional changed.',
      ),
      entry('caption', 'string', "'Wertvergleich'", 'Zugängliche Tabellenbeschriftung.'),
      entry('beforeLabel', 'string', "'Aktueller Stand'", 'Überschrift der Vorher-Spalte.'),
      entry('afterLabel', 'string', "'Beantragter Stand'", 'Überschrift der Nachher-Spalte.'),
    ],
  },
  'side-drawer': {
    importCode: importFrom('SideDrawerComponent', 'side-drawer/side-drawer'),
    inputs: dialogInputs,
    outputs: dialogOutputs,
    slots: dialogSlots,
  },
  modal: {
    importCode: importFrom('ModalComponent', 'modal/modal'),
    inputs: dialogInputs,
    outputs: dialogOutputs,
    slots: dialogSlots,
  },
  toast: {
    importCode: importFrom('ToastService, ToastOutletComponent', 'toast/toast'),
    methods: [
      entry(
        'show(text)',
        '(text: string) => number',
        '—',
        'Zeigt eine Meldung und liefert ihre ID.',
      ),
      entry('dismiss(id)', '(id: number) => void', '—', 'Entfernt eine Meldung anhand ihrer ID.'),
    ],
    notes:
      'ToastOutletComponent zeigt die Meldungen des injizierbaren ToastService an. Meldungen werden explizit geschlossen.',
  },
};

componentApis['data-table-combined'] = {
  importCode: [
    importFrom('DataTableToolbarComponent', 'data-table-toolbar/data-table-toolbar'),
    importFrom('DataTableComponent, DataTableColumn', 'data-table/data-table'),
    importFrom('TextFieldComponent', 'text-field/text-field'),
    importFrom('SelectComponent', 'select/select'),
  ].join('\n'),
  inputs: [
    ...(componentApis['data-table-toolbar'].inputs ?? []),
    ...(componentApis['data-table'].inputs ?? []),
  ],
  outputs: [
    ...(componentApis['data-table-toolbar'].outputs ?? []),
    ...(componentApis['data-table'].outputs ?? []),
  ],
  slots: [
    ...(componentApis['data-table-toolbar'].slots ?? []),
    ...(componentApis['data-table'].slots ?? []),
  ],
  notes:
    'Die Toolbar meldet Such- und Reset-Aktionen; die aufrufende Seite filtert die Daten und übergibt sie an die Tabelle. Die vollständigen Einzel-APIs stehen auch auf den jeweiligen Komponentenseiten.',
};
