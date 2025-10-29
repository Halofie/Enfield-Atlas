# 🗺️ Pothole Map - Smart Pothole Detection & Navigation

A React Native mobile app that displays pothole locations on an interactive map with routing capabilities. Potholes are detected by AI from satellite imagery and stored in Firebase for real-time updates. Includes AI-powered trip planning with weather alerts and smart packing recommendations.

## 📱 Features

✅ **Interactive Map** - OpenStreetMap tiles (free, no API key required)  
✅ **Route Planning** - Enter source & destination to get driving directions  
✅ **Pothole Markers** - Display AI-detected potholes with severity indicators  
✅ **Real-time Data** - Firebase Firestore for live pothole location updates  
✅ **Weather Integration** - WeatherAPI.com for current conditions and forecasts  
✅ **AI Travel Tips** - Google Gemini AI generates contextual packing & safety advice  
✅ **Free APIs** - Nominatim (geocoding), OSRM (routing), WeatherAPI, Gemini AI  
✅ **Clean Architecture** - Services, hooks, and components properly separated  

## 🏗️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Framework | React Native (Expo) | Cross-platform mobile development |
| Map | react-native-maps + OpenStreetMap | Free map rendering |
| Routing | OSRM (Open Source Routing Machine) | Free route calculation |
| Geocoding | Nominatim (OpenStreetMap) | Address → coordinates conversion |
| Weather | WeatherAPI.com | Weather data, forecasts, alerts |
| AI | Google Gemini | Intelligent travel tips generation |
| Backend | Firebase Firestore | Pothole data storage |
| Language | TypeScript | Type safety |

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

```

pothole-map/## Get a fresh project

├── app/                    # Expo Router screens

│   └── (tabs)/When you're ready, run:

│       ├── index.tsx       # Home screen

│       ├── explore.tsx     # Explore screen```bash

│       └── map.tsx         # Map screen (main feature)npm run reset-project

├── components/             # Reusable UI components```

│   └── map/

│       ├── map-display.tsx      # Map renderingThis command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

│       ├── route-inputs.tsx     # Address input controls

│       └── pothole-markers.tsx  # Pothole marker components## Learn more

├── services/               # API layer

│   ├── geocoding.service.ts     # Nominatim geocodingTo learn more about developing your project with Expo, look at the following resources:

│   ├── routing.service.ts       # OSRM routing

│   └── firebase.service.ts      # Firestore CRUD operations- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).

├── hooks/                  # Custom React hooks- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

│   ├── use-map-routing.ts       # Routing business logic

│   └── use-pothole-markers.ts   # Pothole data management## Join the community

├── config/                 # Configuration files

│   └── firebase.config.ts       # Firebase initializationJoin our community of developers creating universal apps.

├── types/                  # TypeScript type definitions

│   └── pothole.types.ts         # Pothole data models- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.

└── docs/                   # Documentation- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

    └── FIREBASE_SETUP.md        # Firebase setup guide
```

## 🚀 Getting Started

### Prerequisites

- Node.js 20.15+ (upgrade recommended to 20.19.4+)
- npm or yarn
- Expo CLI
- iOS Simulator / Android Emulator / Physical device with Expo Go

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd pothole-map
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase** (Required for pothole markers)
   
   Follow the detailed guide: [`docs/FIREBASE_SETUP.md`](docs/FIREBASE_SETUP.md)
   
   Quick steps:
   - Create a Firebase project at https://console.firebase.google.com
   - Enable Firestore Database
   - Copy your config to `config/firebase.config.ts`
   - Add sample pothole data (see Firebase guide)

4. **Start the development server**
   ```bash
   npx expo start
   ```

5. **Run on your device**
   - **iOS**: Press `i` or scan QR with Camera app
   - **Android**: Press `a` or scan QR with Expo Go app
   - **Web**: Press `w` (limited map functionality)

## 🎯 Usage

### Map Screen Features

1. **View Pothole Markers**
   - Open the **Map** tab
   - Pothole markers appear as colored pins based on severity:
     - 🔴 Red = Critical
     - 🟠 Orange = High
     - 🟡 Yellow = Medium
     - 🟢 Green = Low
   - Tap a marker to see details

2. **Get Driving Directions**
   - Enter a source address (e.g., "San Francisco City Hall")
   - Enter a destination address
   - Tap **Route** button
   - Blue line shows the driving route

3. **Navigate the Map**
   - Pinch to zoom
   - Drag to pan
   - Tap location button to center on your current location

## 🔧 Configuration

### Firebase Setup

1. Update `config/firebase.config.ts` with your credentials:
   ```typescript
   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
     projectId: "YOUR_PROJECT_ID",
     // ... other config
   };
   ```

2. **(Recommended)** Use environment variables:
   - Copy `.env.example` to `.env`
   - Fill in your Firebase credentials
   - Update config to read from env vars

### Firestore Data Structure

Potholes are stored in the `potholes` collection:

```typescript
{
  id: string;              // Auto-generated
  latitude: number;        // e.g., 37.7749
  longitude: number;       // e.g., -122.4194
  severity: string;        // "low" | "medium" | "high" | "critical"
  status: string;          // "pending" | "verified" | "fixed"
  detectedAt: Timestamp;   // When AI detected it
  aiConfidence: number;    // 0.0 - 1.0
  verified: boolean;       // Human verification
  description?: string;    // Optional details
}
```

## 🤖 AI Integration (Future)

Your AI team will:

1. **Process Satellite Images** → Detect pothole locations
2. **Generate Coordinates** → Extract lat/long from image metadata
3. **Store in Firebase** → Use `firebase.service.ts` methods:

```typescript
import { addPothole } from '@/services/firebase.service';

// AI detected a pothole
await addPothole({
  latitude: 37.7749,
  longitude: -122.4194,
  severity: 'high',
  aiConfidence: 0.92,
  detectedAt: new Date(),
  status: 'pending',
  description: 'Detected from satellite image XYZ'
});
```

The app will automatically display new potholes on the map!

## 📱 Scripts

```bash
# Development
npm start              # Start Expo dev server
npm run android        # Run on Android
npm run ios            # Run on iOS
npm run web            # Run on web browser

# Code Quality
npm run lint           # Run ESLint

# Utilities
npm run reset-project  # Reset to clean template
```

## 🏛️ Architecture

This app follows clean architecture principles:

- **Services Layer** - API calls (geocoding, routing, Firebase)
- **Hooks Layer** - Business logic and state management
- **Components Layer** - Reusable UI components
- **Screens Layer** - Page-level orchestration

See [`ARCHITECTURE.md`](ARCHITECTURE.md) for detailed design decisions.

## 🌍 API Services Used

### 1. OpenStreetMap Tiles (Free)
- **Purpose**: Map rendering
- **API Key**: Not required
- **Usage Policy**: [Tile Usage Policy](https://operations.osmfoundation.org/policies/tiles/)

### 2. Nominatim Geocoding (Free)
- **Purpose**: Address → Coordinates
- **API Key**: Not required
- **Usage Policy**: [Nominatim Usage Policy](https://operations.osmfoundation.org/policies/nominatim/)
- **Rate Limit**: 1 request/second
- **Production**: Consider self-hosting or paid alternative

### 3. OSRM Routing (Free Demo Server)
- **Purpose**: Route calculation
- **API Key**: Not required
- **Demo Server**: `router.project-osrm.org`
- **Production**: Self-host OSRM or use paid alternative

### 4. Firebase (Free Tier)
- **Purpose**: Pothole data storage
- **Free Tier**: 1GB storage, 50K reads/day, 20K writes/day
- **Upgrade**: Pay-as-you-go for larger usage

## ⚠️ Important Notes

### For Development
- ✅ Current setup is perfect for prototyping
- ✅ All services are free
- ✅ No API keys required (except Firebase)

### For Production
- ⚠️ **Nominatim**: Consider self-hosting or use Mapbox/Google Geocoding
- ⚠️ **OSRM**: Self-host or use GraphHopper/Mapbox Directions
- ⚠️ **Firebase**: Update security rules (currently in test mode)
- ⚠️ **Rate Limits**: Implement caching and rate limiting

## 🐛 Troubleshooting

### Map not showing
- Check internet connection
- Verify OpenStreetMap tiles are loading (check console)

### No pothole markers appearing
- Verify Firebase is configured correctly
- Check Firestore has data in `potholes` collection
- Look for errors in console

### Routing not working
- Ensure both addresses are valid
- Check OSRM demo server status
- Verify geocoding is returning coordinates

### TypeScript errors
- Run `npm install` to ensure all packages are installed
- Check that Firebase SDK is installed correctly

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- OpenStreetMap for free map tiles
- OSRM Project for routing engine
- Firebase for backend infrastructure
- Expo team for React Native framework

## 📞 Support

For issues and questions:
- Create an issue in this repository
- Check existing documentation in `docs/`
- Review `ARCHITECTURE.md` for code structure

---

**Built with ❤️ using React Native, Expo, and Firebase**
