import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

interface CrashDetectionControlProps {
  isMonitoring: boolean;
  onToggle: () => void;
  baseline?: { acceleration: number; rotation: number };
}

/**
 * Crash Detection Control Component
 * Shows monitoring status and allows toggling crash detection
 */
export function CrashDetectionControl({
  isMonitoring,
  onToggle,
  baseline,
}: CrashDetectionControlProps) {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        isMonitoring ? styles.containerActive : styles.containerInactive,
      ]}
      onPress={onToggle}
      activeOpacity={0.7}
    >
      <Ionicons
        name={isMonitoring ? 'shield-checkmark' : 'shield-outline'}
        size={24}
        color={isMonitoring ? '#4CAF50' : '#999'}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 16,
    bottom: 50, // Below the recenter button
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  containerActive: {
    backgroundColor: '#E8F5E9', // Light green background when active
  },
  containerInactive: {
    backgroundColor: '#FFFFFF',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
    color: '#999',
  },
  textActive: {
    color: '#4CAF50',
  },
  baseline: {
    fontSize: 11,
    color: '#666',
    marginTop: 4,
    marginLeft: 28,
  },
});
