import { CurrentWeatherCard } from '@/components/weather/current-weather';
import { TravelTips } from '@/components/weather/travel-tips';
import { WeatherAlertsList } from '@/components/weather/weather-alerts';
import { useWeatherData } from '@/hooks/use-weather-data';
import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function TripPlannerScreen() {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationName, setLocationName] = useState<string>('Your Location');
  const [refreshing, setRefreshing] = useState(false);

  const { weather, alerts, tips, loading, error, fetchWeather } = useWeatherData();

  async function getCurrentLocation() {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'Location permission is required to show weather for your area. Using default location.',
          [{ text: 'OK' }]
        );
        setLocation({ latitude: 37.7749, longitude: -122.4194 });
        setLocationName('San Francisco, CA');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });

      const [address] = await Location.reverseGeocodeAsync({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });

      if (address) {
        setLocationName(`${address.city || address.region || 'Your Location'}`);
      }
    } catch (err) {
      console.error('Error getting location:', err);
      setLocation({ latitude: 37.7749, longitude: -122.4194 });
      setLocationName('San Francisco, CA');
    }
  }

  async function onRefresh() {
    setRefreshing(true);
    if (location) {
      await fetchWeather(location.latitude, location.longitude);
    } else {
      await getCurrentLocation();
    }
    setRefreshing(false);
  }

  useEffect(() => {
    getCurrentLocation();
  }, []);

  useEffect(() => {
    if (location) {
      fetchWeather(location.latitude, location.longitude);
    }
  }, [location, fetchWeather]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Trip Planner</Text>
          <Text style={styles.locationText}>📍 {locationName}</Text>
        </View>

        {loading && !weather && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4A90E2" />
            <Text style={styles.loadingText}>Loading weather data...</Text>
          </View>
        )}

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorIcon}>⚠️</Text>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={onRefresh}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}

        {weather && (
          <>
            <CurrentWeatherCard weather={weather} />
            <WeatherAlertsList alerts={alerts} />
            <TravelTips tips={tips} />
          </>
        )}

        <View style={styles.footer}>
          <Text style={styles.footerText}>💡 Pull down to refresh weather data</Text>
          <Text style={styles.footerSubtext}>Weather updates based on your current location</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  locationText: {
    fontSize: 16,
    color: '#666',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    backgroundColor: '#FFEBEE',
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  errorText: {
    fontSize: 16,
    color: '#C62828',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#E53935',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#1565C0',
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 12,
    color: '#1976D2',
  },
});
