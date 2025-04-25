import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment.hidden';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private apiKey = environment.apiKey;
  private openWeatherApiUrl = 'https://api.openweathermap.org/data/2.5/';
  private openWeatherProUrl = 'https://pro.openweathermap.org/data/2.5/';
  private currentWeather = 'weather';
  private dailyWeather = 'forecast/daily';
  private hourlyWeather = 'forecast/hourly';

  constructor(private http: HttpClient) { }

  getCurrentWeather(location: { lat: number, lon: number }, units: string = 'metric'): Observable<any> {
    const url = `${this.openWeatherApiUrl}${this.currentWeather}?lat=${location.lat}&lon=${location.lon}&units=${units}&appid=${this.apiKey}`;
    return this.http.get(url);
  }

  getDailyWeather(location: { lat: number, lon: number }, count: number = 0, units: string = 'metric'): Observable<any> {
    const url = `${this.openWeatherApiUrl}${this.dailyWeather}?lat=${location.lat}&lon=${location.lon}&cnt=${count}&units=${units}&appid=${this.apiKey}`;
    return this.http.get(url);
  }

  getHourlyWeather(location: { lat: number, lon: number }, count: number = 0, units: string = 'metric'): Observable<any> {
    const url = `${this.openWeatherProUrl}${this.hourlyWeather}?lat=${location.lat}&lon=${location.lon}&cnt=${count}&units=${units}&appid=${this.apiKey}`;
    return this.http.get(url);
  }

  getCurrentWeatherByLocation(location: string, units: string = 'metric'): Observable<any> {
    const url = `${this.openWeatherApiUrl}${this.currentWeather}?q=${location}&units=${units}&appid=${this.apiKey}`;
    return this.http.get(url);
  }

  getCachedCurrentWeather(): any {
    const data = localStorage.getItem('currentWeather');
    return data ? JSON.parse(data) : null;
  }

  getCachedDailyWeather(): any {
    const data = localStorage.getItem('dailyForecast');
    return data ? JSON.parse(data) : null;
  }

  getCachedHourlyWeather(): any {
    const data = localStorage.getItem('hourlyForecast');
    return data ? JSON.parse(data) : null;
  }
}
