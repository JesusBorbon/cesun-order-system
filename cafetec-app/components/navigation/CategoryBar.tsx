import React from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { CATEGORIES } from '@/constants/Products';

interface CategoryBarProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export const CategoryBar = ({ selectedCategory, onSelectCategory }: CategoryBarProps) => {
  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.list}>
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat}
            onPress={() => onSelectCategory(cat)}
            style={[styles.badge, selectedCategory === cat && styles.activeBadge]}
          >
            <ThemedText style={[styles.text, selectedCategory === cat && styles.activeText]}>
              {cat}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { height: 50, marginBottom: 20 },
  list: { alignItems: 'center', gap: 10, paddingRight: 20 },
  badge: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E7E4',
  },
  activeBadge: { backgroundColor: '#5F8575', borderColor: '#5F8575' },
  text: { color: '#5F8575', fontSize: 14, fontWeight: '600' },
  activeText: { color: '#FFFFFF' },
});