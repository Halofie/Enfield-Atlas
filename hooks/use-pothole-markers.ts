import { getAllPotholes, getPotholesByStatus } from '@/services/firebase.service';
import { Pothole } from '@/types/pothole.types';
import { useEffect, useState } from 'react';

/**
 * Custom hook for managing pothole data from Firebase
 */
export function usePotholeMarkers() {
  const [potholes, setPotholes] = useState<Pothole[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch all potholes from Firebase
   */
  async function fetchPotholes() {
    setLoading(true);
    setError(null);
    
    try {
      const data = await getAllPotholes();
      setPotholes(data);
    } catch (err) {
      console.error('Error fetching potholes:', err);
      setError('Failed to load pothole data');
    } finally {
      setLoading(false);
    }
  }

  /**
   * Fetch potholes filtered by status
   */
  async function fetchPotholesByStatus(status: Pothole['status']) {
    setLoading(true);
    setError(null);
    
    try {
      const data = await getPotholesByStatus(status);
      setPotholes(data);
    } catch (err) {
      console.error('Error fetching potholes by status:', err);
      setError('Failed to load pothole data');
    } finally {
      setLoading(false);
    }
  }

  /**
   * Refresh pothole data
   */
  function refresh() {
    fetchPotholes();
  }

  // Auto-fetch on mount
  useEffect(() => {
    fetchPotholes();
  }, []);

  return {
    potholes,
    loading,
    error,
    refresh,
    fetchPotholesByStatus,
  };
}
