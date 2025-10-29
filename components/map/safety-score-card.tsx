/**
 * Safety Score Card
 * Displays route safety analysis with score and statistics
 */

import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { RouteSafetyAnalysis } from '../../services/safety-analysis.service';

interface SafetyScoreCardProps {
  analysis: RouteSafetyAnalysis;
}

export function SafetyScoreCard({ analysis }: SafetyScoreCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return '#4CAF50'; // Green
    if (score >= 60) return '#FF9800'; // Orange
    return '#F44336'; // Red
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Very Safe';
    if (score >= 60) return 'Moderately Safe';
    return 'Use Caution';
  };

  const wellLitSegments = analysis.segments.filter(s => s.isWellLit).length;
  const totalSegments = analysis.segments.length;
  const wellLitPercentage = totalSegments > 0 
    ? Math.round((wellLitSegments / totalSegments) * 100) 
    : 0;

  // Count establishments by type
  const gasStations = analysis.allEstablishments.filter(e => e.type === '24h_gas_station').length;
  const hospitals = analysis.allEstablishments.filter(e => e.type === 'hospital').length;
  const police = analysis.allEstablishments.filter(e => e.type === 'police').length;
  const pharmacies = analysis.allEstablishments.filter(e => e.type === 'pharmacy').length;

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>🛡️ Route Safety Analysis</Text>
          {analysis.isNightTime && (
            <View style={styles.nightBadge}>
              <Text style={styles.nightBadgeText}>🌙 Night Mode</Text>
            </View>
          )}
        </View>

        <View style={styles.scoreContainer}>
          <View style={[styles.scoreCircle, { borderColor: getScoreColor(analysis.overallSafetyScore) }]}>
            <Text style={[styles.scoreText, { color: getScoreColor(analysis.overallSafetyScore) }]}>
              {Math.round(analysis.overallSafetyScore)}
            </Text>
            <Text style={styles.scoreSubtext}>/ 100</Text>
          </View>
          <Text style={[styles.scoreLabel, { color: getScoreColor(analysis.overallSafetyScore) }]}>
            {getScoreLabel(analysis.overallSafetyScore)}
          </Text>
        </View>

        <View style={styles.stats}>
          <StatItem
            icon="💡"
            label="Well-lit"
            value={`${wellLitPercentage}%`}
          />
          <StatItem
            icon="🏪"
            label="Total 24/7"
            value={analysis.allEstablishments.length.toString()}
          />
        </View>

        <View style={styles.breakdown}>
          <Text style={styles.breakdownTitle}>Nearby 24/7 Services:</Text>
          <View style={styles.breakdownGrid}>
            {gasStations > 0 && <BreakdownItem icon="⛽" label="Gas" count={gasStations} />}
            {hospitals > 0 && <BreakdownItem icon="🏥" label="Hospital" count={hospitals} />}
            {police > 0 && <BreakdownItem icon="🚓" label="Police" count={police} />}
            {pharmacies > 0 && <BreakdownItem icon="💊" label="Pharmacy" count={pharmacies} />}
          </View>
        </View>

        {analysis.isNightTime && (
          <View style={styles.nightInfo}>
            <Text style={styles.nightInfoIcon}>💡</Text>
            <Text style={styles.nightInfoText}>
              Well-lit sections are highlighted in gold on the map
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

interface StatItemProps {
  icon: string;
  label: string;
  value: string;
}

function StatItem({ icon, label, value }: StatItemProps) {
  return (
    <View style={styles.statItem}>
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

interface BreakdownItemProps {
  icon: string;
  label: string;
  count: number;
}

function BreakdownItem({ icon, label, count }: BreakdownItemProps) {
  return (
    <View style={styles.breakdownItem}>
      <Text style={styles.breakdownIcon}>{icon}</Text>
      <Text style={styles.breakdownLabel}>{label}</Text>
      <View style={styles.breakdownBadge}>
        <Text style={styles.breakdownCount}>{count}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 200,
    left: 10,
    right: 10,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    maxHeight: '60%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  nightBadge: {
    backgroundColor: '#1a237e',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  nightBadgeText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '600',
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  scoreCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 6,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    marginBottom: 8,
  },
  scoreText: {
    fontSize: 42,
    fontWeight: 'bold',
  },
  scoreSubtext: {
    fontSize: 16,
    color: '#999',
    marginTop: -4,
  },
  scoreLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statIcon: {
    fontSize: 28,
    marginBottom: 6,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  breakdown: {
    marginTop: 8,
  },
  breakdownTitle: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 12,
    color: '#666',
  },
  breakdownGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  breakdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: '45%',
  },
  breakdownIcon: {
    fontSize: 18,
    marginRight: 6,
  },
  breakdownLabel: {
    fontSize: 12,
    color: '#666',
    flex: 1,
  },
  breakdownBadge: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 24,
    alignItems: 'center',
  },
  breakdownCount: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
  },
  nightInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9C4',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  nightInfoIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  nightInfoText: {
    flex: 1,
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
});
