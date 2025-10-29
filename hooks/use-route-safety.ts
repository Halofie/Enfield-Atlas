/**
 * Route Safety Hook
 * Manages route safety analysis state
 */

import { useCallback, useState } from 'react';
import { analyzeRouteSafety, Coordinates, RouteSafetyAnalysis } from '../services/safety-analysis.service';

export function useRouteSafety() {
  const [safetyAnalysis, setSafetyAnalysis] = useState<RouteSafetyAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeSafety = useCallback(async (routeCoordinates: Coordinates[]) => {
    if (routeCoordinates.length === 0) {
      setSafetyAnalysis(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const analysis = await analyzeRouteSafety(routeCoordinates);
      setSafetyAnalysis(analysis);
    } catch (err) {
      console.error('Safety analysis error:', err);
      setError(err instanceof Error ? err.message : 'Failed to analyze route safety');
      setSafetyAnalysis(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearAnalysis = useCallback(() => {
    setSafetyAnalysis(null);
    setError(null);
  }, []);

  return {
    safetyAnalysis,
    loading,
    error,
    analyzeSafety,
    clearAnalysis,
  };
}
