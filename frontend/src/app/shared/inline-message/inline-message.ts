import { Component, input } from '@angular/core';

export type MessageSeverity = 'info' | 'success' | 'warning' | 'error';

@Component({
  selector: 'app-inline-message',
  host: { class: 'block' },
  templateUrl: './inline-message.html',
})
export class InlineMessageComponent {
  readonly severity = input<MessageSeverity>('info');
  readonly title = input('');
}
