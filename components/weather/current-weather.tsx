import { WeatherData } from '@/services/weather.service';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface CurrentWeatherCardProps {
  weather: WeatherData;
}

/**
 * Get weather icon emoji based on icon code
 */
function getWeatherEmoji(icon: string): string {
  const code = icon.slice(0, 2);
  switch (code) {
    case '01':
      return '☀️'; // Clear
    case '02':
      return '⛅'; // Few clouds
    case '03':
      return '☁️'; // Scattered clouds
    case '04':
      return '☁️'; // Broken clouds
    case '09':
      return '🌧️'; // Shower rain
    case '10':
      return '🌦️'; // Rain
    case '11':
      return '⛈️'; // Thunderstorm
    case '13':
      return '🌨️'; // Snow
    case '50':
      return '🌫️'; // Mist
    default:
      return '🌤️';
  }
}

/**
 * Current weather display card
 */
export function CurrentWeatherCard({ weather }: CurrentWeatherCardProps) {
  const emoji = getWeatherEmoji(weather.icon);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.emoji}>{emoji}</Text>
        <View style={styles.tempContainer}>
          <Text style={styles.temperature}>{weather.temperature}°</Text>
          <Text style={styles.description}>{weather.description}</Text>
        </View>
      </View>

      <View style={styles.detailsGrid}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Feels Like</Text>
          <Text style={styles.detailValue}>{weather.feelsLike}°</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Humidity</Text>
          <Text style={styles.detailValue}>{weather.humidity}%</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Wind</Text>
          <Text style={styles.detailValue}>{weather.windSpeed} km/h</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Visibility</Text>
          <Text style={styles.detailValue}>{weather.visibility} km</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#4A90E2',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  emoji: {
    fontSize: 64,
    marginRight: 20,
  },
  tempContainer: {
    flex: 1,
  },
  temperature: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  description: {
    fontSize: 18,
    color: '#FFFFFF',
    textTransform: 'capitalize',
    marginTop: 4,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  detailItem: {
    width: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.8,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
