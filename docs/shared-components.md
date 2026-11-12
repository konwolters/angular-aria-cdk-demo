# Shared-Komponenten

Diese Seite dokumentiert die wiederverwendbaren Angular-Komponenten unter
`frontend/src/app/shared/`. Die Komponenten sind standalone und verwenden Signals. Für
Komponenten mit `FormValueControl` ist die Integration in Angular Signal Forms beschrieben.

## Schnellstart

Verwende die Komponenten direkt in der `imports`-Liste einer Standalone-Komponente:

```ts
import { FormField } from '@angular/forms/signals';
import { ButtonComponent } from '../shared/button/button';
import { TextFieldComponent } from '../shared/text-field/text-field';

@Component({
  imports: [FormField, ButtonComponent, TextFieldComponent],
  template: `
    <app-text-field label="Teamname" [formField]="teamForm.name" />
    <button appButton variant="primary" type="submit">Speichern</button>
  `,
})
export class TeamEditorComponent {}
```

Die konkreten Imports und Dateipfade stehen bei den jeweiligen Komponenten weiter unten.

## Gemeinsamer Feldrahmen

`TextField`, `Textarea`, `Select` und `MultiSelect` verwenden intern den gemeinsamen
`FieldWrapperComponent` aus `frontend/src/app/shared/field-wrapper/`. Er stellt Label,
Änderungs-Badge, vorherigen Wert sowie über `FieldMessagesComponent` Hinweis und Fehlermeldungen
einheitlich dar. Der Wrapper ist ein interner Baustein: Aufrufende verwenden weiterhin die
jeweilige Feldkomponente und deren bestehende Inputs; ein zusätzlicher Wrapper im eigenen Template
ist nicht nötig.

Die Feldkomponenten bleiben für ihren Wert, Signal Forms, Zustände und ihre jeweilige Tastatur- und
Auswahllogik verantwortlich. Sie übergeben dem Wrapper den anzuzeigenden Zustand und eine eindeutige
ID für die Meldungen. Textfeld und Textarea verbinden das native Label über `for` mit dem jeweiligen
Eingabeelement; die Select-Varianten vergeben ihren zugänglichen Namen am Combobox-Element. Alle
vier verknüpfen Hinweise und Fehlermeldungen über `aria-describedby` mit dem Bedienelement.
Beim Erweitern oder Ändern des Feldrahmens müssen diese Verknüpfungen erhalten bleiben.

Die vier Feldkomponenten verwenden standardmäßig `size="small"`; mit `size="medium"` sind sie
größer darstellbar. Für mehrzeilige Felder verändert die Größe die Mindesthöhe, während `rows` die
Zeilenzahl steuert. `MultiSelect` verwendet standardmäßig eine feste Breite; mit `[fullWidth]="true"`
füllt es die verfügbare Breite seines Containers aus. Damit müssen keine internen Design-Tokens im
Template überschrieben werden.

## Kompakte Typografie und Layout

Die globalen Design-Tokens verwenden eine kompakte, lesbare Darstellung: Eingaben, Selects,
kleine/mittlere Buttons und Tabellenwerte haben 13 px, Zusatztexte 12 px und kleine
Seitenüberschriften 16 px bei einer Browser-Basisschrift von 16 px. Die Größen sind in `rem`
definiert und skalieren mit den Browsereinstellungen. Kompaktheit entsteht durch reduzierte
Abstände, nicht durch unterschiedliche Schriftgrößen nebeneinanderliegender Bedienelemente.
Inter Variable wird lokal über `@fontsource-variable/inter` mit ausgeliefert; es werden keine
externen Font-Dienste benötigt. Platzhalter und Feldgrenzen verwenden kontrastreichere Tokens.

Tabellen verwenden automatisches Spaltenlayout und einen eigenen horizontalen Scrollbereich.
`width` beschreibt die gewünschte Spaltenbreite, `minWidth` eine optionale Mindestbreite;
bei Platzmangel wächst die Tabelle statt Inhalte benachbarter Zellen zu überlagern.

## Änderungsverfolgung und Readonly-Felder

`TextFieldComponent`, `TextareaComponent`, `SelectComponent` und `MultiSelectComponent` können
Änderungen zwischen einem ursprünglichen und einem aktuellen Wert anzeigen. Bei Textfeldern,
Textareas und Single-Selects ist der ursprüngliche Wert standardmäßig der Wert beim ersten Rendern.
Bei asynchron geladenen Werten sollte `initialValue` explizit auf den unveränderlichen
Ausgangswert gesetzt werden.

```html
<app-text-field
  label="Teamname"
  [value]="currentName()"
  [initialValue]="version3().name"
  [changed]="changedFields().has('name')"
  [readonly]="true"
  previousValueLabel="Version 3"
/>
```

Das zeigt beispielsweise **GEÄNDERT** neben dem Label und darunter `Version 3: Customer
Experience`. `changed` ist optional: Ohne Vorgabe wird anhand von `initialValue` und dem aktuellen
Wert verglichen. Wenn `changed` explizit auf `true` oder `false` gesetzt wird, hat diese Vorgabe
Vorrang. So kann eine Versionsansicht exakt die vom Änderungsprotokoll gelieferten Felder markieren.
Die automatische Erkennung zeigt ein Badge nur dann, wenn der ursprüngliche Wert nicht leer ist;
bei leeren Ausgangswerten kann die Historie `changed` explizit setzen.

`readonly` verhindert die Bearbeitung und Fokussierung. Textfelder und Textareas behalten dabei die
native Readonly-Semantik (nicht `disabled`). Die Selects bleiben geschlossen.

Für den Zusatztext unter dem Feld ist `previousValueLabel` frei wählbar. Standard ist `Wert vorher`;
mit `previousValueLabel="Version 3"` erscheint `Version 3: <ursprünglicher Wert>`. Das Badge kann
über `changedLabel` umbenannt werden; Standard ist `GEÄNDERT`.

### Gemeinsame Änderungs-Inputs

| Input | Typ | Standard | Bedeutung |
| --- | --- | --- | --- |
| `initialValue` | `string` bzw. `readonly string[]` | automatisch erfasst | Ausgangswert für den Vergleich |
| `changed` | `boolean` | automatisch berechnet | Manueller Änderungsstatus; wenn gesetzt, überschreibt er den Vergleich |
| `changedLabel` | `string` | `GEÄNDERT` | Text des farbigen Badges neben dem Label |
| `previousValueLabel` | `string` | `Wert vorher` | Text vor dem ursprünglichen Wert |
| `readonly` | `boolean` | `false` | Nicht editierbare, graue Darstellung |

Bei einem Multi-Select ist `initialValue` eine Liste. Die Listen werden als Auswahlmengen
verglichen; die Reihenfolge der Werte ist dabei unerheblich.

## `button[appButton]`

Import: `frontend/src/app/shared/button/button.ts`

`ButtonComponent` ergänzt ein natives `<button>` um einheitliche Styles. Das native Element sorgt
weiterhin für Formularverhalten, Tastaturbedienung und Barrierefreiheit.

```html
<button appButton variant="primary" size="medium" icon="plus" (click)="add()">
  Neuer Eintrag
</button>

<button appButton variant="secondary" size="small" icon="refresh" iconPosition="end">
  Aktualisieren
</button>
```

| Input | Typ | Standard |
| --- | --- | --- |
| `variant` | `primary \| secondary \| ghost \| link \| danger` | `primary` |
| `size` | `small \| medium \| large` | `small` |
| `icon` | `IconName` | kein Icon |
| `iconPosition` | `start \| end` | `start` |
| `active` | `boolean` | `false` |

## `app-text-field`

Import: `frontend/src/app/shared/text-field/text-field.ts`

Einzeiliges Texteingabefeld, das `FormValueControl<string>` implementiert und somit direkt mit
Signal Forms verwendet werden kann.

```html
<app-text-field
  label="Teamname"
  placeholder="Customer Experience"
  [formField]="teamForm.name"
/>

<app-text-field
  label="Team-Kürzel"
  prefix="teams/"
  [value]="currentSlug()"
  [initialValue]="previousSlug()"
  [changed]="true"
  [readonly]="true"
  previousValueLabel="Version 3"
/>
```

| Input / Model | Typ | Standard | Bedeutung |
| --- | --- | --- | --- |
| `label` | `string` | erforderlich | Sichtbares und zugängliches Label |
| `size` | `small \| medium` | `small` | Höhe des Eingabefelds |
| `type` | `text \| email \| search \| url \| tel \| password` | `text` | HTML-Eingabetyp |
| `monospace` | `boolean` | `false` | Zeigt die Eingabe in nichtproportionaler Schrift (Consolas mit Fallbacks) |
| `placeholder` | `string` | leer | Platzhaltertext |
| `prefix` | `string` | leer | Optionaler, nicht editierbarer Präfix im Feld |
| `maxLength` | `number \| undefined` | `undefined` | Maximale Zeichenanzahl der Eingabe |
| `value` | `ModelSignal<string>` | `''` | Feldwert; Signal-Forms-kompatibel |
| `initialValue` | `string \| undefined` | automatisch erfasst | Ausgangswert für den Vergleich |
| `changed` | `boolean \| undefined` | automatisch berechnet | Manueller Änderungsstatus; überschreibt den Vergleich, wenn gesetzt |
| `changedLabel` | `string` | `GEÄNDERT` | Badge neben dem Label |
| `previousValueLabel` | `string` | `Wert vorher` | Text vor dem ursprünglichen Wert |
| `readonly` | `boolean` | `false` | Nicht editierbar und nicht fokussierbar |
| `disabled` | `boolean` | `false` | Deaktiviert das Feld |
| `required` | `boolean` | `false` | Markiert das Feld als erforderlich |
| `invalid` | `boolean` | `false` | Setzt `aria-invalid` |
| `touched` | `boolean` | `false` | Signal-Forms-Zustand |
| `errors` | `readonly WithOptionalFieldTree<ValidationError>[]` | `[]` | Signal-Forms-Fehlerzustand |
| `touch` | `Output<void>` | — | Wird bei Blur ausgelöst |

## `app-textarea`

Import: `frontend/src/app/shared/textarea/textarea.ts`

Mehrzeiliges Feld mit derselben Änderungsanzeige und Signal-Forms-Integration wie `app-text-field`.

```html
<app-textarea
  label="Beschreibung"
  placeholder="Wofür ist das Team verantwortlich?"
  [rows]="5"
  [formField]="teamForm.description"
/>
```

| Input / Model | Typ | Standard | Bedeutung |
| --- | --- | --- | --- |
| `label` | `string` | erforderlich | Sichtbares Label |
| `size` | `small \| medium` | `small` | Mindesthöhe des mehrzeiligen Felds |
| `placeholder` | `string` | leer | Platzhaltertext |
| `rows` | `number` | `4` | Native Zeilenanzahl |
| `maxLength` | `number \| undefined` | `undefined` | Maximale Zeichenanzahl der Eingabe |
| `value` | `ModelSignal<string>` | `''` | Feldwert; Signal-Forms-kompatibel |
| `initialValue` | `string \| undefined` | automatisch erfasst | Ausgangswert für den Vergleich |
| `changed` | `boolean \| undefined` | automatisch berechnet | Manueller Änderungsstatus; überschreibt den Vergleich, wenn gesetzt |
| `changedLabel` | `string` | `GEÄNDERT` | Badge neben dem Label |
| `previousValueLabel` | `string` | `Wert vorher` | Text vor dem ursprünglichen Wert |
| `readonly` | `boolean` | `false` | Schaltet das Feld in den nicht editierbaren Zustand |
| `disabled` | `boolean` | `false` | Deaktiviert das Feld |
| `required` | `boolean` | `false` | Markiert das Feld als erforderlich |
| `invalid` | `boolean` | `false` | Setzt `aria-invalid` |
| `touched` | `boolean` | `false` | Signal-Forms-Zustand |
| `errors` | `readonly WithOptionalFieldTree<ValidationError>[]` | `[]` | Signal-Forms-Fehlerzustand |
| `touch` | `Output<void>` | — | Wird bei Blur ausgelöst |

## `app-select`

Import: `frontend/src/app/shared/select/select.ts`

Single-Select auf Angular Aria und CDK Overlay. Implementiert `FormValueControl<string>`.

```ts
readonly departments: readonly SelectOption[] = [
  { value: 'support', label: 'Support' },
  { value: 'engineering', label: 'Engineering' },
];
```

```html
<app-select label="Bereich" [options]="departments" [formField]="teamForm.department" />

<app-select
  label="Bereich"
  labelSize="medium"
  [options]="departments"
  [value]="currentDepartment()"
  [initialValue]="previousDepartment()"
  [changed]="true"
  [readonly]="true"
  previousValueLabel="Version 3"
/>
```

`SelectOption` hat `value: string`, `label: string` und optional `disabled: boolean` und
`shortLabel: string` (Kurztext für die Multi-Select-Zusammenfassung).

Optionen mit `disabled: true` bleiben sichtbar, werden aber bei Single- und Multi-Selects
grau hinterlegt und mit gedämpfter Schrift sowie einem Nicht-erlaubt-Mauszeiger dargestellt.
Sie sind über `aria-disabled` gekennzeichnet, können nicht ausgewählt werden und reagieren
nicht auf Mausklicks. Es erscheint kein zusätzlicher Text wie „Nicht verfügbar“.

Mit `[searchable]="true"` wird der Select zur durchsuchbaren Einzelauswahl. Suchtext und
ausgewählter Wert sind getrennt: Freitext wird nicht als Wert übernommen.
`emptyMessage` definiert den Leerzustand (Standard `Keine Treffer`).

| Input / Model | Typ | Standard | Bedeutung |
| --- | --- | --- | --- |
| `label` | `string` | erforderlich | Sichtbares Label und zugänglicher Name |
| `size` | `small \| medium` | `small` | Höhe des Selects |
| `options` | `readonly SelectOption[]` | erforderlich | Auswahloptionen |
| `searchable` | `boolean` | `false` | Aktiviert das Suchfeld; Freitext wird nicht als Wert übernommen |
| `emptyMessage` | `string` | `Keine Treffer` | Anzeige bei fehlenden Suchtreffern |
| `placeholder` | `string` | `Auswählen…` | Anzeige ohne Auswahl |
| `labelSize` | `small \| medium` | `medium` | Größe des Labels |
| `value` | `ModelSignal<string>` | `''` | Aktueller Wert; Signal-Forms-kompatibel |
| `initialValue` | `string \| undefined` | automatisch erfasst | Ausgangswert für den Vergleich |
| `changed` | `boolean \| undefined` | automatisch berechnet | Manueller Änderungsstatus; überschreibt den Vergleich, wenn gesetzt |
| `changedLabel` | `string` | `GEÄNDERT` | Badge neben dem Label |
| `previousValueLabel` | `string` | `Wert vorher` | Text vor dem ursprünglichen Optionslabel |
| `readonly` | `boolean` | `false` | Verhindert Öffnen und Ändern |
| `disabled` | `boolean` | `false` | Deaktiviert den Select |
| `required` | `boolean` | `false` | Markiert den Select als erforderlich |
| `invalid` | `boolean` | `false` | Setzt `aria-invalid` |
| `touched` | `boolean` | `false` | Signal-Forms-Zustand |
| `errors` | `readonly WithOptionalFieldTree<ValidationError>[]` | `[]` | Signal-Forms-Fehlerzustand |
| `touch` | `Output<void>` | — | Wird bei Blur/Schließen ausgelöst |

Das Overlay öffnet nach unten, wenn genügend Platz vorhanden ist, sonst nach oben. Die
Seitengrößenauswahl der Tabelle verwendet denselben Select.

## `app-multi-select`

Import: `frontend/src/app/shared/multi-select/multi-select.ts`

Multi-Select mit Angular Aria und optionaler Suche. `value` ist ein Array technischer Werte;
die Komponente implementiert `FormValueControl<string[]>` und unterstützt `[formField]`.
Die bisherige `selected`-API wurde durch `value` ersetzt; alle Demo-Aufrufer sind migriert.

```html
<app-multi-select
  label="Servicebereiche"
  [options]="serviceAreas"
  [(value)]="selectedAreas"
  [searchable]="true"
  [maxDisplayedValues]="1"
/>
```

Versionsansicht:

```html
<app-multi-select
  label="Servicebereiche"
  [options]="serviceAreas"
  [value]="currentAreas()"
  [initialValue]="previousAreas()"
  [changed]="changedFields().has('serviceAreas')"
  [readonly]="true"
  previousValueLabel="Version 3"
/>
```

| Input / Model | Typ | Standard | Bedeutung |
| --- | --- | --- | --- |
| `label` | `string` | erforderlich | Sichtbares Label und zugänglicher Name |
| `options` | `readonly (string \| SelectOption)[]` | `[]` | Werte und Labels; Strings bleiben als Kurzform unterstützt |
| `size` | `small \| medium` | `small` | Höhe des Multi-Selects |
| `fullWidth` | `boolean` | `false` | Füllt die verfügbare Containerbreite statt der Standardbreite aus |
| `value` | `ModelSignal<string[]>` | `[]` | Ausgewählte technische Werte, zweiseitig bindbar und Signal-Forms-kompatibel |
| `searchable` | `boolean` | `false` | Zeigt ein Suchfeld im Auslöser |
| `maxDisplayedValues` | `number` | `2` | Maximale Inline-Anzahl; danach wird die Auswahl zusammengefasst |
| `labelSize` | `small \| medium` | `medium` | Größe des Labels |
| `initialValue` | `readonly string[] \| undefined` | beim ersten Rendern erfasst | Ursprüngliche Auswahl |
| `changed` | `boolean \| undefined` | automatisch berechnet | Manueller Änderungsstatus; überschreibt den Vergleich, wenn gesetzt |
| `changedLabel` | `string` | `GEÄNDERT` | Badge neben dem Label |
| `previousValueLabel` | `string` | `Wert vorher` | Text vor den ursprünglichen Werten |
| `readonly` | `boolean` | `false` | Verhindert Öffnen und Ändern |

Zusätzlich: `placeholder` (Standard `Alle`), `disabled`, `required`, `invalid`, `touched`,
`errors` und `touch`, analog zum Single-Select. `shortLabel` wird nur in der kompakten
Auswahlzusammenfassung verwendet; das vollständige Label bleibt für die zugängliche Benennung erhalten.

## `app-icon`

Ein dekoratives, skalierbares SVG-Icon. Die Farbe folgt über `currentColor` der Textfarbe des
umgebenden Elements.

Import: `frontend/src/app/shared/icon/icon.ts`

```html
<app-icon name="search" [size]="16" />
```

| Input | Typ | Standard |
| --- | --- | --- |
| `name` | `IconName` | erforderlich |
| `size` | `number` | `18` Pixel |

`IconName` umfasst `activity`, `arrow-left`, `arrow-right`, `arrow-up`, `check`, `chevron-down`,
`close`, `grid`, `plus`, `receipt`, `refresh`, `search`, `settings`, `layers`, `sort`,
`sort-ascending`, `sort-descending` und `tabs`. Das SVG ist dekorativ (`aria-hidden`).

## `app-data-table-toolbar`

Eine Toolbar mit Suchfeld, Suchen- und Zurücksetzen-Aktionen sowie einem Projektionsbereich für
Filterkomponenten.

Import: `frontend/src/app/shared/data-table-toolbar/data-table-toolbar.ts`

```html
<app-data-table-toolbar
  (apply)="applyFilters()"
  (reset)="resetFilters()"
>
  <div data-table-searches class="flex flex-wrap items-end gap-3">
    <app-text-field label="Bestellnummer" placeholder="z. B. 1042" [(value)]="orderNumber" />
    <app-text-field label="Kunde" placeholder="Name oder E-Mail" [(value)]="customerName" />
  </div>
  <div data-table-filters>
    <app-multi-select label="Status" [options]="statuses" [(value)]="selectedStatuses" />
  </div>
</app-data-table-toolbar>
```

Die Toolbar enthält keine fest eingebauten Suchfelder. In `data-table-searches` können beliebig viele
Suchfelder oder andere Suchkriterien stehen; ihre Werte gehören zur aufrufenden Komponente und
werden in `(apply)` bzw. `(reset)` verarbeitet. Filter werden unabhängig davon beliebig in
`data-table-filters` projiziert. Beide Bereiche liegen im Toolbar-Formular, daher löst Enter in
einem Suchfeld ebenfalls die Suche aus.

| Input / Output | Typ | Standard | Bedeutung |
| --- | --- | --- | --- |
| `resetLabel` | `string` | `Zurücksetzen` | Text der Reset-Schaltfläche |
| `showReset` | `boolean` | `true` | Zeigt die Reset-Schaltfläche |
| `showApply` | `boolean` | `true` | Zeigt die Such-Schaltfläche; das Formular kann weiterhin mit Enter abgesendet werden |
| `compactTop` | `boolean` | `false` | Reduziert den oberen Innenabstand der Leiste |
| `buttonSize` | `small \| medium \| large` | `small` | Größe der Such- und Reset-Schaltflächen |
| `applyDisabled` | `boolean` | `false` | Deaktiviert die Suchaktion |
| `apply`, `reset` | `Output<void>` | — | Suche übernehmen bzw. Filter zurücksetzen |

Suchfelder und Filter werden über Content Projection mit `data-table-searches` bzw.
`data-table-filters` eingesetzt. `data-table-summary` nimmt Treffer-/Auswahlzahlen auf,
`data-table-actions` weitere Schaltflächen (immer `type="button"`, sofern sie nicht suchen sollen).
Die Toolbar löst Aktionen aus, verwaltet aber keine Feldwerte.

## `app-data-table`

Import: `frontend/src/app/shared/data-table/data-table.ts`

`DataTableColumn<T>` besteht aus `key: string`, `header: string`, `value: (row: T) => string` und
optional `sortable: boolean`, `width: string` (gewünschte CSS-Spaltenbreite) und `minWidth: string`
(CSS-Mindestbreite). Eigene Zellinhalte können mit `appDataTableCell` projiziert werden.
Für projizierte Zellen importiert die aufrufende Komponente `DataTableCellDirective` aus
`shared/data-table/data-table-cell.directive`.

```ts
readonly customerColumns: readonly DataTableColumn<Customer>[] = [
  { key: 'name', header: 'Name', value: (customer) => customer.name, sortable: true },
  { key: 'status', header: 'Status', value: (customer) => customer.status },
];
readonly trackCustomer = (customer: Customer) => customer.id;
```

```html
<app-data-table
  [rows]="rows()"
  [columns]="customerColumns"
  [total]="total()"
  [totalPages]="totalPages()"
  [page]="query().page"
  [pageSize]="query().size"
  [sort]="query().sort"
  [direction]="query().direction"
  [loading]="loading()"
  [trackBy]="trackCustomer"
  (sortChange)="sortBy($event)"
  (pageChange)="setPage($event)"
  (pageSizeChange)="setPageSize($event)"
>
  <ng-template appDataTableCell="status" let-customer>
    <span>{{ customer.status }}</span>
  </ng-template>
</app-data-table>
```

Die Zellen-Direktive `appDataTableCell` wird auf ein `ng-template` gesetzt und ordnet es über den
Spaltenschlüssel einer Spalte zu. Im Template ist die Zeile über `let-row` verfügbar.

| Input | Typ | Standard | Bedeutung |
| --- | --- | --- | --- |
| `appDataTableCell` | `string` | erforderlich | `key` der Spalte, die dieses Template rendert |

| Input / Output | Typ | Standard | Bedeutung |
| --- | --- | --- | --- |
| `rows` | `readonly T[]` | erforderlich | Aktuelle Tabellenzeilen |
| `columns` | `readonly DataTableColumn<T>[]` | erforderlich | Spaltendefinitionen |
| `framed` | `boolean` | `true` | Zeigt Rahmen und Kartenhintergrund |
| `striped` | `boolean` | `true` | Hebt jede zweite Datenzeile farblich hervor; mit `false` abschaltbar |
| `compact` | `boolean` | `false` | Kleinere Zell- und Leerzustandsabstände; Zellen vertikal mittig |
| `layout` | `'auto' \| 'fixed'` | `'auto'` | Bei `fixed` richten sich Spaltenbreiten nicht nach dem Zellinhalt |
| `pagination` | `boolean` | `true` | Zeigt Paging und Ergebniszähler; für lokale Detail-/Vergleichslisten abschaltbar |
| `total` | `number` | `0` | Gesamtzahl aller gefilterten Zeilen |
| `totalPages` | `number` | `0` | Anzahl der Seiten |
| `page` | `number` | `0` | Aktuelle nullbasierte Seite; `0` ist die erste Seite |
| `pageSize` | `number` | `8` | Zeilen pro Seite |
| `pageSizeOptions` | `readonly number[]` | `[8, 16, 32]` | Werte für den Seitengrößen-Select |
| `pageWindowSize` | `number` | `5` | Maximal sichtbare Seitenzahlen |
| `sort` | `string` | `''` | Aktiver Sortierschlüssel |
| `direction` | `'asc' \| 'desc'` | `'asc'` | Sortierrichtung |
| `loading` | `boolean` | `false` | Setzt den Ladezustand und deaktiviert Paging |
| `error` | `string \| null` | `null` | Fehlermeldung unter der Tabelle |
| `emptyMessage` | `string` | `Keine Einträge gefunden.` | Text bei leerer Tabelle |
| `caption` | `string` | `Datenübersicht` | Zugängliche Tabellenbeschreibung |
| `trackBy` | `(row: T) => unknown` | Identität der Zeile | Schlüssel zur Wiederverwendung von Zeilen |
| `sortChange` | `Output<string>` | — | Wird mit dem angeklickten Sortierschlüssel ausgelöst |
| `pageChange` | `Output<number>` | — | Wird mit der neuen nullbasierten Seite ausgelöst |
| `pageSizeChange` | `Output<number>` | — | Wird mit der neuen Seitengröße ausgelöst |

### Spaltenkonfiguration: `DataTableColumn<T>`

| Eigenschaft | Typ | Standard | Bedeutung |
| --- | --- | --- | --- |
| `key` | `string` | erforderlich | Eindeutiger Schlüssel für Spalte und Templates |
| `header` | `string` | erforderlich | Sichtbare Spaltenüberschrift |
| `value` | `(row: T) => string` | erforderlich | Einfacher Textwert; ein Zelltemplate ersetzt die Darstellung |
| `sortable` | `boolean` | `false` | Zeigt einen Sortierbutton; die Seite übernimmt das Sortieren |
| `width` | `string \| undefined` | `undefined` | Gewünschte CSS-Breite, z. B. `16rem` oder `25%`; keine starre Obergrenze |
| `minWidth` | `string \| undefined` | `undefined` | CSS-Mindestbreite, z. B. `14rem` |

```ts
readonly customerColumns: readonly DataTableColumn<Customer>[] = [
  { key: 'name', header: 'Name', value: customer => customer.name, width: '16rem', minWidth: '14rem' },
  { key: 'status', header: 'Status', value: customer => customer.status, width: '6rem' },
];
```

`width` und `minWidth` sind Eigenschaften einer Spalte im `columns`-Input, keine separaten
Tabellen-Inputs. Die Tabelle verwendet automatisches Layout: Inhalte und Mindestbreiten können
die gewünschte Breite vergrößern. Bei Platzmangel scrollt der Tabellenbereich horizontal.

Paging umfasst erste, vorherige, nummerierte, nächste und letzte Seite.
Mit `ng-template[appDataTableHeader]="spaltenschlüssel"` lassen sich eigene Header projizieren
(Import: `shared/data-table/data-table-header.directive`). Ein eigener Header ersetzt auch den
eingebauten Sortierbutton der Spalte. Zeilenauswahl ist über Zelltemplates möglich;
die Auswahl über stabile IDs gehört der aufrufenden Komponente.

### Server-Abfrage

`ServerTableService.search<T>(endpoint, query)` akzeptiert die API-URL und ein
`Signal<TableQuery>`. Das Ergebnis enthält `value`, `isLoading` und `error`; während einer neuen
Abfrage bleibt der letzte geladene Tabellenwert sichtbar.

| Parameter / Ergebnis | Typ | Bedeutung |
| --- | --- | --- |
| `endpoint` | `string` | API-Pfad, beispielsweise `/api/customers` |
| `query` | `Signal<TableQuery>` | Reaktiver Such-, Sortier-, Filter- und Pagingzustand |
| `value` | `Signal<TablePage<T>>` | Letztes geladenes Seitenergebnis |
| `isLoading` | `Signal<boolean>` | Lädt gerade eine neue Anfrage |
| `error` | `Signal<unknown>` | Fehler der aktuellen Anfrage oder `undefined` |

`TableQuery` hat `page`, `size`, `search`, `sort`, `direction: 'asc' | 'desc'` und
`filters: Record<string, string[]>`. `TablePage<T>` enthält `content`, `totalElements`, `totalPages`,
`number` und `size`.

## `app-modal`

Ein zentrierter CDK-Dialog mit Content Projection, Fokusverwaltung und Fokuswiederherstellung.

Import: `frontend/src/app/shared/modal/modal.ts`

```html
<app-modal [(open)]="modalOpen" title="Neuen Eintrag anlegen">
  <p>Hier steht der Dialoginhalt.</p>
</app-modal>
```

| Input / Model | Typ | Standard | Bedeutung |
| --- | --- | --- | --- |
| `title` | `string` | erforderlich | Dialogtitel und zugängliche Beschriftung |
| `open` | `ModelSignal<boolean>` | `false` | Sichtbarkeit; mit `[(open)]` zweiseitig bindbar |

## `app-side-drawer`

Ein rechts angeordneter CDK-Dialogbereich mit Content Projection und Fokusverwaltung.

Import: `frontend/src/app/shared/side-drawer/side-drawer.ts`

```html
<app-side-drawer [(open)]="drawerOpen" title="Details">
  <p>Hier stehen die Details.</p>
</app-side-drawer>
```

| Input / Model | Typ | Standard | Bedeutung |
| --- | --- | --- | --- |
| `title` | `string` | erforderlich | Drawer-Titel und zugängliche Beschriftung |
| `width` | `string` | `56rem` | Gewünschte CSS-Breite, z. B. `48rem`; maximal die Fensterbreite, auch im geöffneten Zustand änderbar |
| `open` | `ModelSignal<boolean>` | `false` | Sichtbarkeit; mit `[(open)]` zweiseitig bindbar |

## `app-tabs`

Tabs mit Angular Aria, Tastaturnavigation und per Template projizierten Panels.

Import: `frontend/src/app/shared/tabs/tabs.ts`

`TabItem` besteht aus `value`, `label` und optional `disabled`. Der Inhalt eines Panels wird über
`ng-template[appTabPanel]` mit demselben `value` zugeordnet.

Jedes unabhängige Tabset benötigt ein eigenes `selectedTab`-Signal. Mit `selectionMode="follow"`
(Standard) aktivieren Pfeiltasten den fokussierten Reiter direkt. Bei `selectionMode="explicit"`
wird der Inhalt erst durch Enter oder Leertaste aktiviert; die Pfeiltasten verschieben nur den Fokus.

```ts
readonly tabs: readonly TabItem[] = [
  { value: 'overview', label: 'Übersicht' },
  { value: 'history', label: 'Historie' },
];
readonly selectedTab = signal('overview');
```

```html
<app-tabs [tabs]="tabs" [(selectedTab)]="selectedTab">
  <ng-template appTabPanel="overview">Übersichtsinhalte</ng-template>
  <ng-template appTabPanel="history">Historieninhalte</ng-template>
</app-tabs>
```

| Input / Model | Typ | Standard | Bedeutung |
| --- | --- | --- | --- |
| `tabs` | `readonly TabItem[]` | erforderlich | Tabs mit `value`, `label` und optional `disabled` |
| `selectedTab` | `ModelSignal<string>` | erforderlich | Aktiver Tab; mit `[(selectedTab)]` zweiseitig bindbar |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Ausrichtung der Tab-Leiste |
| `framed` | `boolean` | `true` | Zeigt den äußeren Rahmen |
| `selectionMode` | `'follow' \| 'explicit'` | `'follow'` | Auswahl bei Tastaturfokus oder expliziter Aktivierung |

## Gemeinsames Feldfeedback

`TextField`, `Textarea`, `Select` und `MultiSelect` unterstützen `hint` und `hideLabel`.
Das Label bleibt bei `hideLabel` für assistive Technik vorhanden. Hinweise und Fehlermeldungen
werden über eine pro Instanz eindeutige `aria-describedby`-ID mit dem Control verbunden.
Fehler erscheinen bei `invalid && touched`, nicht in Readonly-Ansichten. Feld- und Serverfehler
werden über `errors` als Angular-Validierungsfehler mit `message` geliefert; fachliche Prüfungen
bleiben außerhalb der Controls. Zusätzliche manuelle Fehlerlisten am einzelnen Control sind nicht nötig.

`TextField` und `Textarea` unterstützen `maxLength` (optional), auch aus Signal-Forms-Schemata.
Eine Längenbegrenzung ersetzt keine Validierung auf dem Server.

## Gemeinsame Dialogsteuerung

`Modal` und `SideDrawer` unterstützen zusätzlich:

| API | Standard | Bedeutung |
| --- | --- | --- |
| `closeOnEscape` | `true` | Escape als Schließanfrage zulassen |
| `closeOnBackdrop` | `true` | Backdrop als Schließanfrage zulassen |
| `closeOnRequest` | `true` | Nach Schließanfrage automatisch `open` auf `false` setzen |
| `closeRequested` | Output | Grund: `escape`, `backdrop` oder `button` |
| `requestClose(reason?)` | Methode | Fordert das Schließen des obersten Dialogs an; Standardgrund `button` |
| `[dialog-header]` | Projektionsbereich | Ergänzungen zum Titel |
| `[dialog-footer]` | Projektionsbereich | Aktionen, beim Drawer getrennt vom scrollenden Inhalt |

Mit `[closeOnRequest]="false"` kann die aufrufende Komponente Schließanfragen selbst behandeln.
Nur das oberste Dialogfenster
behandelt Schließanfragen. Programmatisches `open.set(false)` schließt ohne Anfrage.
Die strukturellen CDK-Overlay-Styles werden in `src/styles.scss` eingebunden.

## Neue Workflow-Bausteine

Interaktive Beispiele unter `/components` (Navigation: **Komponenten**).

### `app-file-picker`

Import: `shared/file-picker/file-picker.ts`. Einzeldatei über natives Dateifeld oder Drag-and-drop.
`value` ist `File | null` als Model; `label` ist standardmäßig `Datei`, `accept` ist standardmäßig
`.csv,text/csv`, `maxBytes` standardmäßig 10 MiB, `disabled` standardmäßig `false`.
`buttonSize` ist `small | medium | large` (Standard `small`) und steuert den Auswahlbutton.
`rejected` liefert eine verständliche Fehlermeldung. Bei Ablehnung bleibt eine bereits gültige
Auswahl erhalten. `remove()` leert die Auswahl; dieselbe Datei kann erneut ausgewählt werden.
Prüft Dateiname/MIME und Größe als Eingabehilfe, nicht den Dateiinhalt. Serverseitige Prüfung,
CSV-Parsing und Upload implementiert die Anwendung. Kein Signal-Forms-Control.

### `app-stepper`

Import: `shared/stepper/stepper.ts`. Reine Fortschrittsanzeige mit erforderlichen `steps`
(`readonly { value, label }[]`) und `current` (Schlüssel), optional `completed` (Schlüsselliste)
und `label` (Standard `Fortschritt`). Der aktuelle Schritt hat `aria-current="step"`.
Keine automatische Navigation und keine fachliche Validierung.

### `app-inline-message`

Import: `shared/inline-message/inline-message.ts`. `title` optional, `severity` ist
`info | success | warning | error` (Standard `info`). Fehler werden mit `role="alert"`,
andere Meldungen mit `role="status"` ausgezeichnet. Inhalt und `[message-actions]` sind projizierbar.

### Toasts

Import: `shared/toast/toast.ts`. Einmal `<app-toast-outlet />` im gewünschten Anwendungskontext
platzieren. `inject(ToastService).show(text)` liefert eine ID, `dismiss(id)` entfernt genau diese
Meldung. Meldungen werden höflich angekündigt und bleiben bis zum expliziten Schließen sichtbar.
`messages` ist ein schreibgeschütztes `Signal<readonly ToastMessage[]>`; `ToastMessage` enthält
`id: number` und `text: string`.
Die Demo platziert den Outlet auf der Komponentenseite; für anwendungsweite Meldungen in die Shell verschieben.

### `app-diff-view`

Import: `shared/diff-view/diff-view.ts`. Erforderliches `entries` ist eine Liste von
`{ key, label, before: string | null, after: string | null, changed?: boolean }`.
`null` bedeutet nicht vorhanden, `''` bedeutet vorhandener leerer Wert. Status: Neu, Entfernt,
Geändert oder Unverändert. `changed` kann den Vergleich überschreiben. Optionale Inputs:
`caption`, `beforeLabel` (Aktueller Stand), `afterLabel` (Beantragter Stand).
Fachliche Formatierung und das Berechnen der Vergleichseinträge übernimmt die Anwendung.

## Styles und Tokens

Die Komponenten verwenden Tailwind-Utilities und die Design-Tokens aus
`frontend/src/tailwind.css` und `frontend/src/styles.scss` (`bg-surface`, `text-content-muted`,
`border-border`, `h-control` usw.). Das sind derzeit App-Styles, keine separat gebaute oder
veröffentlichte CSS-Datei. Bei einer späteren Extraktion als Library müssen die Tokens und Styles
ebenfalls bereitgestellt werden.
