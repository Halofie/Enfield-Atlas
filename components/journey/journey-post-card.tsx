/**
 * Journey Post Card
 * Individual post card for the journey feed
 */

import { JourneyPost } from '@/types/journey.types';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface JourneyPostCardProps {
  post: JourneyPost;
  onLike?: (postId: string) => void;
  onComment?: (postId: string) => void;
}

export function JourneyPostCard({ post, onLike, onComment }: JourneyPostCardProps) {
  const formatTimestamp = (timestamp: Date | { seconds: number; nanoseconds: number }) => {
    // Convert Firebase Timestamp to Date if needed
    const date = timestamp instanceof Date 
      ? timestamp 
      : new Date(timestamp.seconds * 1000);
    
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Ionicons
        key={index}
        name={index < rating ? 'star' : 'star-outline'}
        size={16}
        color={index < rating ? '#FFB800' : '#CCC'}
      />
    ));
  };

  return (
    <View style={styles.card}>
      {/* User Header */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{post.userName.charAt(0).toUpperCase()}</Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{post.userName}</Text>
          <Text style={styles.timestamp}>{formatTimestamp(post.timestamp)}</Text>
        </View>
      </View>

      {/* Route Info */}
      <View style={styles.routeInfo}>
        <View style={styles.routeHeader}>
          <Ionicons name="location" size={18} color="#2196F3" />
          <Text style={styles.routeName}>{post.routeName}</Text>
        </View>
        <View style={styles.locationRow}>
          <Ionicons name="navigate-circle" size={14} color="#4CAF50" />
          <Text style={styles.locationText}>{post.startLocation}</Text>
        </View>
        <View style={styles.locationRow}>
          <Ionicons name="flag" size={14} color="#F44336" />
          <Text style={styles.locationText}>{post.endLocation}</Text>
        </View>
      </View>

      {/* Rating */}
      <View style={styles.ratingContainer}>
        <View style={styles.stars}>{renderStars(post.rating)}</View>
        <Text style={styles.ratingText}>{post.rating}.0</Text>
      </View>

      {/* Review Text */}
      <Text style={styles.reviewText}>{post.review}</Text>

      {/* Distance & Duration */}
      {(post.distance || post.duration) && (
        <View style={styles.metaContainer}>
          {post.distance && (
            <View style={styles.metaItem}>
              <Ionicons name="car" size={14} color="#666" />
              <Text style={styles.metaText}>{post.distance}</Text>
            </View>
          )}
          {post.duration && (
            <View style={styles.metaItem}>
              <Ionicons name="time" size={14} color="#666" />
              <Text style={styles.metaText}>{post.duration}</Text>
            </View>
          )}
        </View>
      )}

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <View style={styles.tagsContainer}>
          {post.tags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>#{tag}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => onLike?.(post.id)}
          activeOpacity={0.7}>
          <Ionicons name="heart-outline" size={20} color="#666" />
          <Text style={styles.actionText}>{post.likes}</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => onComment?.(post.id)}
          activeOpacity={0.7}>
          <Ionicons name="chatbubble-outline" size={20} color="#666" />
          <Text style={styles.actionText}>{post.comments}</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionButton}
          activeOpacity={0.7}>
          <Ionicons name="share-social-outline" size={20} color="#666" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  routeInfo: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  routeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  routeName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginLeft: 6,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  locationText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 6,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  stars: {
    flexDirection: 'row',
    marginRight: 8,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  reviewText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 12,
  },
  metaContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  metaText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  tag: {
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 6,
    marginBottom: 6,
  },
  tagText: {
    fontSize: 12,
    color: '#2196F3',
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  actionText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
  },
});
