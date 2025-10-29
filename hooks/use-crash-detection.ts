import { useEffect, useState } from 'react';
import { crashDetectionService, CrashEvent } from '../services/crash-detection.service';

export interface UseCrashDetectionReturn {
  isMonitoring: boolean;
  lastCrash: CrashEvent | null;
  startMonitoring: () => void;
  stopMonitoring: () => void;
  baseline: { acceleration: number; rotation: number };
}

/**
 * Custom hook for crash detection
 * Monitors accelerometer and gyroscope for crash events
 */
export function useCrashDetection(
  autoStart = false,
  onCrash?: (crash: CrashEvent) => void
): UseCrashDetectionReturn {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [lastCrash, setLastCrash] = useState<CrashEvent | null>(null);
  const [baseline, setBaseline] = useState({ acceleration: 1.0, rotation: 0.0 });

  useEffect(() => {
    if (autoStart) {
      startMonitoring();
    }

    // Cleanup on unmount
    return () => {
      if (crashDetectionService.isActive()) {
        crashDetectionService.stopMonitoring();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoStart]);

  // Update baseline periodically
  useEffect(() => {
    if (!isMonitoring) return;

    const interval = setInterval(() => {
      const currentBaseline = crashDetectionService.getBaseline();
      setBaseline(currentBaseline);
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [isMonitoring]);

  function startMonitoring() {
    if (isMonitoring) return;

    crashDetectionService.startMonitoring((crash) => {
      console.log('🚨 Crash detected in hook:', crash);
      setLastCrash(crash);
      onCrash?.(crash);
    });

    setIsMonitoring(true);
  }

  function stopMonitoring() {
    crashDetectionService.stopMonitoring();
    setIsMonitoring(false);
  }

  return {
    isMonitoring,
    lastCrash,
    startMonitoring,
    stopMonitoring,
    baseline,
  };
}
