import { Pothole } from '@/types/pothole.types';
import React from 'react';
import { StyleSheet } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_DEFAULT, UrlTile } from 'react-native-maps';
import { PotholeMarkers } from './pothole-markers';

export interface Coordinate {
  latitude: number;
  longitude: number;
}

interface MapDisplayProps {
  mapRef: React.MutableRefObject<any>;
  initialRegion: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
  sourceCoord: Coordinate | null;
  destCoord: Coordinate | null;
  routeCoords: Coordinate[];
  potholes?: Pothole[];
  onPotholePress?: (pothole: Pothole) => void;
  userLocation?: { latitude: number; longitude: number } | null;
  onRegionChange?: (region: any) => void;
}

/**
 * Map display component
 * Renders the map with OpenStreetMap tiles, markers, and route polyline
 */
export function MapDisplay({
  mapRef,
  initialRegion,
  sourceCoord,
  destCoord,
  routeCoords,
  potholes = [],
  onPotholePress,
  userLocation,
  onRegionChange,
}: MapDisplayProps) {
  return (
    <MapView
      ref={(r: any) => (mapRef.current = r)}
      provider={PROVIDER_DEFAULT}
      style={styles.map}
      initialRegion={initialRegion}
      showsUserLocation={true}
      showsMyLocationButton={false}
      rotateEnabled={true}
      pitchEnabled={true}
      showsCompass={false}
      onRegionChange={onRegionChange}
      onRegionChangeComplete={onRegionChange}>
      {/* OpenStreetMap tile layer */}
      <UrlTile
        urlTemplate="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        maximumZ={19}
        flipY={false}
        tileSize={256}
      />

      {/* Pothole markers */}
      <PotholeMarkers potholes={potholes} onMarkerPress={onPotholePress} />

      {sourceCoord && <Marker coordinate={sourceCoord} title="Source" pinColor="green" />}
      {destCoord && <Marker coordinate={destCoord} title="Destination" pinColor="red" />}
      {routeCoords.length > 0 && (
        <Polyline coordinates={routeCoords} strokeWidth={4} strokeColor="#007AFF" />
      )}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: { flex: 1 },
});
