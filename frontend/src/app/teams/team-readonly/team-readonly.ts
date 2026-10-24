import { Component } from '@angular/core';
import { MultiSelectComponent } from '../../shared/multi-select/multi-select';
import { SelectComponent, SelectOption } from '../../shared/select/select';
import { TextFieldComponent } from '../../shared/text-field/text-field';
import { TextareaComponent } from '../../shared/textarea/textarea';

@Component({
  selector: 'app-team-readonly',
  imports: [MultiSelectComponent, SelectComponent, TextFieldComponent, TextareaComponent],
  templateUrl: './team-readonly.html',
})
export class TeamReadonlyComponent {
  protected readonly departmentOptions: readonly SelectOption[] = [
    { value: 'Customer Success', label: 'Customer Success' },
    { value: 'Engineering', label: 'Engineering' },
    { value: 'Marketing', label: 'Marketing' },
    { value: 'Operations', label: 'Operations' },
    { value: 'Product', label: 'Product' },
  ];
  protected readonly timezoneOptions: readonly SelectOption[] = [
    { value: 'Europe/Berlin', label: 'Europe/Berlin (UTC+1)' },
    { value: 'Europe/London', label: 'Europe/London (UTC+0)' },
    { value: 'America/New_York', label: 'America/New_York (UTC−5)' },
    { value: 'Asia/Tokyo', label: 'Asia/Tokyo (UTC+9)' },
  ];
  protected readonly visibilityOptions: readonly SelectOption[] = [
    { value: 'Private', label: 'Privat – nur eingeladene Personen' },
    { value: 'Workspace', label: 'Workspace – alle können beitreten' },
  ];
  protected readonly roleOptions: readonly SelectOption[] = [
    { value: 'Viewer', label: 'Viewer' },
    { value: 'Member', label: 'Member' },
    { value: 'Admin', label: 'Admin' },
  ];
  protected readonly channelOptions = ['Support', 'Self-Service', 'Onboarding', 'Training'];
  protected readonly currentChannels = ['Support', 'Onboarding'];
  protected readonly previousChannels = ['Support', 'Self-Service'];
}
