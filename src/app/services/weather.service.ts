import { Injectable, signal } from '@angular/core';
import { StorageService } from './storage.service';

interface WeatherData {
  temp: number;
  city: string;
}

@Injectable({ providedIn: 'root' })
export class WeatherService {
  weather = signal<WeatherData | null>(null);
  city = signal('');

  constructor(private storage: StorageService) {
    this.city.set(this.storage.get('fh_weather_city', ''));
  }

  async fetchWeather(): Promise<void> {
    const savedCity = this.city();
    if (savedCity) {
      await this.fetchByCity(savedCity);
    } else {
      await this.fetchByGeolocation();
    }
  }

  async fetchByCity(city: string): Promise<void> {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=YOUR_API_KEY`
      );
      const data = await response.json();
      this.weather.set({ temp: Math.round(data.main.temp), city: data.name });
      this.city.set(data.name);
      this.storage.set('fh_weather_city', data.name);
    } catch {
      this.weather.set(null);
    }
  }

  async fetchByGeolocation(): Promise<void> {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=YOUR_API_KEY`
          );
          const data = await response.json();
          this.weather.set({ temp: Math.round(data.main.temp), city: data.name });
        } catch {
          this.weather.set(null);
        }
      },
      () => {
        this.weather.set(null);
      }
    );
  }

  setCity(city: string): void {
    this.city.set(city);
    this.storage.set('fh_weather_city', city);
    this.fetchByCity(city);
  }
}
