/**
 * Pothole data model and TypeScript interfaces
 */

export interface Pothole {
  id: string;
  latitude: number;
  longitude: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  detectedAt: Date;
  reportedBy?: string;
  imageUrl?: string;
  aiConfidence?: number; // 0-1 score from AI model
  verified?: boolean;
  status: 'pending' | 'verified' | 'fixed' | 'false_positive';
  description?: string;
}

export interface PotholeInput {
  latitude: number;
  longitude: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  detectedAt?: Date;
  reportedBy?: string;
  imageUrl?: string;
  aiConfidence?: number;
  verified?: boolean;
  status?: 'pending' | 'verified' | 'fixed' | 'false_positive';
  description?: string;
}

/**
 * Firestore document structure
 */
export interface PotholeDocument {
  latitude: number;
  longitude: number;
  severity: string;
  detectedAt: any; // Firestore Timestamp
  reportedBy?: string;
  imageUrl?: string;
  aiConfidence?: number;
  verified?: boolean;
  status: string;
  description?: string;
}
