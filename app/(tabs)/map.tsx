import { EmergencyAlertModal } from '@/components/crash/emergency-alert-modal';
import { CrashDetectionControl } from '@/components/map/crash-detection-control';
import { MapDisplay } from '@/components/map/map-display';
import { RouteInputs } from '@/components/map/route-inputs';
import { SafetyScoreCard } from '@/components/map/safety-score-card';
import { useCrashDetection } from '@/hooks/use-crash-detection';
import { useMapRouting } from '@/hooks/use-map-routing';
import { usePotholeMarkers } from '@/hooks/use-pothole-markers';
import { useRouteSafety } from '@/hooks/use-route-safety';
import { CrashEvent } from '@/services/crash-detection.service';
import { Pothole } from '@/types/pothole.types';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useEffect, useRef, useState } from 'react';
import { Alert, Keyboard, SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function MapScreen() {
  const [sourceText, setSourceText] = useState('');
  const [destText, setDestText] = useState('');
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [mapHeading, setMapHeading] = useState(0); // Track map rotation
  const [showSafetyRoute, setShowSafetyRoute] = useState(false); // Toggle colored safety route
  const [showScoreCard, setShowScoreCard] = useState(false); // Show/hide safety score card
  const [showEmergencyAlert, setShowEmergencyAlert] = useState(false);
  const [crashData, setCrashData] = useState<CrashEvent | null>(null);
  
  // Use a loose any here to avoid a hard dependency on react-native-maps types in the
  // starter; once the dependency and types are installed this can be tightened.
  const mapRef = useRef<any>(null);
  
  // Use custom hook for routing logic
  const { sourceCoord, destCoord, routeCoords, loading, calculateRoute } = useMapRouting();
  
  // Use custom hook for pothole data
  const { potholes } = usePotholeMarkers();

  // Use custom hook for route safety analysis
  const { safetyAnalysis, analyzeSafety, clearAnalysis } = useRouteSafety();

  // Use custom hook for crash detection with emergency alert
  const crashDetection = useCrashDetection(false, (crash) => {
    console.log('🚨 CRASH DETECTED - Opening Emergency Alert Modal');
    setCrashData(crash);
    setShowEmergencyAlert(true);
  });

  // Get user's current location on mount
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.log('Location permission denied');
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        const coords = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };
        setUserLocation(coords);

        // Center map on user location
        if (mapRef.current) {
          mapRef.current.animateToRegion({
            ...coords,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }, 1000);
        }
      } catch (error) {
        console.error('Error getting location:', error);
      }
    })();
  }, []);

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

      // Analyze route safety if safety route is enabled
      if (showSafetyRoute) {
        analyzeSafety(result.route);
      }
    }
  }

  // Toggle safety view
  // Toggle colored safety route on tap
  function toggleSafetyRoute() {
    const newState = !showSafetyRoute;
    setShowSafetyRoute(newState);

    if (newState && routeCoords.length > 0) {
      // Analyze current route
      analyzeSafety(routeCoords);
    } else if (!newState) {
      // Clear safety analysis when disabled
      clearAnalysis();
      setShowScoreCard(false); // Hide score card when route is disabled
    }
  }

  // Show score card on long press
  function handleLongPress() {
    if (showSafetyRoute && safetyAnalysis) {
      setShowScoreCard(true);
    } else if (!showSafetyRoute && routeCoords.length > 0) {
      // If route exists but safety view is off, turn it on and show score card
      setShowSafetyRoute(true);
      analyzeSafety(routeCoords);
      setTimeout(() => setShowScoreCard(true), 100);
    }
  }  function handlePotholeMarkerPress(pothole: Pothole) {
    Alert.alert(
      `Pothole - ${pothole.severity.toUpperCase()}`,
      `Status: ${pothole.status}\n` +
      `Detected: ${pothole.detectedAt.toLocaleDateString()}\n` +
      `${pothole.description || 'No description'}\n` +
      `${pothole.aiConfidence ? `AI Confidence: ${(pothole.aiConfidence * 100).toFixed(0)}%` : ''}`,
      [{ text: 'OK' }]
    );
  }

  // Recenter map to user's current location
  async function recenterToUserLocation() {
    try {
      const location = await Location.getCurrentPositionAsync({});
      const coords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      setUserLocation(coords);

      if (mapRef.current) {
        mapRef.current.animateToRegion({
          ...coords,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }, 500);
      }
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Location Error', 'Unable to get your current location');
    }
  }

  // Reset map to point north (heading = 0)
  function resetToNorth() {
    if (mapRef.current) {
      mapRef.current.animateCamera({
        heading: 0,
        pitch: 0,
      }, { duration: 300 });
      setMapHeading(0);
    }
  }

  // Handle map region changes to track heading
  function handleRegionChange(region: any) {
    if (region.heading !== undefined) {
      setMapHeading(region.heading);
    }
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
        userLocation={userLocation}
        onRegionChange={handleRegionChange}
        safetyAnalysis={showSafetyRoute ? safetyAnalysis : undefined}
      />

      {/* Safety Score Card - Only show when explicitly toggled via long press */}
      {showScoreCard && safetyAnalysis && (
        <SafetyScoreCard 
          analysis={safetyAnalysis} 
          onClose={() => setShowScoreCard(false)}
        />
      )}

      {/* Crash Detection Control */}
      <CrashDetectionControl
        isMonitoring={crashDetection.isMonitoring}
        onToggle={() => {
          if (crashDetection.isMonitoring) {
            crashDetection.stopMonitoring();
          } else {
            crashDetection.startMonitoring();
          }
        }}
        baseline={crashDetection.baseline}
      />

      {/* Safety toggle button - Tap: toggle route colors, Long Press: show score card */}
      <TouchableOpacity 
        style={[styles.safetyButton, showSafetyRoute && styles.safetyButtonActive]}
        onPress={toggleSafetyRoute}
        onLongPress={handleLongPress}
        delayLongPress={500}
        activeOpacity={0.7}
      >
        <View style={styles.safetyButtonInner}>
          <Ionicons 
            name={showSafetyRoute ? "shield-checkmark" : "shield-outline"} 
            size={24} 
            color={showSafetyRoute ? "#4CAF50" : "#1E88E5"} 
          />
        </View>
      </TouchableOpacity>

      {/* Compass button - below recenter button */}
      <TouchableOpacity 
        style={styles.compassButton}
        onPress={resetToNorth}
        activeOpacity={0.7}
      >
        <View style={[styles.compassButtonInner, { transform: [{ rotate: `${-mapHeading}deg` }] }]}>
          <Ionicons name="compass-outline" size={28} color="#1E88E5" />
        </View>
      </TouchableOpacity>

      {/* Recenter button - like Google Maps */}
      <TouchableOpacity 
        style={styles.recenterButton}
        onPress={recenterToUserLocation}
        activeOpacity={0.7}
      >
        <View style={styles.recenterButtonInner}>
          <Ionicons name="locate" size={24} color="#1E88E5" />
        </View>
      </TouchableOpacity>

      {/* Emergency Alert Modal with Alarm & Auto Emergency Call */}
      <EmergencyAlertModal
        visible={showEmergencyAlert}
        crashData={crashData}
        onDismiss={() => {
          setShowEmergencyAlert(false);
          setCrashData(null);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  recenterButton: {
    position: 'absolute',
    right: 16,
    bottom: 120,
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  recenterButtonInner: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  compassButton: {
    position: 'absolute',
    right: 16,
    bottom: 190, // Above the recenter button
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  compassButtonInner: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  safetyButton: {
    position: 'absolute',
    right: 16,
    bottom: 260, // Above the compass button
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  safetyButtonActive: {
    backgroundColor: '#E8F5E9', // Light green background when active
  },
  safetyButtonInner: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
