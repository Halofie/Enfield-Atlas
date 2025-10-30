/**
 * Journey Service
 * Firebase operations for journey posts
 */

import { db } from '@/config/firebase.config';
import { CreatePostData, JourneyPost } from '@/types/journey.types';
import {
    addDoc,
    collection,
    doc,
    getDocs,
    increment,
    limit,
    orderBy,
    query,
    startAfter,
    Timestamp,
    updateDoc,
} from 'firebase/firestore';

const COLLECTION_NAME = 'journeyPosts';
const POSTS_PER_PAGE = 20;

/**
 * Test Firebase connection
 */
export async function testFirebaseConnection(): Promise<boolean> {
  try {
    console.log('🔥 Testing Firebase connection...');
    console.log('DB instance:', db);
    
    // Try to read from collection (even if empty)
    const testQuery = query(collection(db, COLLECTION_NAME), limit(1));
    await getDocs(testQuery);
    
    console.log('✅ Firebase connection successful!');
    return true;
  } catch (error: any) {
    console.error('❌ Firebase connection failed:', error);
    console.error('Error code:', error?.code);
    console.error('Error message:', error?.message);
    
    if (error?.code === 'permission-denied') {
      console.error('🚨 FIRESTORE SECURITY RULES NOT SET!');
      console.error('Go to: https://console.firebase.google.com/');
      console.error('Navigate to: Firestore Database > Rules');
      console.error('Set rules to: allow read, write: if true;');
    } else if (error?.code === 'unavailable') {
      console.error('🚨 FIRESTORE NOT ENABLED!');
      console.error('Go to: https://console.firebase.google.com/');
      console.error('Navigate to: Firestore Database');
      console.error('Click: Create Database');
    }
    
    return false;
  }
}

/**
 * Create a new journey post
 */
export async function createJourneyPost(
  userId: string,
  userName: string,
  data: CreatePostData
): Promise<string> {
  try {
    console.log('📝 Creating journey post...');
    console.log('DB instance:', db ? 'OK' : 'NULL');
    
    // Build post data - only include fields that have values (Firebase doesn't allow undefined)
    const postData: any = {
      userId,
      userName,
      routeName: data.routeName,
      startLocation: data.startLocation,
      endLocation: data.endLocation,
      rating: data.rating,
      review: data.review,
      tags: data.tags || [],
      timestamp: Timestamp.now(),
      likes: 0,
      comments: 0,
    };

    // Only add optional fields if they have values
    if (data.distance) postData.distance = data.distance;
    if (data.duration) postData.duration = data.duration;
    // userAvatar will be added later when auth is re-enabled

    console.log('Post data:', JSON.stringify(postData, null, 2));

    const docRef = await addDoc(collection(db, COLLECTION_NAME), postData);
    console.log('✅ Journey post created:', docRef.id);
    return docRef.id;
  } catch (error: any) {
    console.error('❌ Error creating journey post:', error);
    console.error('Error code:', error?.code);
    console.error('Error message:', error?.message);
    
    // Provide specific error messages
    if (error?.code === 'permission-denied') {
      throw new Error('Firebase permission denied. Please check Firestore security rules in Firebase Console.');
    } else if (error?.code === 'unavailable') {
      throw new Error('Firestore is unavailable. Please check if Firestore is enabled in Firebase Console.');
    } else if (error?.message?.includes('Missing or insufficient permissions')) {
      throw new Error('Missing permissions. Go to Firebase Console > Firestore > Rules and set: allow read, write: if true;');
    }
    
    throw new Error(`Failed to create post: ${error?.message || 'Unknown error'}`);
  }
}

/**
 * Fetch journey posts with pagination
 */
export async function fetchJourneyPosts(
  lastDoc?: any
): Promise<{ posts: JourneyPost[]; lastDoc: any }> {
  try {
    console.log('📥 Fetching journey posts...');
    console.log('DB instance:', db ? 'OK' : 'NULL');
    console.log('Collection:', COLLECTION_NAME);
    
    let q = query(
      collection(db, COLLECTION_NAME),
      orderBy('timestamp', 'desc'),
      limit(POSTS_PER_PAGE)
    );

    if (lastDoc) {
      q = query(q, startAfter(lastDoc));
    }

    const querySnapshot = await getDocs(q);
    const posts: JourneyPost[] = [];

    querySnapshot.forEach((doc) => {
      posts.push({
        id: doc.id,
        ...doc.data(),
      } as JourneyPost);
    });

    const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];

    console.log('✅ Fetched journey posts:', posts.length);
    return { posts, lastDoc: lastVisible };
  } catch (error: any) {
    console.error('❌ Error fetching journey posts:', error);
    console.error('Error code:', error?.code);
    console.error('Error message:', error?.message);
    
    // Provide specific error messages
    if (error?.code === 'permission-denied') {
      throw new Error('Firebase permission denied. Please set Firestore rules to allow read access.');
    } else if (error?.code === 'unavailable') {
      throw new Error('Firestore unavailable. Please enable Firestore in Firebase Console.');
    } else if (error?.message?.includes('indexes')) {
      throw new Error('Missing Firestore index. Check the console error link to create it.');
    }
    
    throw new Error(`Failed to fetch posts: ${error?.message || 'Unknown error'}`);
  }
}

/**
 * Like a journey post
 */
export async function likeJourneyPost(postId: string): Promise<void> {
  try {
    const postRef = doc(db, COLLECTION_NAME, postId);
    await updateDoc(postRef, {
      likes: increment(1),
    });
    console.log('✅ Post liked:', postId);
  } catch (error) {
    console.error('❌ Error liking post:', error);
    throw new Error('Failed to like post');
  }
}

/**
 * Increment comment count
 */
export async function incrementCommentCount(postId: string): Promise<void> {
  try {
    const postRef = doc(db, COLLECTION_NAME, postId);
    await updateDoc(postRef, {
      comments: increment(1),
    });
    console.log('✅ Comment count incremented:', postId);
  } catch (error) {
    console.error('❌ Error incrementing comment count:', error);
    throw new Error('Failed to update comment count');
  }
}
