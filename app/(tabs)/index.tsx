import { Image } from 'expo-image';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

// import { LoginScreen } from '@/components/auth';
import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
// import { useAuth } from '@/hooks/use-auth';

export default function HomeScreen() {
  // Auth temporarily disabled - will re-enable after fixing React Native persistence
  // const { user, loading, signOut, signInWithGoogle, error } = useAuth();

  // Show login screen if not authenticated
  // if (!user) {
  //   return <LoginScreen signInWithGoogle={signInWithGoogle} loading={loading} error={error} />;
  // }

  // Show loading state while checking auth
  const loading = false;
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4285F4" />
      </View>
    );
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome to Pothole Map!</ThemedText>
        <HelloWave />
      </ThemedView>

      {/* Authentication temporarily disabled - will add back after fixing React Native persistence */}
      {/* <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Your Account</ThemedText>
        <ThemedText>Email: {user.email}</ThemedText>
        {user.photoURL && (
          <Image
            source={{ uri: user.photoURL }}
            style={styles.profileImage}
          />
        )}
        <TouchableOpacity style={styles.signOutButton} onPress={signOut}>
          <Text style={styles.signOutButtonText}>Sign Out</Text>
        </TouchableOpacity>
      </ThemedView> */}

      {/* App Features */}
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">🗺️ Map Features</ThemedText>
        <ThemedText>
          Navigate to the <ThemedText type="defaultSemiBold">Map</ThemedText> tab to:
        </ThemedText>
        <ThemedText>• View real-time pothole locations</ThemedText>
        <ThemedText>• Plan safe routes avoiding potholes</ThemedText>
        <ThemedText>• Track your location with compass</ThemedText>
        <ThemedText>• Enable crash detection for safety</ThemedText>
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">🌤️ Trip Planner</ThemedText>
        <ThemedText>
          Navigate to the <ThemedText type="defaultSemiBold">Trip Planner</ThemedText> tab to:
        </ThemedText>
        <ThemedText>• Check weather conditions along your route</ThemedText>
        <ThemedText>• Get AI-powered travel tips</ThemedText>
        <ThemedText>• Receive clothing and packing suggestions</ThemedText>
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">🚀 Getting Started</ThemedText>
        <ThemedText>
          Start by exploring the map or planning your trip. The app will guide you with real-time
          alerts and safety features.
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  profileImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginVertical: 8,
  },
  signOutButton: {
    backgroundColor: '#f44336',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 12,
    alignSelf: 'flex-start',
  },
  signOutButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
