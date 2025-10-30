#  Emergency Crash Detection with Automatic Alert System

## Features Implemented

###  Automatic Alarm Sound
- **Loud emergency siren** plays immediately when crash is detected
- Plays at **maximum volume** (1.0)
- **Loops continuously** until user dismisses or emergency call is made
- Works even when phone is in **silent mode** (iOS: playsInSilentModeIOS)
- Uses online emergency siren: https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3

###  40-Second Countdown Timer
- Countdown starts immediately when crash is detected
- Large, color-coded display:
  - **Yellow** (40-21 seconds): Warning phase
  - **Orange** (20-11 seconds): Alert phase  
  - **Red** (10-0 seconds): Critical phase
- Timer is clearly visible with large numbers (72px font)

###  'I'm OK' Button
- Prominently displayed green button
- Stops the alarm sound immediately
- Cancels the countdown timer
- Dismisses the emergency alert modal
- Stops vibration pattern

###  Automatic Emergency Services Contact
- If user doesn't click 'I'm OK' within 40 seconds:
  - **Automatically calls emergency services**
  - Uses location-based emergency numbers:
    - India: 112
    - USA/Canada: 911
    - UK: 999
    - Australia: 000
    - EU: 112
    - Japan: 119
    - Default: 112 (international)
  
- **Android**: Attempts direct call via Intent (no user interaction needed)
- **iOS**: Opens phone app with number pre-filled (one tap required)

###  Additional Features
- **Intense Vibration**: 1000ms vibration, 300ms pause pattern
- **Location Detection**: Automatically detects user's country for correct emergency number
- **Crash Details Display**: Shows severity, impact force, and rotation
- **Manual Emergency Button**: User can call emergency immediately without waiting
- **Location Sharing**: Displays user's location in the alert

## How It Works

1. **Crash Detection Triggers**  Accelerometer detects sudden impact (>2.5G)
2. **Alert Opens**  Emergency modal appears with loud siren
3. **User Has 40 Seconds**  Countdown begins
4. **Two Outcomes**:
   - User clicks 'I'm OK'  Alert dismissed, monitoring continues
   - Timer reaches 0  Automatic emergency call placed

## Testing the Feature

### On Map Screen:
1. Navigate to the **Map** tab
2. Click the crash detection button (shield icon) to enable monitoring
3. Shake your phone vigorously to simulate a crash
4. Emergency alert will appear with alarm sound
5. You have 40 seconds to click 'I'm OK' or emergency services will be called

### Crash Thresholds:
- **Minor**: 2.5G - 4.0G acceleration
- **Moderate**: 4.0G - 6.0G acceleration  
- **Severe**: >6.0G acceleration

## Permissions Required
- **Location**: For detecting country-specific emergency numbers
- **Call Phone** (Android): For automatic emergency dialing
- **Audio**: For playing alarm sound

## Safety Notice
 This is a safety feature that will **actually call emergency services** if the countdown reaches zero. Use responsibly and test in safe environments only.

