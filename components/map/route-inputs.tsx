import React from 'react';
import { Button, StyleSheet, TextInput, View } from 'react-native';

interface RouteInputsProps {
  sourceText: string;
  destText: string;
  onSourceChange: (text: string) => void;
  onDestChange: (text: string) => void;
  onRoutePress: () => void;
  loading: boolean;
}

/**
 * Route input controls component
 * Displays source/destination inputs and route button
 */
export function RouteInputs({
  sourceText,
  destText,
  onSourceChange,
  onDestChange,
  onRoutePress,
  loading,
}: RouteInputsProps) {
  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Source (address)"
        value={sourceText}
        onChangeText={onSourceChange}
        style={styles.input}
        clearButtonMode="while-editing"
      />
      <TextInput
        placeholder="Destination (address)"
        value={destText}
        onChangeText={onDestChange}
        style={styles.input}
        clearButtonMode="while-editing"
      />
      <Button 
        onPress={onRoutePress} 
        title={loading ? 'Routing...' : 'Route'} 
        disabled={loading} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.95)',
    padding: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 8,
    marginBottom: 8,
  },
});
