import { Service, signal } from '@angular/core';
import { form } from '@angular/forms/signals';
import { DiffEntry } from '../../shared/diff-view/diff-view';
import { GuiRow } from './gui-modelle';

type DrawerKind = 'angebot' | 'bereich' | 'reference' | 'request-diff';

@Service({ autoProvided: false })
export class GuiDialogService {
  readonly drawerOpen = signal(false);
  readonly drawerRow = signal<GuiRow | null>(null);
  readonly drawerTitle = signal('');
  readonly drawerKind = signal<DrawerKind>('angebot');
  readonly drawerEditing = signal(false);
  readonly requestDiff = signal<DiffEntry[]>([]);
  readonly modalOpen = signal(false);
  readonly modalTitle = signal('');
  readonly note = signal('');
  readonly noteForm = form(this.note);

  openDrawer(kind: DrawerKind, title: string, row: GuiRow | null, editing: boolean): void {
    this.drawerKind.set(kind);
    this.drawerTitle.set(title);
    this.drawerRow.set(row);
    this.drawerEditing.set(editing);
    this.drawerOpen.set(true);
  }

  openDiff(title: string, entries: DiffEntry[]): void {
    this.requestDiff.set(entries);
    this.openDrawer('request-diff', title, null, false);
  }

  confirm(title: string): void {
    this.modalTitle.set(title);
    this.modalOpen.set(true);
  }
}
