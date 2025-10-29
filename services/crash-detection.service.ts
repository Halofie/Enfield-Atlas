/**
 * Crash Detection Service
 * Hybrid rule-based crash detector using accelerometer and gyroscope
 * Detects accidents without ML or internet connectivity
 */

import { Accelerometer, Gyroscope } from 'expo-sensors';

// Thresholds
const ACC_THRESHOLD = 2.5; // G-force (gravity units)
const ROT_THRESHOLD = 200; // degrees per second
const BASELINE_MULTIPLIER_ACC = 2.5;
const BASELINE_MULTIPLIER_ROT = 3.0;
const CRASH_WINDOW_MS = 2000; // 2 seconds to confirm crash
const DEBOUNCE_MS = 500; // Sustained abnormal data duration
const BASELINE_UPDATE_INTERVAL = 5000; // Update baseline every 5 seconds

export interface CrashEvent {
  timestamp: Date;
  location?: { latitude: number; longitude: number };
  acceleration: { x: number; y: number; z: number; magnitude: number };
  rotation: { x: number; y: number; z: number; magnitude: number };
  severity: 'minor' | 'moderate' | 'severe';
}

interface AccelerometerData {
  x: number;
  y: number;
  z: number;
}

interface GyroscopeData {
  x: number;
  y: number;
  z: number;
}

class CrashDetectionService {
  private isMonitoring = false;
  private accelerometerSubscription: any = null;
  private gyroscopeSubscription: any = null;

  // Baseline values (rolling average)
  private baselineAcc = 1.0; // ~1G when stationary
  private baselineRot = 0.0;
  private accReadings: number[] = [];
  private rotReadings: number[] = [];
  private lastBaselineUpdate = Date.now();

  // Crash detection state
  private lastAbnormalAcc: { time: number; magnitude: number } | null = null;
  private lastAbnormalRot: { time: number; magnitude: number } | null = null;
  private abnormalStartTime: number | null = null;
  private crashCallback: ((crash: CrashEvent) => void) | null = null;

  /**
   * Start monitoring for crashes
   */
  startMonitoring(onCrashDetected: (crash: CrashEvent) => void) {
    if (this.isMonitoring) {
      console.log('Crash detection already running');
      return;
    }

    console.log('🚨 Starting crash detection...');
    this.isMonitoring = true;
    this.crashCallback = onCrashDetected;

    // Set sensor update intervals
    Accelerometer.setUpdateInterval(100); // 10Hz
    Gyroscope.setUpdateInterval(100); // 10Hz

    // Subscribe to accelerometer
    this.accelerometerSubscription = Accelerometer.addListener((data) => {
      this.handleAccelerometerData(data);
    });

    // Subscribe to gyroscope
    this.gyroscopeSubscription = Gyroscope.addListener((data) => {
      this.handleGyroscopeData(data);
    });
  }

  /**
   * Stop monitoring
   */
  stopMonitoring() {
    console.log('🛑 Stopping crash detection...');
    this.isMonitoring = false;
    this.accelerometerSubscription?.remove();
    this.gyroscopeSubscription?.remove();
    this.accelerometerSubscription = null;
    this.gyroscopeSubscription = null;
    this.resetState();
  }

  /**
   * Handle accelerometer data
   */
  private handleAccelerometerData(data: AccelerometerData) {
    const magnitude = this.calculateMagnitude(data.x, data.y, data.z);

    // Update baseline (rolling average)
    this.accReadings.push(magnitude);
    if (this.accReadings.length > 50) {
      this.accReadings.shift();
    }
    this.updateBaseline();

    // Check for abnormal acceleration
    if (this.isAbnormalAcceleration(magnitude)) {
      const now = Date.now();
      this.lastAbnormalAcc = { time: now, magnitude };

      if (!this.abnormalStartTime) {
        this.abnormalStartTime = now;
      }

      // Check if sustained for debounce period
      if (now - this.abnormalStartTime >= DEBOUNCE_MS) {
        this.checkForCrash(data);
      }
    } else {
      // Reset if acceleration returns to normal
      if (this.abnormalStartTime && Date.now() - this.abnormalStartTime > CRASH_WINDOW_MS) {
        this.abnormalStartTime = null;
      }
    }
  }

  /**
   * Handle gyroscope data
   */
  private handleGyroscopeData(data: GyroscopeData) {
    // Convert radians/sec to degrees/sec
    const magnitude =
      this.calculateMagnitude(data.x, data.y, data.z) * (180 / Math.PI);

    // Update baseline (rolling average)
    this.rotReadings.push(magnitude);
    if (this.rotReadings.length > 50) {
      this.rotReadings.shift();
    }
    this.updateBaseline();

    // Check for abnormal rotation
    if (this.isAbnormalRotation(magnitude)) {
      const now = Date.now();
      this.lastAbnormalRot = { time: now, magnitude };

      if (!this.abnormalStartTime) {
        this.abnormalStartTime = now;
      }

      // Check if sustained for debounce period
      if (now - this.abnormalStartTime >= DEBOUNCE_MS) {
        this.checkForCrash(null, data);
      }
    } else {
      // Reset if rotation returns to normal
      if (this.abnormalStartTime && Date.now() - this.abnormalStartTime > CRASH_WINDOW_MS) {
        this.abnormalStartTime = null;
      }
    }
  }

  /**
   * Check if both acceleration and rotation are abnormal (crash detection)
   */
  private checkForCrash(
    accData?: AccelerometerData | null,
    rotData?: GyroscopeData | null
  ) {
    // Check if both events happened within crash window
    if (this.lastAbnormalAcc && this.lastAbnormalRot) {
      const timeDiff = Math.abs(this.lastAbnormalAcc.time - this.lastAbnormalRot.time);

      if (timeDiff <= CRASH_WINDOW_MS) {
        // CRASH DETECTED!
        const severity = this.calculateSeverity(
          this.lastAbnormalAcc.magnitude,
          this.lastAbnormalRot.magnitude
        );

        const crashEvent: CrashEvent = {
          timestamp: new Date(),
          acceleration: accData
            ? { ...accData, magnitude: this.lastAbnormalAcc.magnitude }
            : { x: 0, y: 0, z: 0, magnitude: this.lastAbnormalAcc.magnitude },
          rotation: rotData
            ? {
                x: rotData.x * (180 / Math.PI),
                y: rotData.y * (180 / Math.PI),
                z: rotData.z * (180 / Math.PI),
                magnitude: this.lastAbnormalRot.magnitude,
              }
            : { x: 0, y: 0, z: 0, magnitude: this.lastAbnormalRot.magnitude },
          severity,
        };

        console.log('🚨 CRASH DETECTED!', crashEvent);
        this.crashCallback?.(crashEvent);

        // Reset state after detection
        this.resetState();
      }
    }
  }

  /**
   * Check if acceleration is abnormal
   */
  private isAbnormalAcceleration(magnitude: number): boolean {
    return (
      magnitude > this.baselineAcc * BASELINE_MULTIPLIER_ACC ||
      magnitude > ACC_THRESHOLD
    );
  }

  /**
   * Check if rotation is abnormal
   */
  private isAbnormalRotation(magnitude: number): boolean {
    return (
      magnitude > this.baselineRot * BASELINE_MULTIPLIER_ROT ||
      magnitude > ROT_THRESHOLD
    );
  }

  /**
   * Calculate magnitude from x, y, z components
   */
  private calculateMagnitude(x: number, y: number, z: number): number {
    return Math.sqrt(x * x + y * y + z * z);
  }

  /**
   * Update baseline values (rolling average)
   */
  private updateBaseline() {
    const now = Date.now();
    if (now - this.lastBaselineUpdate < BASELINE_UPDATE_INTERVAL) {
      return;
    }

    if (this.accReadings.length > 0) {
      this.baselineAcc =
        this.accReadings.reduce((sum, val) => sum + val, 0) / this.accReadings.length;
    }

    if (this.rotReadings.length > 0) {
      this.baselineRot =
        this.rotReadings.reduce((sum, val) => sum + val, 0) / this.rotReadings.length;
    }

    this.lastBaselineUpdate = now;
    console.log(`📊 Baseline updated: Acc=${this.baselineAcc.toFixed(2)}G, Rot=${this.baselineRot.toFixed(1)}°/s`);
  }

  /**
   * Calculate crash severity
   */
  private calculateSeverity(
    accMagnitude: number,
    rotMagnitude: number
  ): 'minor' | 'moderate' | 'severe' {
    const accScore = accMagnitude / ACC_THRESHOLD;
    const rotScore = rotMagnitude / ROT_THRESHOLD;
    const totalScore = (accScore + rotScore) / 2;

    if (totalScore > 2.0) return 'severe';
    if (totalScore > 1.5) return 'moderate';
    return 'minor';
  }

  /**
   * Reset detection state
   */
  private resetState() {
    this.lastAbnormalAcc = null;
    this.lastAbnormalRot = null;
    this.abnormalStartTime = null;
  }

  /**
   * Get current baseline values (for debugging)
   */
  getBaseline() {
    return {
      acceleration: this.baselineAcc,
      rotation: this.baselineRot,
    };
  }

  /**
   * Check if monitoring is active
   */
  isActive() {
    return this.isMonitoring;
  }
}

// Export singleton instance
export const crashDetectionService = new CrashDetectionService();
