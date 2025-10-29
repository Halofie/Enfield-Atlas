/**
 * Firebase Firestore service for pothole data
 * Handles CRUD operations for pothole locations
 */

import { db } from '@/config/firebase.config';
import { Pothole, PotholeDocument, PotholeInput } from '@/types/pothole.types';
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    query,
    Timestamp,
    updateDoc,
    where
} from 'firebase/firestore';

const COLLECTION_NAME = 'potholes';

/**
 * Convert Firestore document to Pothole object
 */
function documentToPothole(id: string, data: PotholeDocument): Pothole {
  return {
    id,
    latitude: data.latitude,
    longitude: data.longitude,
    severity: data.severity as Pothole['severity'],
    detectedAt: data.detectedAt?.toDate() || new Date(),
    reportedBy: data.reportedBy,
    imageUrl: data.imageUrl,
    aiConfidence: data.aiConfidence,
    verified: data.verified ?? false,
    status: data.status as Pothole['status'],
    description: data.description,
  };
}

/**
 * Convert Pothole input to Firestore document format
 */
function potholeToDocument(pothole: PotholeInput): Omit<PotholeDocument, 'id'> {
  return {
    latitude: pothole.latitude,
    longitude: pothole.longitude,
    severity: pothole.severity,
    detectedAt: pothole.detectedAt ? Timestamp.fromDate(pothole.detectedAt) : Timestamp.now(),
    reportedBy: pothole.reportedBy,
    imageUrl: pothole.imageUrl,
    aiConfidence: pothole.aiConfidence,
    verified: pothole.verified ?? false,
    status: pothole.status ?? 'pending',
    description: pothole.description,
  };
}

/**
 * Fetch all potholes from Firestore
 */
export async function getAllPotholes(): Promise<Pothole[]> {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    const potholes: Pothole[] = [];

    querySnapshot.forEach((doc) => {
      potholes.push(documentToPothole(doc.id, doc.data() as PotholeDocument));
    });

    return potholes;
  } catch (error) {
    console.error('Error fetching potholes:', error);
    throw error;
  }
}

/**
 * Fetch potholes by status
 */
export async function getPotholesByStatus(
  status: Pothole['status']
): Promise<Pothole[]> {
  try {
    const q = query(collection(db, COLLECTION_NAME), where('status', '==', status));
    const querySnapshot = await getDocs(q);
    const potholes: Pothole[] = [];

    querySnapshot.forEach((doc) => {
      potholes.push(documentToPothole(doc.id, doc.data() as PotholeDocument));
    });

    return potholes;
  } catch (error) {
    console.error('Error fetching potholes by status:', error);
    throw error;
  }
}

/**
 * Fetch potholes within a geographic bounding box
 * (For optimization: only load potholes visible on current map view)
 */
export async function getPotholesInBounds(
  northEast: { lat: number; lng: number },
  southWest: { lat: number; lng: number }
): Promise<Pothole[]> {
  try {
    // Note: Firestore doesn't support compound inequality queries on multiple fields
    // For a production app, consider using GeoFirestore or similar for geo queries
    const q = query(
      collection(db, COLLECTION_NAME),
      where('latitude', '>=', southWest.lat),
      where('latitude', '<=', northEast.lat)
    );
    
    const querySnapshot = await getDocs(q);
    const potholes: Pothole[] = [];

    querySnapshot.forEach((doc) => {
      const pothole = documentToPothole(doc.id, doc.data() as PotholeDocument);
      // Filter by longitude in memory
      if (pothole.longitude >= southWest.lng && pothole.longitude <= northEast.lng) {
        potholes.push(pothole);
      }
    });

    return potholes;
  } catch (error) {
    console.error('Error fetching potholes in bounds:', error);
    throw error;
  }
}

/**
 * Add a new pothole to Firestore
 */
export async function addPothole(pothole: PotholeInput): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), potholeToDocument(pothole));
    console.log('Pothole added with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error adding pothole:', error);
    throw error;
  }
}

/**
 * Update an existing pothole
 */
export async function updatePothole(
  id: string,
  updates: Partial<PotholeInput>
): Promise<void> {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, updates as any);
    console.log('Pothole updated:', id);
  } catch (error) {
    console.error('Error updating pothole:', error);
    throw error;
  }
}

/**
 * Delete a pothole
 */
export async function deletePothole(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
    console.log('Pothole deleted:', id);
  } catch (error) {
    console.error('Error deleting pothole:', error);
    throw error;
  }
}

/**
 * Mark a pothole as verified
 */
export async function verifyPothole(id: string): Promise<void> {
  return updatePothole(id, { verified: true, status: 'verified' });
}

/**
 * Mark a pothole as fixed
 */
export async function markPotholeAsFixed(id: string): Promise<void> {
  return updatePothole(id, { status: 'fixed' });
}
