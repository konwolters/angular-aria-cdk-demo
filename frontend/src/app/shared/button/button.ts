import { Component, computed, input } from '@angular/core';
import { IconComponent, IconName } from '../icon/icon';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'link' | 'text-link' | 'danger';
export type ButtonSize = 'small' | 'medium' | 'large';

const BASE_CLASSES =
  'inline-flex items-center gap-2 rounded-control font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50';

const VARIANT_COLOR_CLASSES: Record<ButtonVariant, string> = {
  primary: 'border-transparent bg-brand text-on-brand hover:bg-brand-hover',
  secondary:
    'border-border-strong bg-surface text-content-secondary hover:border-border-hover hover:bg-surface-subtle',
  ghost: 'border-transparent bg-transparent text-content-secondary hover:bg-surface-muted',
  link: 'border-transparent bg-transparent text-brand-strong hover:text-brand-hover',
  'text-link': 'bg-transparent text-brand-strong hover:text-brand-hover',
  danger: 'border-transparent bg-danger text-on-brand hover:bg-danger/90',
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  small: 'min-h-8 px-2.5 py-1 text-control',
  medium: 'min-h-control px-3 py-1 text-control',
  large: 'min-h-11 px-4 py-2 text-base',
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

  protected readonly classes = computed(() => {
    const variant = this.variant();
    const size = this.size();
    const isTextLink = variant === 'text-link';

    return [
      BASE_CLASSES,
      isTextLink
        ? `min-w-0 justify-start whitespace-normal text-left ${size === 'large' ? 'text-base' : 'text-control'}`
        : `border shrink-0 justify-center ${SIZE_CLASSES[size]}`,
      variant === 'primary' || variant === 'secondary' || variant === 'danger' ? 'shadow-sm' : '',
      variant === 'link' || isTextLink ? 'hover:underline' : '',
      this.active()
        ? 'border-brand bg-brand-subtle text-brand-strong'
        : VARIANT_COLOR_CLASSES[variant],
    ]
      .filter(Boolean)
      .join(' ');
  });

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
