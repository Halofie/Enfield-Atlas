/**
 * Geocoding service using OpenStreetMap Nominatim API
 * Converts addresses to geographic coordinates
 */

export interface GeocodingResult {
  lat: number;
  lon: number;
}

/**
 * Geocode an address string to coordinates using Nominatim
 * @param address - The address to geocode
 * @returns Coordinates or null if not found
 */
export async function geocode(address: string): Promise<GeocodingResult | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(
      address
    )}`;
    
    const res = await fetch(url, {
      headers: { 'User-Agent': 'pothole-map-demo/1.0 (email@example.com)' },
    });
    
    const data = await res.json();
    
    if (!data || data.length === 0) {
      return null;
    }
    
    const item = data[0];
    return {
      lat: parseFloat(item.lat),
      lon: parseFloat(item.lon),
    };
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
}
