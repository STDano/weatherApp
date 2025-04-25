import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WeatherService } from '../services/weather.service';
import { PreferencesService } from '../services/preferences.service';
import { LocationService } from '../services/location.service';
import { ViewWillEnter } from '@ionic/angular';
import { Network } from '@capacitor/network';

interface ForecastData {
  list: Array<any>;
}

@Component({
  selector: 'app-weather',
  templateUrl: './weather.page.html',
  styleUrls: ['./weather.page.scss'],
  standalone: false,
})
export class WeatherPage implements OnInit, ViewWillEnter {
  citySearch: string = '';
  locationName: string = '';
  temperature: number = 0;
  weatherDescription: string = '';
  humidity: number = 0;
  windSpeed: number = 0;
  weatherIcon: string = '';
  dailyForecast: any[] = [];
  hourlyForecast: any[] = [];
  isOnline: boolean = false;

  constructor(
    private router: Router,
    private weather: WeatherService,
    private preferences: PreferencesService,
    private location: LocationService
  ) { }

  ngOnInit() {
    this.setupNetworkListeners();
    this.loadWeatherData();
  }

  ionViewWillEnter() {
    this.setupNetworkListeners();
    this.loadWeatherData();
  }

  navigateToSettings() {
    this.router.navigate(['/settings']);
  }

  private async getCurrentCoordinates() {
    try {
      const coords = await this.location.getCurrentLocation();
      if (!coords) {
        throw new Error('Unable to get current location');
      }
      return coords;
    } catch (error) {
      console.error('Error getting location:', error);
      throw error;
    }
  }

  private updateWeatherData(data: any) {
    this.locationName = data.name || 'Unknown Location';
    this.temperature = data.main.temp;
    this.weatherDescription = data.weather[0]?.description || 'No description available';
    this.humidity = data.main.humidity;
    this.windSpeed = data.wind.speed;
    this.weatherIcon = data.weather.length > 0 && data.weather[0].icon
      ? `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
      : 'assets/default-weather-icon.png';
  }

  async fetchWeatherData(city?: string) {
    try {
      const tempUnit = await this.detectTempUnit();
      
      if (city) {
        this.weather.getCurrentWeatherByLocation(city, tempUnit).subscribe(
          (data) => {
            this.cacheData('currentWeather', data)
            this.updateWeatherData(data);
            if (data.coord) {
              this.updateForecasts(data.coord, tempUnit);
            }
          },
          (error) => {
            console.error('Failed to fetch weather data:', error);
          }
        );
      } else {
        const coords = await this.getCurrentCoordinates();
        this.weather.getCurrentWeather(coords, tempUnit).subscribe(
          (data) => {
            this.cacheData('currentWeather', data)
            this.updateWeatherData(data);
            this.updateForecasts(coords, tempUnit);
          },
          (error) => {
            console.error('Failed to fetch weather data:', error);
          }
        );
      }
    } catch (error) {
      console.error('Error in fetching weather data:', error);
    }
  }

  private updateForecasts(coords: {lat: number, lon: number}, tempUnit: string) {
    this.weather.getDailyWeather(coords, 5, tempUnit).subscribe(
      (data: ForecastData) => {
        this.cacheData('dailyForecast', data)
        this.dailyForecast = data.list.slice(0, 5);
      },
      (error) => {
        console.error('Failed to fetch forecast:', error);
      }
    );

    this.weather.getHourlyWeather(coords, 8, tempUnit).subscribe(
      (data: ForecastData) => {
        this.cacheData('hourlyForecast', data)
        const now = new Date();
        this.hourlyForecast = data.list
          .filter((hour: any) => new Date(hour.dt * 1000) >= now)
          .slice(0, 8);
      },
      (error) => {
        console.error('Failed to fetch hourly forecast:', error);
      }
    );
  }
  
  handleSearch() {
    if (this.citySearch && this.citySearch.trim() !== '') {
      this.fetchWeatherData(this.citySearch.trim());
    }
  }

  async cacheData(key: string, data: any) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  private setupNetworkListeners() {
    Network.addListener('networkStatusChange', (status) => {
      if(status.connected) {
        this.isOnline = true;
        this.loadWeatherData
      } else
      this.isOnline = false;
      this.loadWeatherData();
    });
  }

  private loadWeatherData() {
    if (!this.isOnline) {
      const cachedCurrent = this.weather.getCachedCurrentWeather();
      const cachedDaily = this.weather.getCachedDailyWeather();
      const cachedHourly = this.weather.getCachedHourlyWeather();

      if (cachedCurrent) {
        this.updateWeatherData(cachedCurrent);
      } else {
        console.log('No cached current weather data available');
      }

      if (cachedDaily) {
        this.dailyForecast = cachedDaily.list?.slice(0, 5) || [];
      } else {
        console.log('No cached daily forecast available');
      }

      if (cachedHourly) {
        const now = new Date();
        this.hourlyForecast = cachedHourly.list
          ?.filter((hour: any) => new Date(hour.dt * 1000) >= now)
          .slice(0, 8) || [];
      } else {
        console.log('No cached hourly forecast available');
      }
    } else {
      this.fetchWeatherData();
    }
  }

  async detectTempUnit() {
    const tempUnit = await this.preferences.getPreference('temperatureUnit');
    return tempUnit;
  }
  
}
