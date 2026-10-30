import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { IconComponent } from './shared/icon/icon';

@Component({
  selector: 'app-root',
  imports: [IconComponent, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './app.html',
})
export class App {
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
