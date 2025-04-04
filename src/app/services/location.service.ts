import { Injectable } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
private locationSubject = new BehaviorSubject<{ lat: number, lon: number} | null>(null);
location: Observable<{ lat: number, lon: number } | null> = this.locationSubject.asObservable();

  constructor() { }

  async getCurrentLocation() {
      try {
        const location = await Geolocation.getCurrentPosition();

        const coords = {
          lat: location.coords.latitude,
          lon: location.coords.longitude
        };

        this.locationSubject.next(coords);
        return coords;

      } catch (error) {
        console.error('Error getting location: ', error);
        return;
      }
  }

  async trackCurrentLocation() {
      Geolocation.watchPosition (
        { enableHighAccuracy: true },
        (location, error) => {
          if(error) {
            console.error('Error tracking current location: ')
            return;
          }
          if(location) {
            const coords = {
              lat: location.coords.latitude,
              lon: location.coords.longitude
            };

            this.locationSubject.next(coords);
            console.log('Location updated: ', coords)
          }
        }
      )
    }
}
