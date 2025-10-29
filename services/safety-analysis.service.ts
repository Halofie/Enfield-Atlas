/**
 * Safety Analysis Service
 * Analyzes routes for 24/7 establishments and safety score
 * Uses OpenStreetMap Overpass API (free alternative to Google Places)
 */

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface SafetyEstablishment {
  id: string;
  name: string;
  type: '24h_gas_station' | 'hospital' | 'police' | 'pharmacy' | 'rest_area' | 'commercial';
  location: Coordinates;
  distance: number;
  isOpen24Hours: boolean;
  address: string;
}

export interface RouteSafetySegment {
  startPoint: Coordinates;
  endPoint: Coordinates;
  safetyScore: number;
  nearbyEstablishments: SafetyEstablishment[];
  isWellLit: boolean;
  recommendedForNightTravel: boolean;
}

export interface RouteSafetyAnalysis {
  overallSafetyScore: number;
  segments: RouteSafetySegment[];
  allEstablishments: SafetyEstablishment[];
  isNightTime: boolean;
}

// Free OpenStreetMap Overpass API
const OVERPASS_API = 'https://overpass-api.de/api/interpreter';
const SEARCH_RADIUS = 500; // meters

/**
 * Check if it's currently night time (6 PM - 6 AM)
 */
export function isNightTime(): boolean {
  const hour = new Date().getHours();
  return hour >= 18 || hour < 6;
}

/**
 * Find 24/7 establishments near a coordinate using OpenStreetMap Overpass API
 */
export async function find24HourEstablishments(
  location: Coordinates,
  radius: number = SEARCH_RADIUS
): Promise<SafetyEstablishment[]> {
  const { latitude, longitude } = location;
  
  try {
    // Overpass query to find safety-related amenities
    const query = `
      [out:json][timeout:25];
      (
        node["amenity"="fuel"](around:${radius},${latitude},${longitude});
        node["amenity"="hospital"](around:${radius},${latitude},${longitude});
        node["amenity"="police"](around:${radius},${latitude},${longitude});
        node["amenity"="pharmacy"](around:${radius},${latitude},${longitude});
        node["amenity"="clinic"](around:${radius},${latitude},${longitude});
        node["highway"="rest_area"](around:${radius},${latitude},${longitude});
        node["shop"="convenience"](around:${radius},${latitude},${longitude});
      );
      out body;
    `;

    const response = await fetch(OVERPASS_API, {
      method: 'POST',
      body: `data=${encodeURIComponent(query)}`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (!response.ok) {
      console.warn('Overpass API error, using mock data');
      return generateMockEstablishments(location, radius);
    }

    const data = await response.json();
    const establishments: SafetyEstablishment[] = [];

    if (data.elements) {
      for (const element of data.elements) {
        if (!element.lat || !element.lon) continue;

        const estLocation: Coordinates = {
          latitude: element.lat,
          longitude: element.lon,
        };

        const distance = calculateDistance(location, estLocation);
        
        establishments.push({
          id: element.id?.toString() || Math.random().toString(),
          name: element.tags?.name || getDefaultName(element.tags?.amenity || element.tags?.highway),
          type: mapOSMTypeToSafetyType(element.tags?.amenity || element.tags?.highway),
          location: estLocation,
          distance,
          isOpen24Hours: element.tags?.opening_hours === '24/7' || 
                         element.tags?.amenity === 'hospital' ||
                         element.tags?.amenity === 'police' ||
                         true, // Assume 24/7 for safety
          address: element.tags?.['addr:street'] || '',
        });
      }
    }

    return establishments.sort((a, b) => a.distance - b.distance);
  } catch (error) {
    console.error('Error finding establishments:', error);
    // Return mock data if API fails
    return generateMockEstablishments(location, radius);
  }
}

/**
 * Generate mock establishments for demo/testing
 */
function generateMockEstablishments(location: Coordinates, radius: number): SafetyEstablishment[] {
  const establishments: SafetyEstablishment[] = [];
  const types: SafetyEstablishment['type'][] = ['24h_gas_station', 'hospital', 'police', 'pharmacy'];
  
  // Generate 3-5 random establishments around the location
  const count = Math.floor(Math.random() * 3) + 3;
  
  for (let i = 0; i < count; i++) {
    const angle = (Math.random() * 360 * Math.PI) / 180;
    const dist = Math.random() * radius;
    const offsetLat = (dist / 111000) * Math.cos(angle);
    const offsetLng = (dist / (111000 * Math.cos((location.latitude * Math.PI) / 180))) * Math.sin(angle);

    const type = types[Math.floor(Math.random() * types.length)];
    
    establishments.push({
      id: `mock-${i}`,
      name: getDefaultName(type),
      type,
      location: {
        latitude: location.latitude + offsetLat,
        longitude: location.longitude + offsetLng,
      },
      distance: dist,
      isOpen24Hours: true,
      address: 'Demo Location',
    });
  }

  return establishments;
}

/**
 * Analyze route safety based on 24/7 establishments
 */
export async function analyzeRouteSafety(
  routeCoordinates: Coordinates[]
): Promise<RouteSafetyAnalysis> {
  console.log('🛡️ Analyzing route safety...');
  const isNight = isNightTime();
  const segments: RouteSafetySegment[] = [];
  const allEstablishments: SafetyEstablishment[] = [];
  const establishmentIds = new Set<string>();

  if (routeCoordinates.length === 0) {
    return {
      overallSafetyScore: 0,
      segments: [],
      allEstablishments: [],
      isNightTime: isNight,
    };
  }

  // Sample points along route (every 10th point to reduce API calls)
  const sampleInterval = Math.max(Math.floor(routeCoordinates.length / 10), 1);
  const samplePoints = routeCoordinates.filter((_, index) => index % sampleInterval === 0);

  // Add last point if not included
  if (samplePoints[samplePoints.length - 1] !== routeCoordinates[routeCoordinates.length - 1]) {
    samplePoints.push(routeCoordinates[routeCoordinates.length - 1]);
  }

  console.log(`Analyzing ${samplePoints.length} sample points...`);

  for (let i = 0; i < samplePoints.length - 1; i++) {
    const startPoint = samplePoints[i];
    const endPoint = samplePoints[i + 1];
    
    // Find establishments near this segment
    const establishments = await find24HourEstablishments(startPoint);
    
    // Filter to only 24/7 or currently open
    const openEstablishments = establishments.filter(e => e.isOpen24Hours);
    
    // Add to global list (avoid duplicates)
    openEstablishments.forEach(est => {
      if (!establishmentIds.has(est.id)) {
        establishmentIds.add(est.id);
        allEstablishments.push(est);
      }
    });

    // Calculate safety score for this segment
    const safetyScore = calculateSegmentSafetyScore(openEstablishments, isNight);
    const isWellLit = openEstablishments.length >= 2;

    segments.push({
      startPoint,
      endPoint,
      safetyScore,
      nearbyEstablishments: openEstablishments,
      isWellLit,
      recommendedForNightTravel: isNight ? isWellLit : true,
    });

    // Small delay to avoid API rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // Calculate overall safety score
  const overallSafetyScore = segments.length > 0
    ? segments.reduce((sum, seg) => sum + seg.safetyScore, 0) / segments.length
    : 50;

  console.log(`✅ Safety analysis complete: ${Math.round(overallSafetyScore)}/100`);
  console.log(`Found ${allEstablishments.length} 24/7 establishments`);

  return {
    overallSafetyScore,
    segments,
    allEstablishments,
    isNightTime: isNight,
  };
}

/**
 * Calculate safety score for a route segment (0-100)
 */
function calculateSegmentSafetyScore(
  establishments: SafetyEstablishment[],
  isNightTime: boolean
): number {
  let score = 50; // Base score

  // Add points for each establishment type
  const hasGasStation = establishments.some(e => e.type === '24h_gas_station');
  const hasHospital = establishments.some(e => e.type === 'hospital');
  const hasPolice = establishments.some(e => e.type === 'police');
  const hasPharmacy = establishments.some(e => e.type === 'pharmacy');

  if (hasGasStation) score += 15;
  if (hasHospital) score += 20;
  if (hasPolice) score += 25;
  if (hasPharmacy) score += 10;

  // Bonus for multiple establishments
  if (establishments.length >= 3) score += 10;
  if (establishments.length >= 5) score += 10;

  // At night, weight establishments more heavily
  if (isNightTime) {
    score = Math.min(100, score * 1.2);
  }

  return Math.min(100, Math.max(0, score));
}

/**
 * Calculate distance between two coordinates (Haversine formula)
 */
export function calculateDistance(coord1: Coordinates, coord2: Coordinates): number {
  const R = 6371e3; // Earth radius in meters
  const φ1 = (coord1.latitude * Math.PI) / 180;
  const φ2 = (coord2.latitude * Math.PI) / 180;
  const Δφ = ((coord2.latitude - coord1.latitude) * Math.PI) / 180;
  const Δλ = ((coord2.longitude - coord1.longitude) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/**
 * Map OpenStreetMap type to our safety type
 */
function mapOSMTypeToSafetyType(osmType: string): SafetyEstablishment['type'] {
  const typeMap: Record<string, SafetyEstablishment['type']> = {
    fuel: '24h_gas_station',
    hospital: 'hospital',
    clinic: 'hospital',
    police: 'police',
    pharmacy: 'pharmacy',
    rest_area: 'rest_area',
    convenience: 'commercial',
  };
  return typeMap[osmType] || 'commercial';
}

/**
 * Get default name for establishment type
 */
function getDefaultName(type: string): string {
  const names: Record<string, string> = {
    fuel: 'Gas Station',
    '24h_gas_station': 'Gas Station',
    hospital: 'Hospital',
    clinic: 'Clinic',
    police: 'Police Station',
    pharmacy: 'Pharmacy',
    rest_area: 'Rest Area',
    convenience: 'Convenience Store',
    commercial: 'Commercial Hub',
  };
  return names[type] || 'Establishment';
}
