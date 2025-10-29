/**
 * Routing service using OSRM (Open Source Routing Machine)
 * Calculates routes between geographic coordinates
 */

export interface Coordinate {
  latitude: number;
  longitude: number;
}

export interface RoutePoint {
  lat: number;
  lon: number;
}

/**
 * Fetch a driving route between two points using OSRM
 * @param from - Starting coordinates
 * @param to - Destination coordinates
 * @returns Array of route coordinates or null if routing failed
 */
export async function fetchRoute(
  from: RoutePoint,
  to: RoutePoint
): Promise<Coordinate[] | null> {
  try {
    // Using OSRM public demo server for routing (suitable for demo/prototype only)
    const coords = `${from.lon},${from.lat};${to.lon},${to.lat}`;
    const url = `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`;
    
    const res = await fetch(url);
    const data = await res.json();
    
    if (!data || !data.routes || data.routes.length === 0) {
      return null;
    }
    
    const geometry = data.routes[0].geometry;
    
    // geometry.coordinates is array of [lon, lat]
    return geometry.coordinates.map((c: [number, number]) => ({
      latitude: c[1],
      longitude: c[0],
    }));
  } catch (error) {
    console.error('Routing error:', error);
    return null;
  }
}
