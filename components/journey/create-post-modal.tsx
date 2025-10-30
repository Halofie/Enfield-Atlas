/**
 * Create Journey Post Modal
 * Modal for creating new journey reviews
 */

import { CreatePostData } from '@/types/journey.types';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface CreatePostModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: CreatePostData) => void;
}

export function CreatePostModal({ visible, onClose, onSubmit }: CreatePostModalProps) {
  const [routeName, setRouteName] = useState('');
  const [startLocation, setStartLocation] = useState('');
  const [endLocation, setEndLocation] = useState('');
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');

  const handleSubmit = () => {
    if (!routeName || !startLocation || !endLocation || rating === 0 || !review) {
      alert('Please fill in all required fields');
      return;
    }

    const data: CreatePostData = {
      routeName,
      startLocation,
      endLocation,
      rating,
      review,
      distance: distance || undefined,
      duration: duration || undefined,
    };

    onSubmit(data);
    
    // Reset form
    setRouteName('');
    setStartLocation('');
    setEndLocation('');
    setRating(0);
    setReview('');
    setDistance('');
    setDuration('');
  };

  const renderStars = () => {
    return (
      <View style={styles.starsContainer}>
        {Array.from({ length: 5 }).map((_, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => setRating(index + 1)}
            activeOpacity={0.7}>
            <Ionicons
              name={index < rating ? 'star' : 'star-outline'}
              size={32}
              color={index < rating ? '#FFB800' : '#CCC'}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={28} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Share Your Journey</Text>
          <TouchableOpacity onPress={handleSubmit} style={styles.postButton}>
            <Text style={styles.postButtonText}>Post</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Route Name */}
          <View style={styles.section}>
            <Text style={styles.label}>Route Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Morning Commute, Weekend Drive"
              value={routeName}
              onChangeText={setRouteName}
              placeholderTextColor="#999"
            />
          </View>

          {/* Locations */}
          <View style={styles.section}>
            <Text style={styles.label}>Start Location *</Text>
            <View style={styles.inputWithIcon}>
              <Ionicons name="navigate-circle" size={20} color="#4CAF50" />
              <TextInput
                style={styles.inputInline}
                placeholder="Starting point"
                value={startLocation}
                onChangeText={setStartLocation}
                placeholderTextColor="#999"
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>End Location *</Text>
            <View style={styles.inputWithIcon}>
              <Ionicons name="flag" size={20} color="#F44336" />
              <TextInput
                style={styles.inputInline}
                placeholder="Destination"
                value={endLocation}
                onChangeText={setEndLocation}
                placeholderTextColor="#999"
              />
            </View>
          </View>

          {/* Rating */}
          <View style={styles.section}>
            <Text style={styles.label}>Route Rating *</Text>
            {renderStars()}
            <Text style={styles.ratingHint}>
              {rating === 0 ? 'Tap to rate' : `${rating} star${rating > 1 ? 's' : ''}`}
            </Text>
          </View>

          {/* Review */}
          <View style={styles.section}>
            <Text style={styles.label}>Your Review *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Share your experience... How was the road condition? Traffic? Scenic views?"
              value={review}
              onChangeText={setReview}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              placeholderTextColor="#999"
            />
          </View>

          {/* Optional Info */}
          <View style={styles.optionalSection}>
            <Text style={styles.sectionTitle}>Optional Details</Text>
            
            <View style={styles.row}>
              <View style={[styles.section, styles.halfWidth]}>
                <Text style={styles.label}>Distance</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., 15 km"
                  value={distance}
                  onChangeText={setDistance}
                  placeholderTextColor="#999"
                />
              </View>

              <View style={[styles.section, styles.halfWidth]}>
                <Text style={styles.label}>Duration</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., 30 min"
                  value={duration}
                  onChangeText={setDuration}
                  placeholderTextColor="#999"
                />
              </View>
            </View>
          </View>

          <View style={styles.bottomPadding} />
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  closeButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  postButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  postButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    color: '#333',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  inputInline: {
    flex: 1,
    padding: 12,
    fontSize: 15,
    color: '#333',
  },
  textArea: {
    height: 120,
    paddingTop: 12,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 12,
  },
  ratingHint: {
    textAlign: 'center',
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  optionalSection: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    flex: 1,
    marginHorizontal: 4,
  },
  bottomPadding: {
    height: 40,
  },
});
