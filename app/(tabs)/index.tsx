/**
 * Home Screen - Journey Feed
 * Social feed for sharing journey experiences
 */

import { CreatePostModal } from '@/components/journey/create-post-modal';
import { JourneyFeed } from '@/components/journey/journey-feed';
import {
  createJourneyPost,
  fetchJourneyPosts,
  likeJourneyPost,
  testFirebaseConnection,
} from '@/services/journey.service';
import { CreatePostData, JourneyPost } from '@/types/journey.types';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const [posts, setPosts] = useState<JourneyPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [lastDoc, setLastDoc] = useState<any>(null);

  // Test Firebase on mount
  useEffect(() => {
    testFirebaseConnection();
    loadInitialPosts();
  }, []);

  const loadInitialPosts = async () => {
    try {
      setLoading(true);
      const { posts: initialPosts, lastDoc: newLastDoc } = await fetchJourneyPosts();
      setPosts(initialPosts);
      setLastDoc(newLastDoc);
    } catch (error) {
      console.error('Error loading posts:', error);
      Alert.alert('Error', 'Could not load posts. Check Firebase configuration.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      const { posts: freshPosts, lastDoc: newLastDoc } = await fetchJourneyPosts();
      setPosts(freshPosts);
      setLastDoc(newLastDoc);
    } catch (error) {
      console.error('Error refreshing:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleLoadMore = async () => {
    if (!lastDoc) return;
    try {
      const { posts: morePosts, lastDoc: newLastDoc } = await fetchJourneyPosts(lastDoc);
      setPosts((prev) => [...prev, ...morePosts]);
      setLastDoc(newLastDoc);
    } catch (error) {
      console.error('Error loading more posts:', error);
    }
  };

  const handleCreatePost = async (data: CreatePostData) => {
    try {
      const userId = 'demo-user';
      const userName = 'Demo User';

      const postId = await createJourneyPost(userId, userName, data);
      console.log('Post created:', postId);

      setShowCreateModal(false);
      Alert.alert('Success!', 'Your journey has been posted! ', [{ text: 'OK' }]);
      handleRefresh();
    } catch (error: any) {
      console.error('Error creating post:', error);
      Alert.alert(
        'Failed to Post',
        error?.message || 'Could not create post. Please check Firebase configuration.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleLike = async (postId: string) => {
    try {
      await likeJourneyPost(postId);
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId ? { ...post, likes: post.likes + 1 } : post
        )
      );
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleComment = (postId: string) => {
    console.log('Comment on post:', postId);
  };

  return (
    <View style={styles.container}>
      <JourneyFeed
        posts={posts}
        loading={loading}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        onLoadMore={handleLoadMore}
        onLike={handleLike}
        onComment={handleComment}
      />
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setShowCreateModal(true)}
        activeOpacity={0.8}>
        <Ionicons name="add" size={32} color="#FFFFFF" />
      </TouchableOpacity>
      <CreatePostModal
        visible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreatePost}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4285F4',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});
