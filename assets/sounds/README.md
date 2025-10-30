This folder contains emergency alarm sounds for crash detection.

The app currently uses an online emergency siren sound from:
https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3

To add a custom alarm sound:
1. Add an MP3 or WAV file named 'emergency-alarm.mp3' to this folder
2. Update emergency-alert-modal.tsx to use: require('@/assets/sounds/emergency-alarm.mp3')
3. The alarm will play at maximum volume and loop until dismissed

Alternative sounds to consider:
- Police siren
- Ambulance siren  
- Emergency alert tone
- Loud beeping alarm
