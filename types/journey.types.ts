/**
 * Journey Post Types
 * Types for social journey sharing feature
 */

export interface JourneyPost {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  routeName: string;
  startLocation: string;
  endLocation: string;
  rating: number; // 1-5 stars
  review: string;
  distance?: string;
  duration?: string;
  tags?: string[];
  timestamp: Date | { seconds: number; nanoseconds: number }; // Firebase Timestamp or Date
  likes: number;
  comments: number;
}

export interface CreatePostData {
  routeName: string;
  startLocation: string;
  endLocation: string;
  rating: number;
  review: string;
  distance?: string;
  duration?: string;
  tags?: string[];
}
