import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { IconComponent } from './shared/icon/icon';

@Component({
  selector: 'app-root',
  imports: [IconComponent, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './app.html',
})
export class App {}
