/**
 * Weather service using WeatherAPI.com (free tier)
 * Provides weather data, alerts, and forecasts
 * 
 * Get your free API key from: https://www.weatherapi.com/signup.aspx
 * Free tier: 1 million calls/month
 */

export interface WeatherData {
  temperature: number;
  feelsLike: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  pressure: number;
  visibility: number;
  clouds: number;
  uvIndex: number;
  condition: string;
}

export interface WeatherAlert {
  event: string;
  start: Date;
  end: Date;
  description: string;
  severity: 'minor' | 'moderate' | 'severe' | 'extreme';
  areas: string;
}

export interface WeatherForecast {
  date: Date;
  tempMin: number;
  tempMax: number;
  description: string;
  icon: string;
  precipitation: number;
  windSpeed: number;
  chanceOfRain: number;
}

interface WeatherAPIResponse {
  location: {
    name: string;
    region: string;
    country: string;
  };
  current: {
    temp_c: number;
    feelslike_c: number;
    condition: {
      text: string;
      icon: string;
      code: number;
    };
    humidity: number;
    wind_kph: number;
    pressure_mb: number;
    vis_km: number;
    cloud: number;
    uv: number;
  };
  alerts?: {
    alert: [{
      headline: string;
      severity: string;
      urgency: string;
      areas: string;
      category: string;
      certainty: string;
      event: string;
      note: string;
      effective: string;
      expires: string;
      desc: string;
      instruction: string;
    }];
  };
  forecast?: {
    forecastday: [{
      date: string;
      day: {
        maxtemp_c: number;
        mintemp_c: number;
        avgtemp_c: number;
        maxwind_kph: number;
        totalprecip_mm: number;
        daily_chance_of_rain: number;
        condition: {
          text: string;
          icon: string;
        };
      };
    }];
  };
}

// WeatherAPI.com free tier key
// Get yours from: https://www.weatherapi.com/signup.aspx
const WEATHER_API_KEY = '4a94d922b5e74ff7876114353252910'; // Replace with your key or use env var

/**
 * Get current weather for a location using WeatherAPI.com
 */
export async function getCurrentWeather(
  latitude: number,
  longitude: number
): Promise<WeatherData | null> {
  try {
    // For demo without API key, return mock data
    if (WEATHER_API_KEY === 'YOUR_WEATHERAPI_KEY') {
      return getMockWeatherData();
    }

    const url = `https://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${latitude},${longitude}&aqi=no`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`WeatherAPI error: ${response.status}`);
    }
    
    const data: WeatherAPIResponse = await response.json();

    return {
      temperature: Math.round(data.current.temp_c),
      feelsLike: Math.round(data.current.feelslike_c),
      description: data.current.condition.text.toLowerCase(),
      icon: data.current.condition.icon,
      humidity: data.current.humidity,
      windSpeed: Math.round(data.current.wind_kph),
      pressure: data.current.pressure_mb,
      visibility: Math.round(data.current.vis_km),
      clouds: data.current.cloud,
      uvIndex: data.current.uv,
      condition: data.current.condition.text,
    };
  } catch (error) {
    console.error('Error fetching weather:', error);
    return getMockWeatherData();
  }
}

/**
 * Get weather alerts and forecast for a location using WeatherAPI.com
 */
export async function getWeatherAlertsAndForecast(
  latitude: number,
  longitude: number
): Promise<{ alerts: WeatherAlert[]; forecast: WeatherForecast[] } | null> {
  try {
    // For demo without API key, return mock data
    if (WEATHER_API_KEY === 'YOUR_WEATHERAPI_KEY') {
      return getMockAlertsAndForecast();
    }

    const url = `https://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API_KEY}&q=${latitude},${longitude}&days=5&alerts=yes&aqi=no`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`WeatherAPI error: ${response.status}`);
    }
    
    const data: WeatherAPIResponse = await response.json();

    // Parse alerts
    const alerts: WeatherAlert[] = [];
    if (data.alerts?.alert) {
      data.alerts.alert.forEach((alert) => {
        alerts.push({
          event: alert.event || alert.headline,
          start: new Date(alert.effective),
          end: new Date(alert.expires),
          description: alert.desc || alert.instruction || alert.note,
          severity: mapSeverity(alert.severity),
          areas: alert.areas || '',
        });
      });
    }

    // Parse forecast
    const forecast: WeatherForecast[] = [];
    if (data.forecast?.forecastday) {
      data.forecast.forecastday.forEach((day) => {
        forecast.push({
          date: new Date(day.date),
          tempMin: Math.round(day.day.mintemp_c),
          tempMax: Math.round(day.day.maxtemp_c),
          description: day.day.condition.text.toLowerCase(),
          icon: day.day.condition.icon,
          precipitation: Math.round(day.day.totalprecip_mm),
          windSpeed: Math.round(day.day.maxwind_kph),
          chanceOfRain: day.day.daily_chance_of_rain,
        });
      });
    }

    return { alerts, forecast };
  } catch (error) {
    console.error('Error fetching alerts/forecast:', error);
    return getMockAlertsAndForecast();
  }
}

/**
 * Map WeatherAPI severity to our severity levels
 */
function mapSeverity(severity: string): WeatherAlert['severity'] {
  const sev = severity.toLowerCase();
  if (sev.includes('extreme')) return 'extreme';
  if (sev.includes('severe')) return 'severe';
  if (sev.includes('moderate')) return 'moderate';
  return 'minor';
}

/**
 * Mock weather data for demo/testing
 */
function getMockWeatherData(): WeatherData {
  return {
    temperature: 22,
    feelsLike: 20,
    description: 'partly cloudy',
    icon: '//cdn.weatherapi.com/weather/64x64/day/116.png',
    humidity: 65,
    windSpeed: 15,
    pressure: 1013,
    visibility: 10,
    clouds: 40,
    uvIndex: 5,
    condition: 'Partly cloudy',
  };
}

/**
 * Mock alerts and forecast for demo/testing
 */
function getMockAlertsAndForecast(): { alerts: WeatherAlert[]; forecast: WeatherForecast[] } {
  return {
    alerts: [
      {
        event: 'Heavy Rain Warning',
        start: new Date(),
        end: new Date(Date.now() + 24 * 60 * 60 * 1000),
        description: 'Heavy rainfall expected along your route. Roads may be slippery.',
        severity: 'moderate',
        areas: 'Your area',
      },
    ],
    forecast: [
      {
        date: new Date(),
        tempMin: 18,
        tempMax: 24,
        description: 'light rain',
        icon: '//cdn.weatherapi.com/weather/64x64/day/296.png',
        precipitation: 60,
        windSpeed: 20,
        chanceOfRain: 80,
      },
      {
        date: new Date(Date.now() + 24 * 60 * 60 * 1000),
        tempMin: 16,
        tempMax: 22,
        description: 'partly cloudy',
        icon: '//cdn.weatherapi.com/weather/64x64/day/116.png',
        precipitation: 20,
        windSpeed: 15,
        chanceOfRain: 30,
      },
      {
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        tempMin: 19,
        tempMax: 26,
        description: 'clear sky',
        icon: '//cdn.weatherapi.com/weather/64x64/day/113.png',
        precipitation: 0,
        windSpeed: 10,
        chanceOfRain: 0,
      },
    ],
  };
}

