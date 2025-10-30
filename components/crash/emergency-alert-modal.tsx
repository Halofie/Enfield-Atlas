/**
 * Emergency Alert Modal
 * Shows crash alert with countdown and automatic emergency services contact
 */

import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import * as Location from 'expo-location';
import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Linking,
  Modal,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  Vibration,
  View,
} from 'react-native';

interface EmergencyAlertModalProps {
  visible: boolean;
  crashData: {
    severity: string;
    acceleration: { magnitude: number };
    rotation: { magnitude: number };
  } | null;
  onDismiss: () => void;
}

const COUNTDOWN_SECONDS = 40;

// Emergency numbers by country (most common)
const EMERGENCY_NUMBERS: { [key: string]: string } = {
  IN: '112', // India - Universal emergency number (replaced 100, 101, 102, 108)
  US: '911', // United States
  GB: '999', // United Kingdom
  AU: '000', // Australia
  CA: '911', // Canada
  EU: '112', // European Union (most countries)
  JP: '119', // Japan
  CN: '120', // China (medical)
  BR: '192', // Brazil (medical)
  DEFAULT: '112', // International standard
};

export function EmergencyAlertModal({ visible, crashData, onDismiss }: EmergencyAlertModalProps) {
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);
  const [isEmergencyCalled, setIsEmergencyCalled] = useState(false);
  const [emergencyNumber, setEmergencyNumber] = useState('112'); // Default international
  const [userLocation, setUserLocation] = useState<string>('Unknown');
  const soundRef = useRef<Audio.Sound | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Detect user's location and set appropriate emergency number
  useEffect(() => {
    if (visible) {
      detectLocationAndEmergencyNumber();
    }
  }, [visible]);

  // Play siren sound when modal opens
  useEffect(() => {
    if (visible) {
      playSirenSound();
      startVibration();
      
      // Start countdown inline to avoid dependency
      countdownIntervalRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            // Time's up - call emergency services
            handleEmergencyCall();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      stopSirenSound();
      stopCountdown();
      stopVibration();
      setCountdown(COUNTDOWN_SECONDS);
      setIsEmergencyCalled(false);
    }

    return () => {
      stopSirenSound();
      stopCountdown();
      stopVibration();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  async function detectLocationAndEmergencyNumber() {
    try {
      console.log('📍 Detecting user location for emergency services...');
      const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      
      // Reverse geocode to get country
      const [address] = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (address) {
        const country = address.isoCountryCode || 'DEFAULT';
        const cityInfo = address.city || address.region || 'Unknown location';
        setUserLocation(`${cityInfo}, ${address.country || 'Unknown'}`);
        
        // Set emergency number based on country
        const emergencyNum = EMERGENCY_NUMBERS[country] || EMERGENCY_NUMBERS.DEFAULT;
        setEmergencyNumber(emergencyNum);
        console.log(`🚨 Emergency number for ${country}: ${emergencyNum}`);
        console.log(`📍 User location: ${cityInfo}, ${address.country}`);
      }
    } catch (error) {
      console.error('Error detecting location:', error);
      // Default to international emergency number
      setEmergencyNumber('112');
      setUserLocation('Location unavailable');
    }
  }

  async function playSirenSound() {
    try {
      console.log('🚨 STARTING EMERGENCY SIREN - MAXIMUM VOLUME');
      
      // Request CALL_PHONE permission on Android for automatic calling
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CALL_PHONE,
            {
              title: 'Emergency Call Permission',
              message: 'This app needs permission to automatically call emergency services',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            },
          );
          console.log('CALL_PHONE permission:', granted);
        } catch (err) {
          console.warn('Permission error:', err);
        }
      }
      
      // Set audio mode to allow loud playback even in silent mode
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: false,
        allowsRecordingIOS: false,
      });

      console.log('🔊 Audio mode set successfully!');
      console.log('🔊 Attempting to load emergency alarm sound...');

      // Try multiple sound sources with fallbacks
      const soundSources = [
        // Primary: Loud emergency siren (police/ambulance)
        { uri: 'https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg', name: 'Alarm Clock' },
        // Fallback 1: Emergency alert tone
        { uri: 'https://actions.google.com/sounds/v1/alarms/bugle_tune.ogg', name: 'Bugle' },
        // Fallback 2: Beep alarm
        { uri: 'https://actions.google.com/sounds/v1/alarms/beep_short.ogg', name: 'Beep' },
        // Fallback 3: Different format
        { uri: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3', name: 'Bell' },
      ];

      console.log(`📋 Will try ${soundSources.length} sound sources`);

      let soundLoaded = false;
      
      for (let i = 0; i < soundSources.length; i++) {
        try {
          console.log(`🔊 [${i + 1}/${soundSources.length}] Trying ${soundSources[i].name}...`);
          console.log(`   📡 URL: ${soundSources[i].uri}`);
          
          const { sound, status } = await Audio.Sound.createAsync(
            { uri: soundSources[i].uri },
            { 
              isLooping: true, 
              volume: 1.0, // Maximum volume
              shouldPlay: true,
            },
            (playbackStatus) => {
              if (playbackStatus.isLoaded) {
                console.log(`✅ [${soundSources[i].name}] Sound LOADED!`);
                if (playbackStatus.isPlaying) {
                  console.log(`🔊 [${soundSources[i].name}] Sound IS PLAYING!`);
                }
              } else if (playbackStatus.error) {
                console.error(`❌ [${soundSources[i].name}] Playback error:`, playbackStatus.error);
              }
            }
          );

          console.log(`   📊 Initial status:`, status);

          if (status.isLoaded) {
            soundRef.current = sound;
            console.log(`✅ [${soundSources[i].name}] Emergency siren LOADED successfully!`);
            
            // Ensure it starts playing
            console.log(`   ▶️  Starting playback...`);
            const playStatus = await sound.playAsync();
            console.log(`   � Play status:`, playStatus);
            console.log(`🔊🔊🔊 [${soundSources[i].name}] ALARM IS NOW PLAYING! 🔊🔊🔊`);
            soundLoaded = true;
            break;
          } else {
            console.warn(`⚠️ [${soundSources[i].name}] Status shows NOT loaded:`, status);
            await sound.unloadAsync();
          }
        } catch (sourceError) {
          console.error(`❌ [${i + 1}/${soundSources.length}] Failed to load ${soundSources[i].name}:`, sourceError);
          console.error(`   Error details:`, JSON.stringify(sourceError, null, 2));
          if (i === soundSources.length - 1) {
            throw new Error('All sound sources failed');
          }
        }
      }

      if (!soundLoaded) {
        throw new Error('No sound source available');
      }
    } catch (error) {
      console.error('❌ Error playing siren, using VIBRATION ONLY:', error);
      // Fallback: INTENSE continuous loud vibration pattern
      // Pattern: 1 second vibrate, 0.3 second pause (very noticeable)
      Vibration.vibrate([1000, 300], true);
      console.log('📳 Using INTENSE vibration as audio fallback');
    }
  }

  function stopSirenSound() {
    if (soundRef.current) {
      soundRef.current.stopAsync();
      soundRef.current.unloadAsync();
      soundRef.current = null;
    }
  }

  function startVibration() {
    // INTENSE Emergency vibration pattern: 1000ms HARD vibration, 300ms pause
    // This creates a powerful, attention-grabbing vibration
    Vibration.vibrate([1000, 300], true);
    console.log('📳 INTENSE VIBRATION STARTED');
  }

  function stopVibration() {
    Vibration.cancel();
  }

  function stopCountdown() {
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
  }

  async function handleEmergencyCall() {
    if (isEmergencyCalled) return;
    
    setIsEmergencyCalled(true);
    stopCountdown();

    console.log(`🚨 CALLING EMERGENCY SERVICES: ${emergencyNumber}`);
    console.log(`📍 User location: ${userLocation}`);

    try {
      // AUTOMATIC CALL with Android intent for direct calling
      if (Platform.OS === 'android') {
        // Android Intent to make DIRECT call without user interaction
        const intentUrl = `intent:#Intent;action=android.intent.action.CALL;data=tel:${emergencyNumber};end`;
        
        console.log(`📞 ANDROID: Attempting DIRECT CALL via Intent to ${emergencyNumber}`);
        
        try {
          // Try intent first for automatic calling
          await Linking.openURL(intentUrl);
          console.log(`✅ Direct call initiated via Intent to ${emergencyNumber}`);
        } catch {
          // Fallback to tel: URL if intent fails
          console.log('Intent failed, falling back to tel: URL');
          await Linking.openURL(`tel:${emergencyNumber}`);
        }
      } else {
        // iOS - opens phone app with number (requires one tap)
        console.log(`📞 iOS: Opening phone app with ${emergencyNumber}`);
        await Linking.openURL(`tel:${emergencyNumber}`);
      }
      
      console.log(`✅ Emergency call triggered for ${emergencyNumber}`);
      
      // Show critical info alert IMMEDIATELY
      Alert.alert(
        '🚨 EMERGENCY CALL ACTIVE',
        `CALLING: ${emergencyNumber}\n` +
        `LOCATION: ${userLocation}\n\n` +
        `📢 TELL THE OPERATOR:\n` +
        `"Vehicle crash detected at my GPS location"\n\n` +
        `CRASH DETAILS:\n` +
        `• Severity: ${crashData?.severity?.toUpperCase()}\n` +
        `• Impact Force: ${crashData?.acceleration.magnitude.toFixed(1)}G\n` +
        `• My Location: ${userLocation}\n\n` +
        `Stay on the line and follow operator instructions.`,
        [{ text: 'I Understand' }],
        { cancelable: false }
      );

      // Keep siren and vibration active during call
      console.log('🚨 Siren and vibration continue during emergency call');
      
    } catch (error) {
      console.error('❌ Error initiating emergency call:', error);
      
      // URGENT FALLBACK - Multiple attempts
      Alert.alert(
        '🚨 EMERGENCY - CALL NOW!',
        `CALL ${emergencyNumber} IMMEDIATELY!\n\n` +
        `Location: ${userLocation}\n` +
        `Severity: ${crashData?.severity}\n` +
        `Impact: ${crashData?.acceleration.magnitude.toFixed(1)}G\n\n` +
        `If call doesn't connect, dial manually.`,
        [
          { 
            text: `📞 CALL ${emergencyNumber} NOW`, 
            onPress: async () => {
              try {
                await Linking.openURL(`tel:${emergencyNumber}`);
              } catch (e) {
                console.error('All call attempts failed:', e);
                // Last resort - just open phone app
                if (Platform.OS === 'android') {
                  Linking.openURL('tel:');
                }
              }
            },
            style: 'default'
          }
        ],
        { cancelable: false }
      );
    }
  }

  function handleImOk() {
    stopSirenSound();
    stopCountdown();
    stopVibration();
    onDismiss();
  }

  if (!visible || !crashData) return null;

  const countdownColor = countdown <= 10 ? '#F44336' : countdown <= 20 ? '#FF9800' : '#FFC107';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleImOk}>
      <View style={styles.overlay}>
        <View style={styles.alertContainer}>
          {/* Warning Icon */}
          <View style={styles.iconContainer}>
            <Ionicons name="warning" size={80} color="#F44336" />
          </View>

          {/* Alert Title */}
          <Text style={styles.title}>🚨 CRASH DETECTED!</Text>
          
          {/* Siren Warning */}
          <View style={styles.sirenWarning}>
            <Ionicons name="volume-high" size={20} color="#F44336" />
            <Text style={styles.sirenWarningText}>LOUD SIREN ACTIVE</Text>
          </View>

          {/* Location Info */}
          <View style={styles.locationContainer}>
            <Ionicons name="location" size={20} color="#2196F3" />
            <Text style={styles.locationText}>{userLocation}</Text>
          </View>

          {/* Crash Details */}
          <View style={styles.detailsContainer}>
            <Text style={styles.detailText}>Severity: {crashData.severity.toUpperCase()}</Text>
            <Text style={styles.detailText}>
              Impact: {crashData.acceleration.magnitude.toFixed(2)}G
            </Text>
            <Text style={styles.detailText}>
              Rotation: {crashData.rotation.magnitude.toFixed(1)}°/s
            </Text>
          </View>

          {/* Countdown */}
          {!isEmergencyCalled && countdown > 0 && (
            <View style={styles.countdownContainer}>
              <Text style={styles.countdownLabel}>Calling emergency services in:</Text>
              <Text style={[styles.countdownNumber, { color: countdownColor }]}>
                {countdown}
              </Text>
              <Text style={styles.countdownLabel}>seconds</Text>
            </View>
          )}

          {/* Emergency Called Message */}
          {isEmergencyCalled && (
            <View style={styles.callingContainer}>
              <Ionicons name="call" size={40} color="#4CAF50" />
              <Text style={styles.callingText}>Calling Emergency Services...</Text>
              <Text style={styles.emergencyNumber}>{emergencyNumber}</Text>
              <Text style={styles.locationSmallText}>{userLocation}</Text>
            </View>
          )}

          {/* I'm OK Button */}
          {!isEmergencyCalled && (
            <TouchableOpacity 
              style={styles.okButton}
              onPress={handleImOk}
              activeOpacity={0.8}>
              <Text style={styles.okButtonText}>I&apos;M OK</Text>
            </TouchableOpacity>
          )}

          {/* Manual Emergency Call Button */}
          <TouchableOpacity 
            style={styles.emergencyButton}
            onPress={handleEmergencyCall}
            activeOpacity={0.8}>
            <Ionicons name="call" size={24} color="white" />
            <Text style={styles.emergencyButtonText}>
              Call Emergency Now ({emergencyNumber})
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertContainer: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 20,
  },
  iconContainer: {
    marginBottom: 20,
    backgroundColor: '#FFEBEE',
    borderRadius: 50,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#F44336',
    marginBottom: 20,
    textAlign: 'center',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    width: '100%',
  },
  locationText: {
    fontSize: 14,
    color: '#1976D2',
    fontWeight: '600',
    marginLeft: 8,
    flex: 1,
  },
  locationSmallText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  sirenWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEBEE',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#F44336',
  },
  sirenWarningText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#F44336',
    marginLeft: 8,
    letterSpacing: 1,
  },
  detailsContainer: {
    width: '100%',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  detailText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    fontWeight: '500',
  },
  countdownContainer: {
    alignItems: 'center',
    marginBottom: 24,
    padding: 20,
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
    width: '100%',
  },
  countdownLabel: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  countdownNumber: {
    fontSize: 72,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  callingContainer: {
    alignItems: 'center',
    marginBottom: 24,
    padding: 20,
  },
  callingText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginTop: 12,
  },
  emergencyNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2196F3',
    marginTop: 8,
  },
  okButton: {
    width: '100%',
    backgroundColor: '#4CAF50',
    paddingVertical: 18,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  okButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  emergencyButton: {
    width: '100%',
    backgroundColor: '#F44336',
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  emergencyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
