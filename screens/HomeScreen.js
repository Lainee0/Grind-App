import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  // State for modals
  const [goalModalVisible, setGoalModalVisible] = useState(false);
  const [workoutModalVisible, setWorkoutModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // State for new goal form
  const [newGoal, setNewGoal] = useState({
    name: '',
    target: '',
    unit: 'kg',
    deadline: '',
    icon: 'flag',
    color: '#2ecc71', // Green
  });

  // State for new workout form
  const [newWorkout, setNewWorkout] = useState({
    name: '',
    duration: '',
    exercises: '',
    intensity: 'Low',
    icon: 'fitness-center',
    color1: '#2ecc71', // Green
    color2: '#27ae60', // Darker Green
  });

  // Workout Goals State
  const [workoutGoals, setWorkoutGoals] = useState([]);

  // Created Workouts State
  const [createdWorkouts, setCreatedWorkouts] = useState([]);

  const tips = [
    { text: 'Start with 10-minute walks daily', icon: 'directions-walk', category: 'Beginner' },
    { text: 'Stay hydrated before, during, and after exercise', icon: 'water-drop', category: 'Nutrition' },
    { text: 'Listen to your body - rest when needed', icon: 'self-improvement', category: 'Wellness' },
    { text: 'Celebrate small victories!', icon: 'celebration', category: 'Motivation' },
  ];

  // Load data from AsyncStorage when component mounts
  useEffect(() => {
    loadUserData();
  }, []);

  // Save data whenever workoutGoals or createdWorkouts change
  useEffect(() => {
    if (!loading) {
      saveUserData();
    }
  }, [workoutGoals, createdWorkouts]);

  // Load user data from AsyncStorage
  const loadUserData = async () => {
    try {
      setLoading(true);
      
      // Load goals
      const savedGoals = await AsyncStorage.getItem('userGoals');
      if (savedGoals !== null) {
        setWorkoutGoals(JSON.parse(savedGoals));
      } else {
        // Initialize with default goals if no saved data
        const defaultGoals = [
          { 
            id: 1, 
            name: 'Weight Loss', 
            target: '5', 
            progress: 2.5, 
            unit: 'kg',
            icon: 'monitor-weight',
            color: '#2ecc71', // Green
            deadline: '30 days left',
            createdAt: new Date().toISOString()
          },
          { 
            id: 2, 
            name: 'Daily Steps', 
            target: '10000', 
            progress: 6543, 
            unit: 'steps',
            icon: 'directions-walk',
            color: '#27ae60', // Darker Green
            deadline: 'Today',
            createdAt: new Date().toISOString()
          },
          { 
            id: 3, 
            name: 'Workout Sessions', 
            target: '20', 
            progress: 12, 
            unit: 'sessions',
            icon: 'fitness-center',
            color: '#2c3e50', // Black/Charcoal
            deadline: 'This month',
            createdAt: new Date().toISOString()
          },
        ];
        setWorkoutGoals(defaultGoals);
        await AsyncStorage.setItem('userGoals', JSON.stringify(defaultGoals));
      }

      // Load workouts
      const savedWorkouts = await AsyncStorage.getItem('userWorkouts');
      if (savedWorkouts !== null) {
        setCreatedWorkouts(JSON.parse(savedWorkouts));
      } else {
        // Initialize with default workouts if no saved data
        const defaultWorkouts = [
          {
            id: 1,
            name: 'Full Body Stretch',
            duration: '20 mins',
            exercises: 8,
            intensity: 'Low',
            icon: 'self-improvement',
            color: ['#2ecc71', '#27ae60'], // Green gradients
            lastPerformed: '2 days ago',
            createdAt: new Date().toISOString()
          },
          {
            id: 2,
            name: 'Cardio Light',
            duration: '30 mins',
            exercises: 12,
            intensity: 'Medium',
            icon: 'directions-run',
            color: ['#27ae60', '#2c3e50'], // Green to Black
            lastPerformed: '5 days ago',
            createdAt: new Date().toISOString()
          },
          {
            id: 3,
            name: 'Morning Yoga',
            duration: '15 mins',
            exercises: 6,
            intensity: 'Low',
            icon: 'yoga',
            color: ['#2ecc71', '#2c3e50'], // Green to Black
            lastPerformed: 'Yesterday',
            createdAt: new Date().toISOString()
          },
          {
            id: 4,
            name: 'Chair Exercises',
            duration: '25 mins',
            exercises: 10,
            intensity: 'Low',
            icon: 'airline-seat-recline-normal',
            color: ['#27ae60', '#1e2b3a'], // Dark Green to Darker Black
            lastPerformed: '1 week ago',
            createdAt: new Date().toISOString()
          },
        ];
        setCreatedWorkouts(defaultWorkouts);
        await AsyncStorage.setItem('userWorkouts', JSON.stringify(defaultWorkouts));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      Alert.alert('Error', 'Failed to load your data');
    } finally {
      setLoading(false);
    }
  };

  // Save user data to AsyncStorage
  const saveUserData = async () => {
    try {
      await AsyncStorage.setItem('userGoals', JSON.stringify(workoutGoals));
      await AsyncStorage.setItem('userWorkouts', JSON.stringify(createdWorkouts));
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  const getCurrentGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Function to add new goal
  const addNewGoal = () => {
    if (!newGoal.name || !newGoal.target || !newGoal.deadline) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    // Generate a unique ID based on timestamp
    const newId = Date.now();

    const goal = {
      id: newId,
      name: newGoal.name,
      target: newGoal.target,
      progress: 0,
      unit: newGoal.unit,
      icon: newGoal.icon,
      color: newGoal.color,
      deadline: newGoal.deadline,
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    };

    const updatedGoals = [...workoutGoals, goal];
    setWorkoutGoals(updatedGoals);
    
    // Reset form and close modal
    setGoalModalVisible(false);
    setNewGoal({
      name: '',
      target: '',
      unit: 'kg',
      deadline: '',
      icon: 'flag',
      color: '#2ecc71',
    });
    
    Alert.alert('Success', 'New goal added successfully!');
  };

  // Function to add new workout
  const addNewWorkout = () => {
    if (!newWorkout.name || !newWorkout.duration || !newWorkout.exercises) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    // Generate a unique ID based on timestamp
    const newId = Date.now();

    const workout = {
      id: newId,
      name: newWorkout.name,
      duration: newWorkout.duration + ' mins',
      exercises: parseInt(newWorkout.exercises),
      intensity: newWorkout.intensity,
      icon: newWorkout.icon,
      color: [newWorkout.color1, newWorkout.color2],
      lastPerformed: 'Just created',
      createdAt: new Date().toISOString(),
      timesCompleted: 0,
    };

    const updatedWorkouts = [...createdWorkouts, workout];
    setCreatedWorkouts(updatedWorkouts);
    
    // Reset form and close modal
    setWorkoutModalVisible(false);
    setNewWorkout({
      name: '',
      duration: '',
      exercises: '',
      intensity: 'Low',
      icon: 'fitness-center',
      color1: '#2ecc71',
      color2: '#27ae60',
    });
    
    Alert.alert('Success', 'New workout created successfully!');
  };

  // Function to delete goal
  const deleteGoal = (id) => {
    Alert.alert(
      'Delete Goal',
      'Are you sure you want to delete this goal?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const updatedGoals = workoutGoals.filter(goal => goal.id !== id);
            setWorkoutGoals(updatedGoals);
            Alert.alert('Success', 'Goal deleted successfully');
          },
        },
      ]
    );
  };

  // Function to delete workout
  const deleteWorkout = (id) => {
    Alert.alert(
      'Delete Workout',
      'Are you sure you want to delete this workout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const updatedWorkouts = createdWorkouts.filter(workout => workout.id !== id);
            setCreatedWorkouts(updatedWorkouts);
            Alert.alert('Success', 'Workout deleted successfully');
          },
        },
      ]
    );
  };

  // Function to update goal progress
  const updateGoalProgress = (id, newProgress) => {
    const updatedGoals = workoutGoals.map(goal => 
      goal.id === id ? { 
        ...goal, 
        progress: newProgress,
        lastUpdated: new Date().toISOString() 
      } : goal
    );
    setWorkoutGoals(updatedGoals);
  };

  // Function to mark workout as completed
  const completeWorkout = (id) => {
    const updatedWorkouts = createdWorkouts.map(workout => 
      workout.id === id ? { 
        ...workout, 
        timesCompleted: (workout.timesCompleted || 0) + 1,
        lastPerformed: 'Just now',
        lastCompleted: new Date().toISOString()
      } : workout
    );
    setCreatedWorkouts(updatedWorkouts);
    Alert.alert('Great job!', 'Workout completed! Keep up the good work!');
  };

  // Function to clear all user data (for testing)
  const clearAllData = async () => {
    Alert.alert(
      'Clear All Data',
      'Are you sure you want to delete all your goals and workouts? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('userGoals');
              await AsyncStorage.removeItem('userWorkouts');
              setWorkoutGoals([]);
              setCreatedWorkouts([]);
              Alert.alert('Success', 'All data cleared');
            } catch (error) {
              console.error('Error clearing data:', error);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2ecc71" />
        <Text style={styles.loadingText}>Loading your fitness data...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header with Clear Data button (for testing - remove in production) */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Fitness Tracker</Text>
        <TouchableOpacity onPress={clearAllData} style={styles.clearButton}>
          <MaterialIcons name="delete-sweep" size={24} color="#e74c3c" />
        </TouchableOpacity>
      </View>

      {/* Created Workouts Section */}
      <View style={styles.createdWorkoutsContainer}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleContainer}>
            <MaterialIcons name="fitness-center" size={20} color="#2ecc71" />
            <Text style={styles.sectionTitle}>Your Created Workouts ({createdWorkouts.length})</Text>
          </View>
        </View>

        {createdWorkouts.length === 0 ? (
            <View style={styles.emptyStateContainer}>
                {/* Create New Workout Card */}
                <TouchableOpacity 
                style={styles.createWorkoutCard}
                onPress={() => setWorkoutModalVisible(true)}
                >
                <View style={styles.createWorkoutContent}>
                    <View style={styles.createWorkoutIconContainer}>
                    <MaterialIcons name="add" size={40} color="#2ecc71" />
                    </View>
                    <Text style={styles.createWorkoutText}>Create New Workout</Text>
                    <Text style={styles.createWorkoutSubtext}>Design your own routine</Text>
                </View>
                </TouchableOpacity>
            </View>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.createdWorkoutsScroll}
          >
            {createdWorkouts.map((workout) => (
              <TouchableOpacity
                key={workout.id}
                style={styles.createdWorkoutCard}
                onPress={() => completeWorkout(workout.id)}
                onLongPress={() => deleteWorkout(workout.id)}
              >
                <LinearGradient
                  colors={workout.color}
                  style={styles.createdWorkoutGradient}
                >
                  <View style={styles.createdWorkoutHeader}>
                    <MaterialIcons name={workout.icon} size={30} color="#fff" />
                    <View style={styles.lastPerformedBadge}>
                      <MaterialIcons name="access-time" size={12} color="#fff" />
                      <Text style={styles.lastPerformedText}>{workout.lastPerformed}</Text>
                    </View>
                  </View>
                  
                  <Text style={styles.createdWorkoutName}>{workout.name}</Text>
                  
                  <View style={styles.createdWorkoutDetails}>
                    <View style={styles.createdWorkoutDetail}>
                      <MaterialIcons name="timer" size={14} color="#fff" />
                      <Text style={styles.createdWorkoutDetailText}>{workout.duration}</Text>
                    </View>
                    <View style={styles.createdWorkoutDetail}>
                      <MaterialIcons name="fitness-center" size={14} color="#fff" />
                      <Text style={styles.createdWorkoutDetailText}>{workout.exercises} ex</Text>
                    </View>
                    <View style={styles.createdWorkoutDetail}>
                      <MaterialIcons name="speed" size={14} color="#fff" />
                      <Text style={styles.createdWorkoutDetailText}>{workout.intensity}</Text>
                    </View>
                  </View>

                  {workout.timesCompleted > 0 && (
                    <View style={styles.completedBadge}>
                      <MaterialIcons name="check-circle" size={14} color="#fff" />
                      <Text style={styles.completedText}>Completed {workout.timesCompleted}×</Text>
                    </View>
                  )}

                  <TouchableOpacity 
                    style={styles.startWorkoutButton}
                    onPress={() => completeWorkout(workout.id)}
                  >
                    <Text style={styles.startWorkoutButtonText}>Start</Text>
                    <MaterialIcons name="play-arrow" size={16} color="#fff" />
                  </TouchableOpacity>
                </LinearGradient>
              </TouchableOpacity>
            ))}

            {/* Create New Workout Card */}
            <TouchableOpacity 
            style={styles.createWorkoutCard}
            onPress={() => setWorkoutModalVisible(true)}
            >
                <View style={styles.createWorkoutContent}>
                    <View style={styles.createWorkoutIconContainer}>
                    <MaterialIcons name="add" size={40} color="#2ecc71" />
                    </View>
                    <Text style={styles.createWorkoutText}>Create New Workout</Text>
                    <Text style={styles.createWorkoutSubtext}>Design your own routine</Text>
                </View>
            </TouchableOpacity>
          </ScrollView>
        )}
      </View>

      {/* Workout Goals Section */}
      <View style={styles.goalsContainer}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleContainer}>
            <MaterialIcons name="flag" size={20} color="#2ecc71" />
            <Text style={styles.sectionTitle}>Your Fitness Goals ({workoutGoals.length})</Text>
          </View>
        </View>

        {workoutGoals.length === 0 ? (
          <View style={styles.emptyStateContainer}>
            <MaterialIcons name="flag" size={50} color="#ccc" />
            <Text style={styles.emptyStateText}>No goals set yet</Text>
            <Text style={styles.emptyStateSubtext}>Tap "Add New" to create your first goal</Text>
          </View>
        ) : (
          workoutGoals.map((goal) => (
            <TouchableOpacity 
              key={goal.id} 
              style={styles.goalCard}
              onLongPress={() => deleteGoal(goal.id)}
              activeOpacity={0.7}
            >
              <View style={styles.goalHeader}>
                <View style={styles.goalTitleContainer}>
                  <View style={[styles.goalIconContainer, { backgroundColor: goal.color + '20' }]}>
                    <MaterialIcons name={goal.icon} size={20} color={goal.color} />
                  </View>
                  <View>
                    <Text style={styles.goalName}>{goal.name}</Text>
                    <Text style={styles.goalDeadline}>{goal.deadline}</Text>
                  </View>
                </View>
                <Text style={styles.goalTarget}>{goal.target} {goal.unit}</Text>
              </View>
              
              <View style={styles.goalProgressContainer}>
                <View style={styles.goalProgressBar}>
                  <View 
                    style={[
                      styles.goalProgressFill, 
                      { 
                        width: `${(goal.progress / parseFloat(goal.target)) * 100}%`,
                        backgroundColor: goal.color 
                      }
                    ]} 
                  />
                </View>
                <View style={styles.goalProgressTextContainer}>
                  <Text style={styles.goalProgressText}>
                    {goal.progress} {goal.unit}
                  </Text>
                  <Text style={styles.goalProgressTarget}>
                    {goal.target} {goal.unit}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}

        <TouchableOpacity 
          style={styles.addGoalButton}
          onPress={() => setGoalModalVisible(true)}
        >
          <MaterialIcons name="add" size={20} color="#2ecc71" />
          <Text style={styles.addGoalText}>Add New Goal</Text>
        </TouchableOpacity>
      </View>

      {/* Quick Chat Button */}
      <TouchableOpacity
        style={styles.quickChatButton}
        onPress={() => router.push('/chat')}
      >
        <LinearGradient
          colors={['#2ecc71', '#27ae60']}
          style={styles.quickChatGradient}
        >
          <View style={styles.quickChatIconContainer}>
            <MaterialIcons name="chat" size={28} color="#fff" />
          </View>
          <View style={styles.quickChatTextContainer}>
            <Text style={styles.quickChatTitle}>Ask Your Fitness Coach</Text>
            <Text style={styles.quickChatSubtitle}>
              Get personalized advice & tips
            </Text>
          </View>
          <MaterialIcons name="arrow-forward" size={24} color="#fff" />
        </LinearGradient>
      </TouchableOpacity>

      {/* Tips for Success */}
      <View style={styles.tipsContainer}>
        <View style={styles.tipsHeader}>
          <Text style={styles.tipsTitle}>💡 Tips for Success</Text>
        </View>
        {tips.map((tip, index) => (
          <View key={index} style={styles.tipItem}>
            <View style={styles.tipIconContainer}>
              <LinearGradient
                colors={['#2ecc71', '#27ae60']}
                style={styles.tipIconGradient}
              >
                <MaterialIcons name={tip.icon} size={16} color="#fff" />
              </LinearGradient>
            </View>
            <View style={styles.tipContent}>
              <Text style={styles.tipText}>{tip.text}</Text>
              <Text style={styles.tipCategory}>{tip.category}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Add Goal Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={goalModalVisible}
        onRequestClose={() => setGoalModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Goal</Text>
              <TouchableOpacity onPress={() => setGoalModalVisible(false)}>
                <MaterialIcons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Goal Name (e.g., Weight Loss)"
              value={newGoal.name}
              onChangeText={(text) => setNewGoal({...newGoal, name: text})}
            />

            <TextInput
              style={styles.input}
              placeholder="Target (e.g., 10)"
              value={newGoal.target}
              onChangeText={(text) => setNewGoal({...newGoal, target: text})}
              keyboardType="numeric"
            />

            <View style={styles.pickerContainer}>
              <Text style={styles.pickerLabel}>Unit:</Text>
              <View style={styles.unitButtons}>
                {['kg', 'steps', 'sessions', 'mins'].map((unit) => (
                  <TouchableOpacity
                    key={unit}
                    style={[
                      styles.unitButton,
                      newGoal.unit === unit && styles.unitButtonActive
                    ]}
                    onPress={() => setNewGoal({...newGoal, unit})}
                  >
                    <Text style={[
                      styles.unitButtonText,
                      newGoal.unit === unit && styles.unitButtonTextActive
                    ]}>{unit}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Deadline (e.g., 30 days left)"
              value={newGoal.deadline}
              onChangeText={(text) => setNewGoal({...newGoal, deadline: text})}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setGoalModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={addNewGoal}
              >
                <Text style={styles.saveButtonText}>Add Goal</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Add Workout Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={workoutModalVisible}
        onRequestClose={() => setWorkoutModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create New Workout</Text>
              <TouchableOpacity onPress={() => setWorkoutModalVisible(false)}>
                <MaterialIcons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Workout Name"
              value={newWorkout.name}
              onChangeText={(text) => setNewWorkout({...newWorkout, name: text})}
            />

            <TextInput
              style={styles.input}
              placeholder="Duration (e.g., 30)"
              value={newWorkout.duration}
              onChangeText={(text) => setNewWorkout({...newWorkout, duration: text})}
              keyboardType="numeric"
            />

            <TextInput
              style={styles.input}
              placeholder="Number of Exercises"
              value={newWorkout.exercises}
              onChangeText={(text) => setNewWorkout({...newWorkout, exercises: text})}
              keyboardType="numeric"
            />

            <View style={styles.pickerContainer}>
              <Text style={styles.pickerLabel}>Intensity:</Text>
              <View style={styles.unitButtons}>
                {['Low', 'Medium', 'High'].map((intensity) => (
                  <TouchableOpacity
                    key={intensity}
                    style={[
                      styles.unitButton,
                      newWorkout.intensity === intensity && styles.unitButtonActive
                    ]}
                    onPress={() => setNewWorkout({...newWorkout, intensity})}
                  >
                    <Text style={[
                      styles.unitButtonText,
                      newWorkout.intensity === intensity && styles.unitButtonTextActive
                    ]}>{intensity}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setWorkoutModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={addNewWorkout}
              >
                <Text style={styles.saveButtonText}>Create Workout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  clearButton: {
    padding: 8,
  },
  welcomeSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 30,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  welcomeContent: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 5,
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  quoteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  motivationText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    fontStyle: 'italic',
    marginLeft: 5,
    flex: 1,
  },
  profileCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  todayWorkoutCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: -20,
    padding: 15,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  todayWorkoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  todayWorkoutTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  timeBadgeText: {
    fontSize: 12,
    color: '#2ecc71',
    marginLeft: 4,
  },
  todayWorkoutContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  workoutIconContainer: {
    marginRight: 12,
  },
  workoutIconGradient: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  workoutInfo: {
    flex: 1,
  },
  workoutName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  workoutMetaContainer: {
    flexDirection: 'row',
  },
  workoutMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  workoutMetaText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  startNowButton: {
    backgroundColor: '#2ecc71',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  startNowText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    marginTop: 10,
  },
  statCard: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    width: width * 0.2,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 2,
  },
  statLabel: {
    fontSize: 11,
    color: '#666',
    marginTop: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginLeft: 8,
  },
  seeAllText: {
    color: '#2ecc71',
    fontSize: 14,
  },
  emptyStateContainer: {
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#fff',
    borderRadius: 15,
    marginBottom: 10,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginTop: 10,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 5,
    textAlign: 'center',
  },
  // Goals Section Styles
  goalsContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  goalCard: {
    marginBottom: 15,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  goalTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  goalIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  goalName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  goalDeadline: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
  },
  goalTarget: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  goalProgressContainer: {
    marginLeft: 46,
  },
  goalProgressBar: {
    height: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 3,
    marginBottom: 4,
  },
  goalProgressFill: {
    height: 6,
    borderRadius: 3,
  },
  goalProgressTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  goalProgressText: {
    fontSize: 11,
    color: '#666',
  },
  goalProgressTarget: {
    fontSize: 11,
    color: '#999',
  },
  addGoalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    marginTop: 5,
  },
  addGoalText: {
    color: '#2ecc71',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 5,
  },
  // Created Workouts Section Styles
  createdWorkoutsContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
    marginTop: 10,
  },
  createdWorkoutsScroll: {
    marginTop: 10,
  },
  createdWorkoutCard: {
    width: 240,
    marginRight: 15,
    borderRadius: 15,
    overflow: 'hidden',
  },
  createdWorkoutGradient: {
    padding: 15,
  },
  createdWorkoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  lastPerformedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  lastPerformedText: {
    color: '#fff',
    fontSize: 10,
    marginLeft: 4,
  },
  createdWorkoutName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  createdWorkoutDetails: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  createdWorkoutDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  createdWorkoutDetailText: {
    color: '#fff',
    fontSize: 11,
    marginLeft: 4,
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#27ae60',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  completedText: {
    color: '#fff',
    fontSize: 10,
    marginLeft: 4,
  },
  startWorkoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  startWorkoutButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginRight: 4,
  },
  createWorkoutCard: {
    width: 200,
    height: 180,
    backgroundColor: '#fff',
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#2ecc71',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  createWorkoutContent: {
    alignItems: 'center',
    padding: 15,
  },
  createWorkoutIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2ecc7120',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  createWorkoutText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2ecc71',
    textAlign: 'center',
  },
  createWorkoutSubtext: {
    fontSize: 11,
    color: '#999',
    textAlign: 'center',
    marginTop: 4,
  },
  achievementsContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  achievementsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  achievementsGrid: {
    gap: 15,
  },
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  achievementIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: '#f0f0f0',
    borderRadius: 2,
    marginBottom: 4,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
  },
  progressText: {
    fontSize: 11,
    color: '#666',
  },
  quickChatButton: {
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 15,
    overflow: 'hidden',
  },
  quickChatGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  quickChatIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickChatTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  quickChatTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  quickChatSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
  },
  tipsContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tipsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  moreTipsText: {
    color: '#2ecc71',
    fontSize: 12,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tipIconContainer: {
    marginRight: 12,
  },
  tipIconGradient: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tipContent: {
    flex: 1,
  },
  tipText: {
    color: '#333',
    fontSize: 14,
  },
  tipCategory: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
  },
  challengeBanner: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 15,
    overflow: 'hidden',
  },
  challengeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  challengeContent: {
    flex: 1,
  },
  challengeTitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 4,
  },
  challengeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  challengeProgress: {
    width: '70%',
  },
  challengeProgressText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 4,
  },
  challengeProgressBar: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
  },
  challengeProgressFill: {
    height: 4,
    backgroundColor: '#fff',
    borderRadius: 2,
  },
  startButton: {
    marginHorizontal: 20,
    marginBottom: 30,
    borderRadius: 15,
    overflow: 'hidden',
  },
  startButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    width: width * 0.9,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  pickerContainer: {
    marginBottom: 15,
  },
  pickerLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  unitButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  unitButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginRight: 8,
    marginBottom: 8,
  },
  unitButtonActive: {
    backgroundColor: '#2ecc71',
    borderColor: '#2ecc71',
  },
  unitButtonText: {
    color: '#666',
    fontSize: 14,
  },
  unitButtonTextActive: {
    color: '#fff',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  saveButton: {
    backgroundColor: '#2ecc71',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});