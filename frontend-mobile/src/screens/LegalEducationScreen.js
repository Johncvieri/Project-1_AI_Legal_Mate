import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, FlatList } from 'react-native';

const LegalEducationScreen = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [educationModules] = useState([
    {
      id: 1,
      title: 'Introduction to Indonesian Law',
      description: 'Learn the basics of the Indonesian legal system',
      category: 'basics',
      difficulty: 'beginner',
      duration: '30 min',
      completed: true,
    },
    {
      id: 2,
      title: 'Contract Law Fundamentals',
      description: 'Understanding essential principles of contract law in Indonesia',
      category: 'contracts',
      difficulty: 'intermediate',
      duration: '45 min',
      completed: false,
    },
    {
      id: 3,
      title: 'Corporate Law Overview',
      description: 'Key concepts in Indonesian corporate law',
      category: 'corporate',
      difficulty: 'intermediate',
      duration: '60 min',
      completed: false,
    },
    {
      id: 4,
      title: 'Family Law in Indonesia',
      description: 'Legal aspects of marriage, divorce, and family relations',
      category: 'family',
      difficulty: 'beginner',
      duration: '40 min',
      completed: true,
    },
    {
      id: 5,
      title: 'Property Law Essentials',
      description: 'Understanding property rights and regulations',
      category: 'property',
      difficulty: 'intermediate',
      duration: '50 min',
      completed: false,
    },
    {
      id: 6,
      title: 'Employment Law Basics',
      description: 'Rights and obligations in employer-employee relationships',
      category: 'employment',
      difficulty: 'beginner',
      duration: '35 min',
      completed: false,
    }
  ]);

  const categories = [
    { id: 'all', name: 'All' },
    { id: 'basics', name: 'Basics' },
    { id: 'contracts', name: 'Contracts' },
    { id: 'corporate', name: 'Corporate' },
    { id: 'family', name: 'Family' },
    { id: 'property', name: 'Property' },
    { id: 'employment', name: 'Employment' },
  ];

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return '#10B981';
      case 'intermediate': return '#F59E0B';
      case 'advanced': return '#EF4444';
      default: return '#9CA3AF';
    }
  };

  const filteredModules = selectedCategory === 'all' 
    ? educationModules 
    : educationModules.filter(module => module.category === selectedCategory);

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        selectedCategory === item.id && styles.categoryItemSelected
      ]}
      onPress={() => setSelectedCategory(item.id)}
    >
      <Text style={[
        styles.categoryText,
        selectedCategory === item.id && styles.categoryTextSelected
      ]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderModuleItem = ({ item }) => (
    <View style={styles.moduleItem}>
      <View style={styles.moduleHeader}>
        <Text style={styles.moduleTitle}>{item.title}</Text>
        {item.completed && (
          <View style={styles.completedBadge}>
            <Text style={styles.completedText}>Completed</Text>
          </View>
        )}
      </View>
      <Text style={styles.moduleDescription}>{item.description}</Text>
      <View style={styles.moduleMeta}>
        <View style={styles.metaItem}>
          <Text style={styles.metaText}>{item.duration}</Text>
        </View>
        <View style={[styles.metaItem, { backgroundColor: getDifficultyColor(item.difficulty) }]}>
          <Text style={styles.metaText}>{item.difficulty}</Text>
        </View>
      </View>
      <TouchableOpacity 
        style={styles.startButton}
        onPress={() => console.log('Start module:', item.id)}
      >
        <Text style={styles.startButtonText}>
          {item.completed ? 'Review' : 'Start Learning'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Legal Education</Text>
        <Text style={styles.headerSubtitle}>Expand your legal knowledge</Text>
      </View>

      <View style={styles.categoriesContainer}>
        <FlatList
          horizontal
          data={categories}
          renderItem={renderCategoryItem}
          keyExtractor={item => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />
      </View>

      <FlatList
        data={filteredModules}
        renderItem={renderModuleItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.modulesList}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
  categoriesContainer: {
    backgroundColor: '#ffffff',
    paddingVertical: 15,
    marginBottom: 10,
  },
  categoriesList: {
    paddingHorizontal: 20,
  },
  categoryItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
  },
  categoryItemSelected: {
    backgroundColor: '#2563eb',
  },
  categoryText: {
    color: '#64748b',
    fontSize: 14,
  },
  categoryTextSelected: {
    color: '#fff',
  },
  modulesList: {
    padding: 20,
  },
  moduleItem: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  moduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  moduleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    flex: 1,
    marginRight: 10,
  },
  completedBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  completedText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  moduleDescription: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 15,
  },
  moduleMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  metaItem: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  metaText: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: '600',
  },
  startButton: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default LegalEducationScreen;