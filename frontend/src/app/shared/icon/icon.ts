import { Component, input } from '@angular/core';

export type IconName =
  | 'activity'
  | 'arrow-left'
  | 'arrow-right'
  | 'arrow-up'
  | 'check'
  | 'chevron-down'
  | 'close'
  | 'grid'
  | 'plus'
  | 'receipt'
  | 'refresh'
  | 'search'
  | 'settings'
  | 'layers'
  | 'sort'
  | 'sort-ascending'
  | 'sort-descending'
  | 'tabs';

@Component({
  selector: 'app-icon',
  templateUrl: './icon.html',
  host: {
    class: 'inline-flex shrink-0 items-center justify-center leading-none',
    '[style.width.rem]': 'size() / 16',
    '[style.height.rem]': 'size() / 16',
    'aria-hidden': 'true',
  },
})
export class IconComponent {
  readonly name = input.required<IconName>();
  readonly size = input(18);
}
