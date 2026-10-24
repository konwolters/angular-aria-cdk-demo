import { Component, signal } from '@angular/core';
import { TabPanelTemplateDirective } from '../../shared/tabs/tab-panel-template.directive';
import { TabItem, TabsComponent } from '../../shared/tabs/tabs';
import { TeamFormComponent } from '../../teams/team-form/team-form';
import { TeamReadonlyComponent } from '../../teams/team-readonly/team-readonly';

@Component({
  selector: 'app-tabs-page',
  imports: [TabPanelTemplateDirective, TabsComponent, TeamFormComponent, TeamReadonlyComponent],
  templateUrl: './tabs-page.html',
})
export class TabsPageComponent {
  protected readonly tabs: readonly TabItem[] = [
    { value: 'overview', label: 'Übersicht' },
    { value: 'activity', label: 'Aktivität' },
    { value: 'settings', label: 'Einstellungen' },
    { value: 'team', label: 'Team' },
    { value: 'team-readonly', label: 'Team (readonly)' },
  ];
  protected readonly selectedTab = signal('overview');
  protected readonly notificationsEnabled = signal(true);

  protected updateNotifications(event: Event): void {
    this.notificationsEnabled.set((event.target as HTMLInputElement).checked);
  }
}
