import { Component } from '@angular/core';
import { ModeService } from './services/mode.service';

@Component({
  selector: 'app-root',
  template: '<ion-app><ion-router-outlet></ion-router-outlet></ion-app>',
  standalone: false,
})
export class AppComponent {
  constructor() {
  }
}
