# Safe Route Mapping Feature

## Overview
The Safe Route Mapping feature analyzes routes for 24/7 establishments and visually highlights safe road segments on the map. This helps users identify well-lit, populated areas along their route, especially useful for night-time travel.

## Features

### 🛡️ Safety Analysis
- **Real-time Route Analysis**: Automatically analyzes routes when safety view is enabled
- **24/7 Establishment Detection**: Finds nearby gas stations, hospitals, police stations, pharmacies, and rest areas
- **Safety Scoring**: Each route receives a 0-100 safety score based on nearby facilities
- **Night Mode Detection**: Automatically detects night time (6 PM - 6 AM) and adjusts visualization

### 🗺️ Visual Indicators

#### Establishment Markers
Color-coded markers show 24/7 facilities:
- ⛽ **Gas Stations** - Orange markers
- 🏥 **Hospitals** - Red markers  
- 🚓 **Police Stations** - Blue markers
- 💊 **Pharmacies** - Green markers
- 🛑 **Rest Areas** - Purple markers
- 🏪 **Commercial** - Amber markers

#### Route Coloring
Route segments are color-coded by safety level:
- **Well-Lit** (Score ≥ 80): Gold (night) / Green (day) - 8px width
- **Moderate** (Score 60-79): Orange - 5px width
- **Less Safe** (Score < 60): Red - 5px width

At night, well-lit segments have a yellow glow effect to simulate street lighting.

### 📊 Safety Score Card
When safety view is active, a card displays:
- Overall safety score (0-100) with color coding
- Percentage of well-lit segments
- Count of nearby 24/7 establishments
- Breakdown by establishment type
- Night mode indicator

## How to Use

1. **Enable Safety View**: Tap the shield button (🛡️) on the right side of the map
2. **Calculate Route**: Enter source and destination, then tap "Get Route"
3. **View Analysis**: The route will be color-coded and the safety score card will appear
4. **Explore**: Tap establishment markers to see details like distance and operating hours
5. **Disable**: Tap the shield button again to return to normal map view

## Technical Details

### Data Sources
- **Establishment Data**: OpenStreetMap Overpass API (free)
- **Route Calculation**: OSRM (existing)
- **Fallback**: Mock data if API unavailable

### Safety Scoring Algorithm
Each route segment is scored based on:
1. Number of nearby 24/7 establishments
2. Types of establishments (hospitals/police weighted higher)
3. Distance to nearest facility (closer = safer)
4. Time of day (night time requires more facilities for same score)

Score ranges:
- **80-100**: Very Safe - Multiple facilities within 500m
- **60-79**: Moderately Safe - Some facilities within 1km
- **0-59**: Use Caution - Few or distant facilities

### Performance
- Analyzes up to 50 route segments
- Searches 500m radius around each segment
- Mock data fallback ensures feature always works
- Lightweight rendering using react-native-maps polylines

## Architecture

```
services/safety-analysis.service.ts
  ↓
hooks/use-route-safety.ts
  ↓
app/(tabs)/map.tsx
  ↓
components/map/map-display.tsx
  ↓ (renders)
  ├─ safety-establishments.tsx (markers)
  ├─ safety-polylines.tsx (colored routes)
  └─ safety-score-card.tsx (score UI)
```

## Future Enhancements
- [ ] Crime data integration
- [ ] Street lighting database
- [ ] User-reported safety feedback
- [ ] Alternative safer routes
- [ ] Emergency contact quick dial
- [ ] Share safe route with friends

## Notes
- Feature works offline with mock data
- Night mode automatically activates between 6 PM - 6 AM
- Safety scores are estimates based on facility proximity
- Always use judgment and local knowledge when traveling
