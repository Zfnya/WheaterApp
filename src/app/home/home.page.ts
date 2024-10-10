import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';

// Definisikan interface untuk tipe data response dari API
interface WeatherMain {
  temp: number;
  pressure: number;
  humidity: number;
  temp_max: number;
  temp_min: number;
}

interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

interface WeatherResponse {
  main: WeatherMain;
  name: string;
  weather: WeatherCondition[];
}

const API_URL = environment.API_URL;
const API_KEY = environment.API_KEY;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  weatherTemp: WeatherMain | undefined; // Menyimpan informasi cuaca
  locationName: string | undefined; // Menyimpan nama lokasi
  cityName = 'Manado'; // Set default city to Manado
  todayDate = new Date();
  weatherIcon: string | undefined; // Menyimpan URL ikon cuaca
  weatherDetails: WeatherCondition | undefined; // Menyimpan detail cuaca

  constructor(public httpClient: HttpClient) {
    this.loadData(this.cityName); // Load data untuk kota default saat komponen diinisialisasi
  }

  loadData(city: string) {
    const trimmedCity = city.trim();

    // Jika nama kota kosong, reset variabel cuaca
    if (!trimmedCity) {
      this.weatherTemp = undefined;
      this.locationName = undefined;
      this.weatherIcon = undefined;
      return; // Tidak melakukan apa-apa jika nama kota kosong
    }

    this.httpClient
      .get<WeatherResponse>(
        `${API_URL}/weather?q=${trimmedCity}&appid=${API_KEY}`
      )
      .subscribe(
        (results: WeatherResponse) => {
          this.weatherTemp = results.main; // Assign data ke weatherTemp
          this.locationName = results.name; // Assign nama lokasi
          this.weatherDetails = results.weather[0]; // Ambil detail cuaca
          this.weatherIcon = `https://openweathermap.org/img/wn/${this.weatherDetails.icon}@4x.png`; // URL ikon cuaca
        },
        (error) => {
          // Cek jika terjadi kesalahan dan reset data jika kota tidak ditemukan
          if (error.status === 404) {
            this.weatherTemp = undefined;
            this.locationName = undefined;
            this.weatherIcon = undefined;
          } else {
            console.error('Error fetching weather data:', error);
          }
        }
      );
  }
}
