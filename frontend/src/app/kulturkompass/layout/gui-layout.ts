import { Component, input, model, output, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../../shared/button/button';
import { SelectComponent, SelectOption } from '../../shared/select/select';

export interface GuiNavigationItem {
  id: string;
  label: string;
}

@Component({
  selector: 'app-gui-layout',
  imports: [ButtonComponent, RouterLink, SelectComponent],
  templateUrl: './gui-layout.html',
})
export class GuiLayoutComponent {
  readonly navigation = input.required<readonly GuiNavigationItem[]>();
  readonly activePage = input.required<string>();
  readonly roles = input.required<readonly SelectOption[]>();
  readonly role = model.required<string>();
  readonly logout = output<void>();
  protected readonly settingsOpen = signal(false);
}
