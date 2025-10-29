import { WeatherAlert } from '@/services/weather.service';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface WeatherAlertCardProps {
  alert: WeatherAlert;
}

/**
 * Get alert color based on severity
 */
function getAlertColor(severity: WeatherAlert['severity']): string {
  switch (severity) {
    case 'extreme':
      return '#D32F2F'; // Dark red
    case 'severe':
      return '#F57C00'; // Orange
    case 'moderate':
      return '#FBC02D'; // Yellow
    case 'minor':
      return '#1976D2'; // Blue
    default:
      return '#757575'; // Gray
  }
}

/**
 * Get alert icon based on severity
 */
function getAlertIcon(severity: WeatherAlert['severity']): string {
  switch (severity) {
    case 'extreme':
      return '⛔';
    case 'severe':
      return '⚠️';
    case 'moderate':
      return '⚡';
    case 'minor':
      return 'ℹ️';
    default:
      return '📢';
  }
}

/**
 * Weather alert card component
 */
export function WeatherAlertCard({ alert }: WeatherAlertCardProps) {
  const backgroundColor = getAlertColor(alert.severity);
  const icon = getAlertIcon(alert.severity);

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.header}>
        <Text style={styles.icon}>{icon}</Text>
        <Text style={styles.event}>{alert.event}</Text>
      </View>
      <Text style={styles.description}>{alert.description}</Text>
      <Text style={styles.time}>
        {alert.start.toLocaleDateString()} - {alert.end.toLocaleDateString()}
      </Text>
    </View>
  );
}

interface WeatherAlertsListProps {
  alerts: WeatherAlert[];
}

/**
 * List of weather alerts
 */
export function WeatherAlertsList({ alerts }: WeatherAlertsListProps) {
  if (alerts.length === 0) {
    return (
      <View style={styles.noAlerts}>
        <Text style={styles.noAlertsIcon}>✅</Text>
        <Text style={styles.noAlertsText}>No weather alerts</Text>
        <Text style={styles.noAlertsSubtext}>Safe travel conditions expected</Text>
      </View>
    );
  }

  return (
    <View style={styles.alertsList}>
      <Text style={styles.sectionTitle}>⚠️ Weather Alerts</Text>
      {alerts.map((alert, index) => (
        <WeatherAlertCard key={index} alert={alert} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    fontSize: 24,
    marginRight: 8,
  },
  event: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
  },
  description: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 8,
    lineHeight: 20,
  },
  time: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  alertsList: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  noAlerts: {
    backgroundColor: '#E8F5E9',
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  noAlertsIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  noAlertsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 4,
  },
  noAlertsSubtext: {
    fontSize: 14,
    color: '#558B2F',
  },
});
