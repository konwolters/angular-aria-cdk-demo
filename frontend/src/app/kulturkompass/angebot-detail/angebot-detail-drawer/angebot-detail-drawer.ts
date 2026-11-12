import { Component, input, model, output } from '@angular/core';
import { ButtonComponent } from '../../../shared/button/button';
import { SelectOption } from '../../../shared/select/select';
import { SideDrawerComponent } from '../../../shared/side-drawer/side-drawer';
import { AngebotDetailComponent } from '../angebot-detail';

@Component({
  selector: 'app-angebot-detail-drawer',
  imports: [ButtonComponent, SideDrawerComponent, AngebotDetailComponent],
  templateUrl: './angebot-detail-drawer.html',
})
export class AngebotDetailDrawerComponent {
  readonly open = model(false);
  readonly title = input.required<string>();
  readonly value = input<Record<string, string> | null>(null);
  readonly editing = input(false);
  readonly bereichOptions = input<readonly SelectOption[] | null>(null);
  readonly accept = output<void>();
}
