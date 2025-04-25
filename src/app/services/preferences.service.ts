import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PreferencesService {
  preferenceChanged = new Subject<string>();

  constructor() { }

  async getPreference(key: string): Promise<any> {
    const preference = (await Preferences.get({ key: key }))?.value;
    
    if(preference) {
      try {
        return JSON.parse(preference);
      } catch(error) {
        return preference;
      }
    }

    return null;
  }

  async createPreference(key: string, value: any) {
    try {
      await Preferences.set({ key: key, value: JSON.stringify(value) })
      this.preferenceChanged.next(key)
    } catch {
      await Preferences.set({ key: key, value: value });
    }
  }
}
