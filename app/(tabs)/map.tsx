import { MapDisplay } from '@/components/map/map-display';
import { RouteInputs } from '@/components/map/route-inputs';
import { useMapRouting } from '@/hooks/use-map-routing';
import { usePotholeMarkers } from '@/hooks/use-pothole-markers';
import { Pothole } from '@/types/pothole.types';
import React, { useRef, useState } from 'react';
import { Alert, Keyboard, SafeAreaView, StyleSheet } from 'react-native';

export default function MapScreen() {
  const [sourceText, setSourceText] = useState('');
  const [destText, setDestText] = useState('');
  
  // Use a loose any here to avoid a hard dependency on react-native-maps types in the
  // starter; once the dependency and types are installed this can be tightened.
  const mapRef = useRef<any>(null);
  
  // Use custom hook for routing logic
  const { sourceCoord, destCoord, routeCoords, loading, calculateRoute } = useMapRouting();
  
  // Use custom hook for pothole data
  const { potholes, loading: potholesLoading, error: potholesError } = usePotholeMarkers();

  async function onRoutePress() {
    Keyboard.dismiss();
    
    if (!sourceText || !destText) {
      Alert.alert('Please enter both source and destination');
      return;
    }
    
    const result = await calculateRoute(sourceText, destText);
    
    if (result.error) {
      Alert.alert('Routing failed', result.error);
      return;
    }
    
    // Fit map to route
    if (result.route && result.route.length > 0) {
      setTimeout(() => {
        if (mapRef.current) {
          mapRef.current.fitToCoordinates(result.route, {
            edgePadding: { top: 80, right: 40, bottom: 160, left: 40 },
            animated: true,
          });
        }
      }, 300);
    }
  }

  function handlePotholeMarkerPress(pothole: Pothole) {
    Alert.alert(
      `Pothole - ${pothole.severity.toUpperCase()}`,
      `Status: ${pothole.status}\n` +
      `Detected: ${pothole.detectedAt.toLocaleDateString()}\n` +
      `${pothole.description || 'No description'}\n` +
      `${pothole.aiConfidence ? `AI Confidence: ${(pothole.aiConfidence * 100).toFixed(0)}%` : ''}`,
      [{ text: 'OK' }]
    );
  }

  const initialRegion = {
    latitude: 37.7749,
    longitude: -122.4194,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  };

  return (
    <SafeAreaView style={styles.container}>
      <RouteInputs
        sourceText={sourceText}
        destText={destText}
        onSourceChange={setSourceText}
        onDestChange={setDestText}
        onRoutePress={onRoutePress}
        loading={loading}
      />
      
      <MapDisplay
        mapRef={mapRef}
        initialRegion={initialRegion}
        sourceCoord={sourceCoord}
        destCoord={destCoord}
        routeCoords={routeCoords}
        potholes={potholes}
        onPotholePress={handlePotholeMarkerPress}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
