/**
 * Safety Polylines
 * Displays route segments with color-coded safety indicators
 * "Lights up" safe sections of the route
 */

import React from 'react';
import { Polyline } from 'react-native-maps';
import { RouteSafetySegment } from '../../services/safety-analysis.service';

interface SafetyPolylinesProps {
  segments: RouteSafetySegment[];
  isNightTime: boolean;
}

export function SafetyPolylines({ segments, isNightTime }: SafetyPolylinesProps) {
  const getSegmentColor = (segment: RouteSafetySegment) => {
    if (segment.isWellLit) {
      // Well-lit segments: bright green/yellow
      return isNightTime ? '#FFD700' : '#4CAF50'; // Gold at night, Green during day
    } else if (segment.safetyScore >= 60) {
      // Moderately safe: orange
      return '#FF9800';
    } else {
      // Less safe: red (more transparent)
      return '#F44336';
    }
  };

  const getSegmentWidth = (segment: RouteSafetySegment) => {
    // Well-lit segments are thicker to show "lighting"
    return segment.isWellLit ? 8 : 5;
  };

  const getSegmentOpacity = (segment: RouteSafetySegment) => {
    // At night, well-lit segments glow brighter
    if (isNightTime && segment.isWellLit) {
      return 0.9;
    }
    return 0.7;
  };

  return (
    <>
      {segments.map((segment, index) => (
        <Polyline
          key={`safety-segment-${index}`}
          coordinates={[segment.startPoint, segment.endPoint]}
          strokeColor={getSegmentColor(segment)}
          strokeWidth={getSegmentWidth(segment)}
          lineCap="round"
          lineJoin="round"
          zIndex={100}
          tappable
          // @ts-ignore - opacity is supported but not in types
          opacity={getSegmentOpacity(segment)}
        />
      ))}
      
      {/* Add a subtle glow effect for well-lit segments at night */}
      {isNightTime && segments
        .filter(s => s.isWellLit)
        .map((segment, index) => (
          <Polyline
            key={`safety-glow-${index}`}
            coordinates={[segment.startPoint, segment.endPoint]}
            strokeColor="#FFFF00"
            strokeWidth={12}
            lineCap="round"
            lineJoin="round"
            zIndex={99}
            // @ts-ignore - opacity is supported
            opacity={0.2}
          />
        ))
      }
    </>
  );
}
