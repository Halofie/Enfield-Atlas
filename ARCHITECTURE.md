# Code Architecture

## Project Structure (After Refactoring)

```
app/
  (tabs)/
    map.tsx              ← Screen (UI orchestration only, ~70 lines)
    
components/
  map/
    route-inputs.tsx     ← Route input controls component
    map-display.tsx      ← Map rendering component
    
hooks/
  use-map-routing.ts     ← Custom hook (business logic & state)
  
services/
  geocoding.service.ts   ← Geocoding API calls (Nominatim)
  routing.service.ts     ← Routing API calls (OSRM)
```

## Separation of Concerns

### 1. **Services Layer** (API Communication)
- `geocoding.service.ts` - Handles address → coordinates conversion
- `routing.service.ts` - Handles route calculation between points
- **Responsibility**: External API communication only
- **Benefits**: Easy to mock for testing, can swap providers easily

### 2. **Hooks Layer** (Business Logic)
- `use-map-routing.ts` - Orchestrates geocoding + routing + state
- **Responsibility**: Business logic and state management
- **Benefits**: Reusable across components, testable independently

### 3. **Components Layer** (UI)
- `route-inputs.tsx` - Input fields and button
- `map-display.tsx` - Map rendering with markers and polyline
- **Responsibility**: Presentational components only
- **Benefits**: Reusable, easy to style, no business logic

### 4. **Screen Layer** (Orchestration)
- `map.tsx` - Brings everything together
- **Responsibility**: Coordinate components and handle user interactions
- **Benefits**: Clean, readable, easy to understand flow

## Benefits of This Architecture

✅ **Single Responsibility** - Each file has one clear purpose
✅ **Testability** - Can test services, hooks, and components independently
✅ **Reusability** - Services and hooks can be used in other screens
✅ **Maintainability** - Easy to find and update specific functionality
✅ **Scalability** - Easy to add new features (e.g., Firebase pothole markers)

## Before vs After

### Before (1 file, ~170 lines)
```
map.tsx
├── API calls (geocoding, routing)
├── Business logic (coordinate conversion)
├── State management
├── UI rendering
└── Event handlers
```

### After (7 files, well-organized)
```
Services (2 files)
├── geocoding.service.ts
└── routing.service.ts

Hooks (1 file)
└── use-map-routing.ts

Components (2 files)
├── route-inputs.tsx
└── map-display.tsx

Screens (1 file)
└── map.tsx (orchestration only)
```

## Next Steps for Scalability

When adding Firebase pothole markers:
1. Create `services/firebase.service.ts` for Firestore operations
2. Create `hooks/use-pothole-markers.ts` for pothole state
3. Create `components/map/pothole-marker.tsx` for custom marker UI
4. Update `map.tsx` to include the new hook and component

This keeps the architecture clean and organized!
