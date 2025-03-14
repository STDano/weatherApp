import { Component } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {
  location: any = [];

  constructor() {}

  async getCurrentLocation() {
    try {
      const coordinates = await Geolocation.getCurrentPosition();
      const { latitude, longitude } = coordinates.coords;

      this.location.latitude = latitude;
      this.location.longitude = longitude;
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
