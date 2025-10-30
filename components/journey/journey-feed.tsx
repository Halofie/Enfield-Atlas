/**
 * Journey Feed Component
 * Displays a feed of journey posts
 */

import { JourneyPost } from '@/types/journey.types';
import React from 'react';
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { JourneyPostCard } from './journey-post-card';

interface JourneyFeedProps {
  posts: JourneyPost[];
  loading?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  onLoadMore?: () => void;
  onLike?: (postId: string) => void;
  onComment?: (postId: string) => void;
  onShare?: (postId: string) => void;
}

export function JourneyFeed({
  posts,
  loading = false,
  refreshing = false,
  onRefresh,
  onLoadMore,
  onLike,
  onComment,
  onShare,
}: JourneyFeedProps) {
  if (loading && posts.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>Loading journeys...</Text>
      </View>
    );
  }

  if (!loading && posts.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyIcon}>🗺️</Text>
        <Text style={styles.emptyTitle}>No Journeys Yet</Text>
        <Text style={styles.emptyText}>
          Be the first to share your journey experience!
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <JourneyPostCard
          post={item}
          onLike={() => onLike?.(item.id)}
          onComment={() => onComment?.(item.id)}
        />
      )}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#2196F3']}
            tintColor="#2196F3"
          />
        ) : undefined
      }
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        loading ? (
          <View style={styles.footerLoader}>
            <ActivityIndicator size="small" color="#2196F3" />
          </View>
        ) : null
      }
    />
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#F5F5F5',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
  },
  listContent: {
    paddingBottom: 80, // Space for FAB
  },
  footerLoader: {
    paddingVertical: 20,
  },
});
