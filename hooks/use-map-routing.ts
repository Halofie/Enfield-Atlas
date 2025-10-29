import { geocode } from '@/services/geocoding.service';
import { fetchRoute } from '@/services/routing.service';
import { useState } from 'react';

export interface Coordinate {
  latitude: number;
  longitude: number;
}

export interface RouteResult {
  success?: boolean;
  error?: string;
  route?: Coordinate[];
}

/**
 * Custom hook for managing map routing logic
 * Handles geocoding, route calculation, and state management
 */
export function useMapRouting() {
  const [sourceCoord, setSourceCoord] = useState<Coordinate | null>(null);
  const [destCoord, setDestCoord] = useState<Coordinate | null>(null);
  const [routeCoords, setRouteCoords] = useState<Coordinate[]>([]);
  const [loading, setLoading] = useState(false);

  /**
   * Calculate route between source and destination addresses
   * @param sourceText - Source address string
   * @param destText - Destination address string
   * @returns Result object with success/error status
   */
  async function calculateRoute(
    sourceText: string,
    destText: string
  ): Promise<RouteResult> {
    setLoading(true);
    
    try {
      // Geocode both addresses
      const s = await geocode(sourceText);
      const d = await geocode(destText);
      
      if (!s || !d) {
        return { error: 'Could not find one of the addresses' };
      }

      const from = { lat: s.lat, lon: s.lon };
      const to = { lat: d.lat, lon: d.lon };
      
      setSourceCoord({ latitude: from.lat, longitude: from.lon });
      setDestCoord({ latitude: to.lat, longitude: to.lon });

      // Fetch the route
      const route = await fetchRoute(from, to);
      
      if (!route) {
        return { error: 'Could not get a route from the routing service' };
      }

      setRouteCoords(route);
      return { success: true, route };
    } catch (e) {
      console.error('Route calculation error:', e);
      return { error: String(e) };
    } finally {
      setLoading(false);
    }
  }

  /**
   * Clear all route data and markers
   */
  function clearRoute() {
    setSourceCoord(null);
    setDestCoord(null);
    setRouteCoords([]);
  }

  return {
    sourceCoord,
    destCoord,
    routeCoords,
    loading,
    calculateRoute,
    clearRoute,
  };
}
