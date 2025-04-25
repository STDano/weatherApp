import { Injectable } from '@angular/core';
import { PreferencesService } from './preferences.service';

@Injectable({
  providedIn: 'root'
})
export class ModeService {

  constructor(private preferences: PreferencesService) { }

  toggleMode(shouldAdd: boolean) {
    document.documentElement.classList.toggle('ion-palette-dark', shouldAdd);
  }

  async detectMode(){
    try {
      const darkMode = await this.preferences.getPreference('darkMode');
      const isDarkMode = darkMode === true || darkMode === 'true';
      this.toggleMode(isDarkMode);
      return isDarkMode;
    } catch (error) {
      console.error('Error detecting mode:', error);
      this.toggleMode(false);
      return false;
    }
  }
}
