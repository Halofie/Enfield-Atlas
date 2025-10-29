import { useCallback, useState } from 'react';
import { getAITravelTips, TravelTips } from '../services/gemini.service';
import {
    getCurrentWeather,
    getWeatherAlertsAndForecast,
    WeatherAlert,
    WeatherData,
    WeatherForecast,
} from '../services/weather.service';

export interface UseWeatherDataReturn {
  weather: WeatherData | null;
  alerts: WeatherAlert[];
  forecast: WeatherForecast[];
  tips: TravelTips;
  loading: boolean;
  error: string | null;
  fetchWeather: (latitude: number, longitude: number) => Promise<void>;
  getTips: () => TravelTips;
}

/**
 * Custom hook for managing weather data and AI-powered travel tips
 */
export function useWeatherData(): UseWeatherDataReturn {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [alerts, setAlerts] = useState<WeatherAlert[]>([]);
  const [forecast, setForecast] = useState<WeatherForecast[]>([]);
  const [tips, setTips] = useState<TravelTips>({ 
    clothing: [], 
    packing: [], 
    safety: [] 
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = useCallback(async (latitude: number, longitude: number) => {
    setLoading(true);
    setError(null);

    try {
      // Fetch current weather
      const currentWeather = await getCurrentWeather(latitude, longitude);
      if (!currentWeather) {
        throw new Error('Failed to fetch weather data');
      }
      setWeather(currentWeather);

      // Fetch alerts and forecast
      const alertsAndForecast = await getWeatherAlertsAndForecast(latitude, longitude);
      if (alertsAndForecast) {
        setAlerts(alertsAndForecast.alerts);
        setForecast(alertsAndForecast.forecast);
        
        // Get AI-powered travel tips using Gemini
        const aiTips = await getAITravelTips(
          currentWeather, 
          alertsAndForecast.alerts,
          alertsAndForecast.forecast
        );
        setTips(aiTips);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      console.error('Error fetching weather:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const getTips = useCallback(() => {
    return tips;
  }, [tips]);

  return {
    weather,
    alerts,
    forecast,
    tips,
    loading,
    error,
    fetchWeather,
    getTips,
  };
}

