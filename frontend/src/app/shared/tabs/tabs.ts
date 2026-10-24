import { Tab, TabContent, TabList, TabPanel, Tabs } from '@angular/aria/tabs';
import { NgTemplateOutlet } from '@angular/common';
import { Component, contentChildren, input, model, TemplateRef } from '@angular/core';
import { TabPanelTemplateDirective } from './tab-panel-template.directive';

export interface TabItem {
  value: string;
  label: string;
  disabled?: boolean;
}

@Component({
  selector: 'app-tabs',
  imports: [NgTemplateOutlet, Tab, TabContent, TabList, TabPanel, Tabs],
  templateUrl: './tabs.html',
})
export class TabsComponent {
  readonly tabs = input.required<readonly TabItem[]>();
  readonly selectedTab = model.required<string>();
  readonly orientation = input<'horizontal' | 'vertical'>('horizontal');
  readonly selectionMode = input<'follow' | 'explicit'>('follow');

  protected readonly panelTemplates = contentChildren(TabPanelTemplateDirective);

  protected panelTemplate(value: string): TemplateRef<unknown> | undefined {
    return this.panelTemplates().find((panel) => panel.appTabPanel() === value)?.template;
  }
}
