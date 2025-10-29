/**
 * Safety Establishments Markers
 * Displays 24/7 establishments on the map with color-coded pins
 */

import React from 'react';
import { Marker } from 'react-native-maps';
import { SafetyEstablishment } from '../../services/safety-analysis.service';

interface SafetyEstablishmentsProps {
  establishments: SafetyEstablishment[];
  onMarkerPress?: (establishment: SafetyEstablishment) => void;
}

export function SafetyEstablishments({ establishments, onMarkerPress }: SafetyEstablishmentsProps) {
  const getMarkerColor = (type: SafetyEstablishment['type']) => {
    const colors = {
      '24h_gas_station': '#FF9800', // Orange
      hospital: '#F44336', // Red
      police: '#2196F3', // Blue
      pharmacy: '#4CAF50', // Green
      rest_area: '#9C27B0', // Purple
      commercial: '#FFC107', // Amber
    };
    return colors[type];
  };

  const getMarkerIcon = (type: SafetyEstablishment['type']) => {
    const icons = {
      '24h_gas_station': '⛽',
      hospital: '🏥',
      police: '🚓',
      pharmacy: '💊',
      rest_area: '🛑',
      commercial: '🏪',
    };
    return icons[type];
  };

  const getMarkerTitle = (establishment: SafetyEstablishment) => {
    const icon = getMarkerIcon(establishment.type);
    return `${icon} ${establishment.name}`;
  };

  const getMarkerDescription = (establishment: SafetyEstablishment) => {
    const typeName = establishment.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    const distance = Math.round(establishment.distance);
    const distanceText = distance < 1000 ? `${distance}m` : `${(distance / 1000).toFixed(1)}km`;
    const statusText = establishment.isOpen24Hours ? '24/7 Open' : 'Currently Open';
    return `${typeName} • ${distanceText} • ${statusText}`;
  };

  return (
    <>
      {establishments.map((establishment) => (
        <Marker
          key={establishment.id}
          coordinate={establishment.location}
          title={getMarkerTitle(establishment)}
          description={getMarkerDescription(establishment)}
          pinColor={getMarkerColor(establishment.type)}
          onPress={() => onMarkerPress?.(establishment)}
        />
      ))}
    </>
  );
}
