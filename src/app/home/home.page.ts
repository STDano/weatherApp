import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PreferencesService } from '../services/preferences.service';
import { ModeService } from '../services/mode.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {
  isOnline: boolean = true;

  constructor(
    private router: Router,
    private preferences: PreferencesService,
    private mode: ModeService,
  ) {}

  async ngOnInit() {
    this.mode.toggleMode(await this.preferences.getPreference('darkMode'));
  }

  navigateToWeather() {
    this.router.navigate(['/weather']);
  }
}
