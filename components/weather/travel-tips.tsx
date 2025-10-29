import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

interface TravelTipsProps {
  tips: {
    clothing: string[];
    packing: string[];
    safety: string[];
  };
}

/**
 * Travel tips component - clothing, packing, and safety advice
 */
export function TravelTips({ tips }: TravelTipsProps) {
  return (
    <ScrollView style={styles.container}>
      {/* Clothing Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>👔 What to Wear</Text>
        <View style={styles.tipsContainer}>
          {tips.clothing.map((tip, index) => (
            <View key={index} style={styles.tipItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.tipText}>{tip}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Packing Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🎒 What to Pack</Text>
        <View style={styles.tipsContainer}>
          {tips.packing.map((tip, index) => (
            <View key={index} style={styles.tipItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.tipText}>{tip}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Safety Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🛡️ Safety Tips</Text>
        <View style={styles.tipsContainer}>
          {tips.safety.map((tip, index) => (
            <View key={index} style={styles.tipItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.tipText}>{tip}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  tipsContainer: {
    gap: 8,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 4,
  },
  bullet: {
    fontSize: 16,
    marginRight: 8,
    color: '#666',
    marginTop: 2,
  },
  tipText: {
    fontSize: 16,
    flex: 1,
    color: '#444',
    lineHeight: 22,
  },
});
