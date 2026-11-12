import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs';
import { IconComponent } from './shared/icon/icon';

@Component({
  selector: 'app-root',
  imports: [IconComponent, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './app.html',
})
export class App {
  private readonly router = inject(Router);
  private readonly url = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects),
    ),
    { initialValue: this.router.url },
  );
  protected readonly isGui = computed(() => /^\/gui(?:\/|$)/.test(this.url().split(/[?#]/)[0]));
  protected readonly componentLinks = [
    { slug: 'button', name: 'Button' },
    { slug: 'text-field', name: 'TextField' },
    { slug: 'textarea', name: 'Textarea' },
    { slug: 'select', name: 'Select' },
    { slug: 'multi-select', name: 'MultiSelect' },
    { slug: 'tabs', name: 'Tabs' },
    { slug: 'stepper', name: 'Stepper' },
    { slug: 'file-picker', name: 'FilePicker' },
    { slug: 'data-table-toolbar', name: 'DataTableToolbar' },
    { slug: 'data-table', name: 'DataTable' },
    { slug: 'data-table-combined', name: 'DataTable + Toolbar' },
    { slug: 'inline-message', name: 'InlineMessage' },
    { slug: 'diff-view', name: 'DiffView' },
    { slug: 'side-drawer', name: 'SideDrawer' },
    { slug: 'modal', name: 'Modal' },
    { slug: 'toast', name: 'Toast' },
  ];
}
