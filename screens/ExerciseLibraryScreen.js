// screens/ExerciseLibraryScreen.js
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const ExerciseLibraryScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All', icon: 'fitness-center' },
    { id: 'lowImpact', name: 'Low Impact', icon: 'accessible' },
    { id: 'cardio', name: 'Cardio', icon: 'directions-run' },
    { id: 'strength', name: 'Strength', icon: 'fitness-center' },
    { id: 'flexibility', name: 'Flexibility', icon: 'yoga' },
  ];

  const exercises = [
    {
      id: 1,
      name: 'Walking',
      category: 'lowImpact',
      duration: '30 min',
      intensity: 'Low',
      difficulty: 'Beginner',
      description: 'Perfect low-impact exercise to start your fitness journey',
    },
    {
      id: 2,
      name: 'Swimming',
      category: 'cardio',
      duration: '30 min',
      intensity: 'Low-Medium',
      difficulty: 'Beginner',
      description: 'Full body workout with zero joint impact',
    },
    {
      id: 3,
      name: 'Chair Yoga',
      category: 'flexibility',
      duration: '20 min',
      intensity: 'Low',
      difficulty: 'Beginner',
      description: 'Gentle stretching and breathing exercises',
    },
    {
      id: 4,
      name: 'Stationary Bike',
      category: 'cardio',
      duration: '30 min',
      intensity: 'Medium',
      difficulty: 'Beginner',
      description: 'Low-impact cardio workout',
    },
    {
      id: 5,
      name: 'Bodyweight Squats',
      category: 'strength',
      duration: '3x12 reps',
      intensity: 'Medium',
      difficulty: 'Intermediate',
      description: 'Build lower body strength',
    },
  ];

  const filteredExercises = exercises.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || exercise.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <ScrollView style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <MaterialIcons name="search" size={24} color="#666" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search exercises..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryButton,
              selectedCategory === category.id && styles.selectedCategory,
            ]}
            onPress={() => setSelectedCategory(category.id)}
          >
            <MaterialIcons
              name={category.icon}
              size={20}
              color={selectedCategory === category.id ? '#fff' : '#667eea'}
            />
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category.id && styles.selectedCategoryText,
              ]}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Exercise List */}
      <View style={styles.exercisesContainer}>
        {filteredExercises.map((exercise) => (
          <TouchableOpacity key={exercise.id} style={styles.exerciseCard}>
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              style={styles.exerciseIcon}
            >
              <MaterialIcons name="fitness-center" size={30} color="#fff" />
            </LinearGradient>
            <View style={styles.exerciseInfo}>
              <Text style={styles.exerciseName}>{exercise.name}</Text>
              <Text style={styles.exerciseDescription}>{exercise.description}</Text>
              <View style={styles.exerciseTags}>
                <View style={styles.tag}>
                  <MaterialIcons name="timer" size={14} color="#667eea" />
                  <Text style={styles.tagText}>{exercise.duration}</Text>
                </View>
                <View style={styles.tag}>
                  <MaterialIcons name="speed" size={14} color="#667eea" />
                  <Text style={styles.tagText}>{exercise.intensity}</Text>
                </View>
                <View style={styles.tag}>
                  <MaterialIcons name="school" size={14} color="#667eea" />
                  <Text style={styles.tagText}>{exercise.difficulty}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 15,
    paddingHorizontal: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  categoriesContainer: {
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  selectedCategory: {
    backgroundColor: '#667eea',
  },
  categoryText: {
    marginLeft: 5,
    color: '#667eea',
    fontWeight: '500',
  },
  selectedCategoryText: {
    color: '#fff',
  },
  exercisesContainer: {
    padding: 15,
  },
  exerciseCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  exerciseIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  exerciseDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  exerciseTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 12,
    color: '#667eea',
    marginLeft: 4,
  },
});

export default ExerciseLibraryScreen;