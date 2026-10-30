import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { Overlay } from '@angular/cdk/overlay';
import {
  Directive,
  effect,
  inject,
  input,
  model,
  OnDestroy,
  output,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { ControlIdService } from '../field-messages/field-messages';

export type CloseReason = 'escape' | 'backdrop' | 'button';

/** Shared CDK lifecycle for modal and drawer; request handling can be delegated to the caller. */
@Directive()
export abstract class DialogBase implements OnDestroy {
  protected readonly titleId = inject(ControlIdService).next();
  protected readonly dialog = inject(Dialog);
  private readonly overlay = inject(Overlay);
  protected readonly content = viewChild<TemplateRef<unknown>>('dialogContent');
  protected ref?: DialogRef;
  protected abstract readonly drawer: boolean;

  readonly open = model(false);
  readonly title = input.required<string>();
  readonly closeOnEscape = input(true);
  readonly closeOnBackdrop = input(true);
  readonly closeOnRequest = input(true);
  readonly closeRequested = output<CloseReason>();

  constructor() {
    effect(() => {
      const content = this.content();
      if (!this.open()) {
        this.ref?.close();
        this.ref = undefined;
      } else if (content && !this.ref) {
        const ref = this.dialog.open(content, {
          disableClose: true,
          ariaLabelledBy: this.titleId,
          backdropClass: 'bg-overlay',
          width: this.drawer ? 'min(100vw, 48rem)' : 'min(calc(100vw - 2rem), 36rem)',
          maxHeight: '100dvh',
          positionStrategy: this.drawer
            ? this.overlay.position().global().right('0').top('0')
            : undefined,
          height: this.drawer ? '100dvh' : undefined,
        });
        this.ref = ref;
        ref.backdropClick.subscribe(() => {
          if (this.closeOnBackdrop()) this.requestClose('backdrop');
        });
        ref.keydownEvents.subscribe((event) => {
          if (event.key === 'Escape' && this.closeOnEscape()) {
            event.preventDefault();
            event.stopPropagation();
            this.requestClose('escape');
          }
        });
        ref.closed.subscribe(() => {
          if (this.ref === ref) {
            this.ref = undefined;
            this.open.set(false);
          }
        });
      }
    });
  }

  requestClose(reason: CloseReason = 'button'): void {
    if (this.dialog.openDialogs.at(-1) !== this.ref) return;
    this.closeRequested.emit(reason);
    if (this.closeOnRequest()) this.open.set(false);
  }

  ngOnDestroy(): void {
    this.ref?.close();
  }
}
