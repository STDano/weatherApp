import { Injectable } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
location: any;

  constructor() { }

  async getCurrentLocation() {
    try {
      const coordinates = await Geolocation.getCurrentPosition();

      const { latitude, longitude } = coordinates.coords;
      alert(`Latitude: ${latitude}, Longitude: ${longitude}`);
    } catch(error) {
      alert("Error getting location: "+error);
    }
  }

  async watchLocation() {
      const watchID = Geolocation.watchPosition({}, (position,err) =>  {
        if(err) {
          console.log("Error watching postion: ", err);
          return
        }
        console.log("Watched Position: ", position);
        this.location = position?.coords;
      });
    }
}
