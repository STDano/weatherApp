import { Component, OnInit } from '@angular/core';
import { PreferencesService } from '../services/preferences.service';
import { ModeService } from '../services/mode.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: false,
})
export class SettingsPage implements OnInit {
  darkMode = true;
  temperatureUnit = 'metric';

  constructor(
    private preferences: PreferencesService,
    private mode: ModeService,
    private router: Router
  ) { }

  async ngOnInit() {
    const savedDarkMode = await this.preferences.getPreference('darkMode');
    const savedTempUnit = await this.preferences.getPreference('temperatureUnit');
    
    if (savedDarkMode == 'true') {
      this.darkMode = true;
    } else {
      this.darkMode = false;
    }
 
    if (savedTempUnit === 'metric') {
      this.temperatureUnit = 'metric';
      } else {
        this.temperatureUnit = 'imperial';
      }
  }

  async onTemperatureChange() {
    const unit = this.temperatureUnit;
    await this.preferences.createPreference('temperatureUnit', unit);
  }

  async onThemeChange() {
    await this.preferences.createPreference('darkMode', this.darkMode);
    this.mode
    .toggleMode(this.darkMode);
  }

  navigateToWeather() {
    this.router.navigate(['/weather']);
  }
}
