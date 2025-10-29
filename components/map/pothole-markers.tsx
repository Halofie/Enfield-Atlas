import { Pothole } from '@/types/pothole.types';
import React from 'react';
import { Marker } from 'react-native-maps';

interface PotholeMarkerProps {
  pothole: Pothole;
  onPress?: (pothole: Pothole) => void;
}

/**
 * Get marker color based on pothole severity
 */
function getSeverityColor(severity: Pothole['severity']): string {
  switch (severity) {
    case 'critical':
      return '#FF0000'; // Red
    case 'high':
      return '#FF6B00'; // Orange
    case 'medium':
      return '#FFB800'; // Yellow
    case 'low':
      return '#4CAF50'; // Green
    default:
      return '#757575'; // Gray
  }
}

/**
 * Custom marker component for displaying potholes on the map
 */
export function PotholeMarker({ pothole, onPress }: PotholeMarkerProps) {
  const coordinate = {
    latitude: pothole.latitude,
    longitude: pothole.longitude,
  };

  return (
    <Marker
      coordinate={coordinate}
      title={`Pothole (${pothole.severity})`}
      description={pothole.description || `Detected at ${pothole.detectedAt.toLocaleDateString()}`}
      pinColor={getSeverityColor(pothole.severity)}
      onPress={() => onPress?.(pothole)}
      identifier={pothole.id}
    />
  );
}

interface PotholeMarkersProps {
  potholes: Pothole[];
  onMarkerPress?: (pothole: Pothole) => void;
}

/**
 * Component to render multiple pothole markers
 */
export function PotholeMarkers({ potholes, onMarkerPress }: PotholeMarkersProps) {
  return (
    <>
      {potholes.map((pothole) => (
        <PotholeMarker key={pothole.id} pothole={pothole} onPress={onMarkerPress} />
      ))}
    </>
  );
}
