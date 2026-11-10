import { Component, computed, input } from '@angular/core';
import { IconComponent, IconName } from '../icon/icon';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'link' | 'danger';
export type ButtonSize = 'small' | 'medium' | 'large';

const BASE_CLASSES =
  'inline-flex shrink-0 items-center justify-center gap-2 rounded-control font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50';

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: 'border border-transparent bg-brand text-on-brand hover:bg-brand-hover',
  secondary:
    'border border-border-strong bg-surface text-content-secondary hover:border-border-hover hover:bg-surface-subtle',
  ghost: 'border border-transparent bg-transparent text-content-secondary hover:bg-surface-muted',
  link: 'border border-transparent bg-transparent !text-sm text-brand-strong hover:text-brand-hover hover:underline',
  danger: 'border border-transparent bg-danger text-on-brand hover:bg-danger/90',
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  small: 'h-8 px-2.5 text-xs',
  medium: 'h-control px-3 text-control',
  large: 'h-11 px-4 text-sm',
};

@Component({
  selector: 'button[appButton]',
  imports: [IconComponent],
  templateUrl: './button.html',
  host: {
    '[class]': 'classes()',
  },
})
export class ButtonComponent {
  readonly variant = input<ButtonVariant>('primary');
  readonly size = input<ButtonSize>('small');
  readonly icon = input<IconName>();
  readonly iconPosition = input<'start' | 'end'>('start');
  readonly active = input(false);

  protected readonly classes = computed(() =>
    [
      BASE_CLASSES,
      SIZE_CLASSES[this.size()],
      VARIANT_CLASSES[this.variant()],
      this.active() ? 'border-brand bg-brand-subtle text-brand-strong' : '',
    ]
      .filter(Boolean)
      .join(' '),
  );

  protected iconSize(): number {
    switch (this.size()) {
      case 'small':
        return 14;
      case 'large':
        return 18;
      default:
        return 16;
    }
  }
}
