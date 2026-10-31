# Angular Aria CDK Demo

Demo für eigene UI-Komponenten mit Angular 22, Angular Aria, CDK und Tailwind CSS. Im Fokus stehen zugängliche Interaktionen, Overlays und wiederverwendbare Bausteine.

Ein kleines Spring-Boot-Backend ermöglicht serverseitiges Filtern, Sortieren und Paginieren der Beispieltabellen.

## Starten

Voraussetzungen: Node.js 22.22.3+ (oder 24.15+), Java 25+ und Maven.

Backend:

```bash
cd backend
mvn spring-boot:run
```

Frontend in einem zweiten Terminal:

```bash
cd frontend
npm ci
npm start
```

Die Anwendung läuft auf http://localhost:4200. Anfragen an `/api` werden zum Backend auf Port 8080 weitergeleitet.

## UI-Komponenten

Unter `frontend/src/app/shared/` liegen Tabellen, Filterleisten, Buttons, Icons, Formularfelder, Selects, Tabs, Modals und Side-Drawer. Das Frontend nutzt Signals, Signal Forms und zoneless Change Detection.

APIs und Verwendungsbeispiele: [Shared-Komponenten](docs/shared-components.md).

## Build und Tests

Im Verzeichnis `frontend/`:

```bash
npm run build
npm test
npm run format:check
```

Im Verzeichnis `backend/`:

```bash
mvn package
```
