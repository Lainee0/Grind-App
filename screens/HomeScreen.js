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
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  // State for modals
  const [goalModalVisible, setGoalModalVisible] = useState(false);
  const [workoutModalVisible, setWorkoutModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [workoutDetailVisible, setWorkoutDetailVisible] = useState(false);
  const [exerciseModalVisible, setExerciseModalVisible] = useState(false);
  const [editingExercise, setEditingExercise] = useState(null);
  const [editingGoal, setEditingGoal] = useState(null);
  const [editingWorkout, setEditingWorkout] = useState(null);
  const [editGoalModalVisible, setEditGoalModalVisible] = useState(false);
  const [editWorkoutModalVisible, setEditWorkoutModalVisible] = useState(false);

  
  // State for new goal form
  const [newGoal, setNewGoal] = useState({
    name: '',
    target: '',
    unit: 'kg',
    // deadline: '',
    icon: 'flag',
    color: '#00ff88',
  });

  // State for new workout form
  const [newWorkout, setNewWorkout] = useState({
    name: '',
    duration: '',
    exercises: [],
    intensity: 'Medium',
    icon: 'fitness-center',
    color1: '#00ff88',
    color2: '#00cc66',
    description: '',
  });

  // State for new exercise
  const [newExercise, setNewExercise] = useState({
    name: '',
    sets: '',
    reps: '',
    weight: '',
    restTime: '60',
    notes: '',
    completed: false,
  });

  // Workout Goals State
  const [workoutGoals, setWorkoutGoals] = useState([]);

  // Created Workouts State
  const [createdWorkouts, setCreatedWorkouts] = useState([]);

  // Predefined exercises database
  const exerciseDatabase = [
    { name: 'Bench Press', category: 'Chest', icon: 'fitness-center' },
    { name: 'Squat', category: 'Legs', icon: 'fitness-center' },
    { name: 'Deadlift', category: 'Back', icon: 'fitness-center' },
    { name: 'Pull-ups', category: 'Back', icon: 'fitness-center' },
    { name: 'Push-ups', category: 'Chest', icon: 'fitness-center' },
    { name: 'Shoulder Press', category: 'Shoulders', icon: 'fitness-center' },
    { name: 'Bicep Curls', category: 'Arms', icon: 'fitness-center' },
    { name: 'Tricep Extensions', category: 'Arms', icon: 'fitness-center' },
    { name: 'Leg Press', category: 'Legs', icon: 'fitness-center' },
    { name: 'Lat Pulldowns', category: 'Back', icon: 'fitness-center' },
    { name: 'Chest Fly', category: 'Chest', icon: 'fitness-center' },
    { name: 'Romanian Deadlift', category: 'Legs', icon: 'fitness-center' },
    { name: 'Crunches', category: 'Core', icon: 'fitness-center' },
    { name: 'Plank', category: 'Core', icon: 'fitness-center' },
    { name: 'Calf Raises', category: 'Legs', icon: 'fitness-center' },
  ];

  // User stats
  const [userStats, setUserStats] = useState({
    workoutsThisWeek: 0,
    totalMinutes: 0,
    caloriesBurned: 0,
    streak: 0
  });

  const tips = [
    { text: 'Go hard or go home', icon: 'whatshot', category: '🔥 MOTIVATION' },
    { text: 'No pain, no gain', icon: 'fitness-center', category: '💪 GRIND' },
    { text: 'Stay consistent, stay hungry', icon: 'restaurant', category: '⚡ MINDSET' },
    { text: 'Earn your results', icon: 'emoji-events', category: '🏆 GOALS' },
  ];

  // Load data from AsyncStorage when component mounts
  useEffect(() => {
    loadUserData();
    calculateUserStats();
  }, []);

  // Save data whenever workoutGoals or createdWorkouts change
  useEffect(() => {
    if (!loading) {
      saveUserData();
      calculateUserStats();
    }
  }, [workoutGoals, createdWorkouts]);

  const calculateUserStats = () => {
    // Calculate stats based on createdWorkouts
    const totalWorkouts = createdWorkouts.length;
    const totalMins = createdWorkouts.reduce((sum, w) => {
      const mins = parseInt(w.duration) || 0;
      return sum + mins;
    }, 0);
    const totalCalories = totalMins * 8; // Rough estimate: 8 cal per min
    const streak = Math.floor(Math.random() * 10) + 1; // Placeholder streak

    setUserStats({
      workoutsThisWeek: totalWorkouts,
      totalMinutes: totalMins,
      caloriesBurned: totalCalories,
      streak: streak
    });
  };

  // Load user data from AsyncStorage
  const loadUserData = async () => {
    try {
      setLoading(true);
      
      // Load goals
      const savedGoals = await AsyncStorage.getItem('userGoals');
      if (savedGoals !== null) {
        setWorkoutGoals(JSON.parse(savedGoals));
      } else {
        const defaultGoals = [
          { 
            id: 1, 
            name: 'WEIGHT LOSS', 
            target: '5', 
            progress: 2.5, 
            unit: 'kg',
            icon: 'monitor-weight',
            color: '#00ff88',
            deadline: '30 days left',
            createdAt: new Date().toISOString()
          },
          { 
            id: 2, 
            name: 'DAILY STEPS', 
            target: '10000', 
            progress: 6543, 
            unit: 'steps',
            icon: 'directions-walk',
            color: '#00cc66',
            deadline: 'Today',
            createdAt: new Date().toISOString()
          },
          { 
            id: 3, 
            name: 'WORKOUT SESSIONS', 
            target: '20', 
            progress: 12, 
            unit: 'sessions',
            icon: 'fitness-center',
            color: '#1a1a1a',
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
        // Initialize with default workouts including exercises
        const defaultWorkouts = [
          {
            id: 1,
            name: 'BEAST MODE',
            duration: '45',
            exercises: [
              { id: 101, name: 'Bench Press', sets: 4, reps: 10, weight: '60', restTime: '60', completed: false },
              { id: 102, name: 'Squats', sets: 4, reps: 12, weight: '80', restTime: '90', completed: false },
              { id: 103, name: 'Pull-ups', sets: 3, reps: 8, weight: 'BW', restTime: '60', completed: false },
              { id: 104, name: 'Shoulder Press', sets: 3, reps: 10, weight: '40', restTime: '60', completed: false },
            ],
            intensity: 'High',
            icon: 'fitness-center',
            color: ['#00ff88', '#00cc66'],
            lastPerformed: '2 days ago',
            createdAt: new Date().toISOString(),
            timesCompleted: 8,
            description: 'Full body intensity blast'
          },
          {
            id: 2,
            name: 'IRON PUMP',
            duration: '60',
            exercises: [
              { id: 201, name: 'Deadlift', sets: 5, reps: 5, weight: '100', restTime: '120', completed: false },
              { id: 202, name: 'Barbell Rows', sets: 4, reps: 8, weight: '70', restTime: '90', completed: false },
              { id: 203, name: 'Leg Press', sets: 4, reps: 12, weight: '150', restTime: '60', completed: false },
              { id: 204, name: 'Bicep Curls', sets: 3, reps: 12, weight: '20', restTime: '45', completed: false },
            ],
            intensity: 'High',
            icon: 'fitness-center',
            color: ['#00cc66', '#00994d'],
            lastPerformed: '5 days ago',
            createdAt: new Date().toISOString(),
            timesCompleted: 12,
            description: 'Heavy lifting session'
          },
          {
            id: 3,
            name: 'CARDIO KILLER',
            duration: '30',
            exercises: [
              { id: 301, name: 'Jumping Jacks', sets: 3, reps: 30, weight: 'BW', restTime: '30', completed: false },
              { id: 302, name: 'Burpees', sets: 3, reps: 15, weight: 'BW', restTime: '45', completed: false },
              { id: 303, name: 'Mountain Climbers', sets: 3, reps: 20, weight: 'BW', restTime: '30', completed: false },
              { id: 304, name: 'Box Jumps', sets: 3, reps: 12, weight: 'BW', restTime: '60', completed: false },
            ],
            intensity: 'Medium',
            icon: 'directions-run',
            color: ['#00ff88', '#1a1a1a'],
            lastPerformed: 'Yesterday',
            createdAt: new Date().toISOString(),
            timesCompleted: 15,
            description: 'High intensity cardio'
          },
          {
            id: 4,
            name: 'SHREDDER',
            duration: '40',
            exercises: [
              { id: 401, name: 'Kettlebell Swings', sets: 4, reps: 20, weight: '16', restTime: '45', completed: false },
              { id: 402, name: 'Battle Ropes', sets: 3, reps: 30, weight: 'BW', restTime: '60', completed: false },
              { id: 403, name: 'Box Jumps', sets: 4, reps: 12, weight: 'BW', restTime: '60', completed: false },
              { id: 404, name: 'Plank', sets: 3, reps: '60 sec', weight: 'BW', restTime: '30', completed: false },
            ],
            intensity: 'High',
            icon: 'whatshot',
            color: ['#00cc66', '#1a1a1a'],
            lastPerformed: '1 week ago',
            createdAt: new Date().toISOString(),
            timesCompleted: 6,
            description: 'Fat burning circuit'
          },
        ];
        setCreatedWorkouts(defaultWorkouts);
        await AsyncStorage.setItem('userWorkouts', JSON.stringify(defaultWorkouts));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      Alert.alert('ERROR', 'Failed to load your data');
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
    if (hour < 12) return 'GOOD MORNING';
    if (hour < 17) return 'GOOF AFTERNOON';
    return 'GOOD EVENING';
  };

  // Function to add new goal
  const addNewGoal = () => {
    // if (!newGoal.name || !newGoal.target || !newGoal.deadline) {
    //   Alert.alert('ERROR', 'FILL ALL FIELDS, CHAMP!');
    //   return;
    // }

    if (!newGoal.name || !newGoal.target) {
      Alert.alert('ERROR', 'FILL ALL FIELDS, CHAMP!');
      return;
    }

    const newId = Date.now();

    const goal = {
      id: newId,
      name: newGoal.name.toUpperCase(),
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
    
    setGoalModalVisible(false);
    setNewGoal({
      name: '',
      target: '',
      unit: 'kg',
      deadline: '',
      icon: 'flag',
      color: '#00ff88',
    });
    
    Alert.alert('🔥 GOAL SET!', 'TIME TO GRIND!');
  };

  // Function to add exercise to workout
  const addExercise = () => {
    if (!newExercise.name || !newExercise.sets || !newExercise.reps) {
      Alert.alert('ERROR', 'FILL EXERCISE NAME, SETS, AND REPS!');
      return;
    }

    const exercise = {
      id: Date.now() + Math.random(),
      name: newExercise.name.toUpperCase(),
      sets: parseInt(newExercise.sets),
      reps: newExercise.reps,
      weight: newExercise.weight || 'BW',
      restTime: newExercise.restTime || '60',
      notes: newExercise.notes,
      completed: false,
    };

    setNewWorkout({
      ...newWorkout,
      exercises: [...newWorkout.exercises, exercise]
    });

    // Reset exercise form
    setNewExercise({
      name: '',
      sets: '',
      reps: '',
      weight: '',
      restTime: '60',
      notes: '',
      completed: false,
    });

    setExerciseModalVisible(false);
  };

  // Function to edit exercise
  const editExercise = () => {
    if (!editingExercise) return;

    const updatedExercises = newWorkout.exercises.map(ex => 
      ex.id === editingExercise.id ? editingExercise : ex
    );

    setNewWorkout({
      ...newWorkout,
      exercises: updatedExercises
    });

    setEditingExercise(null);
    setExerciseModalVisible(false);
  };

  // Function to remove exercise
  const removeExercise = (exerciseId) => {
    const updatedExercises = newWorkout.exercises.filter(ex => ex.id !== exerciseId);
    setNewWorkout({
      ...newWorkout,
      exercises: updatedExercises
    });
  };

  // Function to add new workout
  const addNewWorkout = () => {
    if (!newWorkout.name || !newWorkout.duration || newWorkout.exercises.length === 0) {
      Alert.alert('ERROR', 'ADD WORKOUT NAME, DURATION, AND AT LEAST ONE EXERCISE!');
      return;
    }

    const newId = Date.now();

    const workout = {
      id: newId,
      name: newWorkout.name.toUpperCase(),
      duration: newWorkout.duration,
      exercises: newWorkout.exercises,
      intensity: newWorkout.intensity,
      icon: newWorkout.icon,
      color: [newWorkout.color1, newWorkout.color2],
      lastPerformed: 'Just created',
      createdAt: new Date().toISOString(),
      timesCompleted: 0,
      description: newWorkout.description || 'Custom workout routine'
    };

    const updatedWorkouts = [...createdWorkouts, workout];
    setCreatedWorkouts(updatedWorkouts);
    
    setWorkoutModalVisible(false);
    setNewWorkout({
      name: '',
      duration: '',
      exercises: [],
      intensity: 'Medium',
      icon: 'fitness-center',
      color1: '#00ff88',
      color2: '#00cc66',
      description: '',
    });
    
    Alert.alert('💪 WORKOUT CREATED!', 'LET\'S GET IT!');
  };

  // Function to delete goal
  const deleteGoal = (id) => {
    Alert.alert(
      'DELETE GOAL?',
      'YOU SURE ABOUT THIS?',
      [
        { text: 'CANCEL', style: 'cancel' },
        {
          text: 'DELETE',
          style: 'destructive',
          onPress: () => {
            const updatedGoals = workoutGoals.filter(goal => goal.id !== id);
            setWorkoutGoals(updatedGoals);
            Alert.alert('DELETED', 'GOAL REMOVED');
          },
        },
      ]
    );
  };

  // Function to delete workout
  const deleteWorkout = (id) => {
    Alert.alert(
      'DELETE WORKOUT?',
      'YOU SURE ABOUT THIS?',
      [
        { text: 'CANCEL', style: 'cancel' },
        {
          text: 'DELETE',
          style: 'destructive',
          onPress: () => {
            const updatedWorkouts = createdWorkouts.filter(workout => workout.id !== id);
            setCreatedWorkouts(updatedWorkouts);
            Alert.alert('DELETED', 'WORKOUT REMOVED');
          },
        },
      ]
    );
  };

  // Function to edit goal
  const openEditGoal = (goal) => {
    setEditingGoal(goal);
    setNewGoal({
      name: goal.name,
      target: goal.target.toString(),
      unit: goal.unit,
      deadline: goal.deadline,
      icon: goal.icon,
      color: goal.color,
    });
    setEditGoalModalVisible(true);
  };

  // Function to update goal
  const updateGoal = () => {
    if (!newGoal.name || !newGoal.target || !newGoal.deadline) {
      Alert.alert('ERROR', 'FILL ALL FIELDS, CHAMP!');
      return;
    }

    const updatedGoals = workoutGoals.map(goal => 
      goal.id === editingGoal.id ? {
        ...goal,
        name: newGoal.name.toUpperCase(),
        target: newGoal.target,
        unit: newGoal.unit,
        deadline: newGoal.deadline,
        icon: newGoal.icon,
        color: newGoal.color,
        lastUpdated: new Date().toISOString(),
      } : goal
    );

    setWorkoutGoals(updatedGoals);
    setEditGoalModalVisible(false);
    setEditingGoal(null);
    setNewGoal({
      name: '',
      target: '',
      unit: 'kg',
      deadline: '',
      icon: 'flag',
      color: '#00ff88',
    });
    
    Alert.alert('✅ GOAL UPDATED!', 'KEEP GRINDING!');
  };

  // Function to edit workout
  const openEditWorkout = (workout) => {
    setEditingWorkout(workout);
    setNewWorkout({
      name: workout.name,
      duration: workout.duration,
      exercises: workout.exercises || [],
      intensity: workout.intensity,
      icon: workout.icon,
      color1: workout.color[0],
      color2: workout.color[1],
      description: workout.description || '',
    });
    setEditWorkoutModalVisible(true);
  };

  // Function to update workout
  const updateWorkout = () => {
    if (!newWorkout.name || !newWorkout.duration || newWorkout.exercises.length === 0) {
      Alert.alert('ERROR', 'ADD WORKOUT NAME, DURATION, AND AT LEAST ONE EXERCISE!');
      return;
    }

    const updatedWorkouts = createdWorkouts.map(workout => 
      workout.id === editingWorkout.id ? {
        ...workout,
        name: newWorkout.name.toUpperCase(),
        duration: newWorkout.duration,
        exercises: newWorkout.exercises,
        intensity: newWorkout.intensity,
        icon: newWorkout.icon,
        color: [newWorkout.color1, newWorkout.color2],
        description: newWorkout.description || 'Custom workout routine',
        lastUpdated: new Date().toISOString(),
      } : workout
    );

    setCreatedWorkouts(updatedWorkouts);
    setEditWorkoutModalVisible(false);
    setEditingWorkout(null);
    setNewWorkout({
      name: '',
      duration: '',
      exercises: [],
      intensity: 'Medium',
      icon: 'fitness-center',
      color1: '#00ff88',
      color2: '#00cc66',
      description: '',
    });
    
    Alert.alert('💪 WORKOUT UPDATED!', 'READY TO GRIND!');
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
    Alert.alert('🔥 LEGEND!', 'WORKOUT COMPLETED! KEEP GRINDING!');
  };

  const openWorkoutDetails = (workout) => {
    setSelectedWorkout(workout);
    setWorkoutDetailVisible(true);
  };

  const openExerciseModal = (exercise = null) => {
    if (exercise) {
      setEditingExercise(exercise);
      setNewExercise({
        name: exercise.name,
        sets: exercise.sets.toString(),
        reps: exercise.reps.toString(),
        weight: exercise.weight,
        restTime: exercise.restTime,
        notes: exercise.notes || '',
        completed: exercise.completed,
      });
    } else {
      setEditingExercise(null);
      setNewExercise({
        name: '',
        sets: '',
        reps: '',
        weight: '',
        restTime: '60',
        notes: '',
        completed: false,
      });
    }
    setExerciseModalVisible(true);
  };

  const selectExerciseFromDatabase = (exerciseName) => {
    setNewExercise({
      ...newExercise,
      name: exerciseName,
    });
  };

  if (loading) {
    return (
      <LinearGradient colors={['#0a0a0a', '#1a1a1a']} style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00ff88" />
        <Text style={styles.loadingText}>LOADING YOUR GAINS...</Text>
      </LinearGradient>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0a" />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header with Motivational Quote */}
        <LinearGradient colors={['#0a0a0a', '#1a1a1a']} style={styles.headerGradient}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>{getCurrentGreeting()}</Text>
              <Text style={styles.quote}>"EARN YOUR RESULTS"</Text>
            </View>
            <TouchableOpacity style={styles.profileButton}>
              <LinearGradient colors={['#00ff88', '#00cc66']} style={styles.profileGradient}>
                <Text style={styles.profileInitial}>💪</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Stats Cards */}
          {/* <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <MaterialIcons name="fitness-center" size={24} color="#00ff88" />
              <Text style={styles.statValue}>{userStats.workoutsThisWeek}</Text>
              <Text style={styles.statLabel}>WORKOUTS</Text>
            </View>
            <View style={styles.statCard}>
              <MaterialIcons name="timer" size={24} color="#00ff88" />
              <Text style={styles.statValue}>{userStats.totalMinutes}</Text>
              <Text style={styles.statLabel}>MINUTES</Text>
            </View>
            <View style={styles.statCard}>
              <MaterialIcons name="whatshot" size={24} color="#00ff88" />
              <Text style={styles.statValue}>{userStats.caloriesBurned}</Text>
              <Text style={styles.statLabel}>CALORIES</Text>
            </View>
            <View style={styles.statCard}>
              <MaterialIcons name="local-fire-department" size={24} color="#00ff88" />
              <Text style={styles.statValue}>{userStats.streak}</Text>
              <Text style={styles.statLabel}>STREAK</Text>
            </View>
          </View> */}
        </LinearGradient>

        {/* Workout Programs Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <MaterialIcons name="fitness-center" size={24} color="#00ff88" />
              <Text style={styles.sectionTitle}>WORKOUT PROGRAMS</Text>
            </View>
            {/* <TouchableOpacity onPress={() => setWorkoutModalVisible(true)}>
              <LinearGradient colors={['#00ff88', '#00cc66']} style={styles.addButton}>
                <MaterialIcons name="add" size={20} color="#0a0a0a" />
              </LinearGradient>
            </TouchableOpacity> */}
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.workoutScroll}
          >
            {createdWorkouts.map((workout) => (
              <View key={workout.id} style={styles.workoutCardWrapper}>
                <TouchableOpacity
                  style={styles.workoutCard}
                  onPress={() => openWorkoutDetails(workout)}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={workout.color}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.workoutGradient}
                  >
                    <View style={styles.workoutBadge}>
                      <Text style={styles.workoutBadgeText}>{workout.intensity}</Text>
                    </View>
                    
                    {/* <MaterialIcons name={workout.icon} size={40} color="#fff" style={styles.workoutIcon} /> */}
                    
                    <Text style={styles.workoutName}>{workout.name}</Text>
                    
                    <View style={styles.workoutMeta}>
                      <View style={styles.workoutMetaItem}>
                        <MaterialIcons name="timer" size={16} color="#fff" />
                        <Text style={styles.workoutMetaText}>{workout.duration} min</Text>
                      </View>
                      <View style={styles.workoutMetaItem}>
                        <MaterialIcons name="fitness-center" size={16} color="#fff" />
                        <Text style={styles.workoutMetaText}>{workout.exercises.length} ex</Text>
                      </View>
                    </View>

                    {workout.timesCompleted > 0 && (
                      <View style={styles.completedCount}>
                        <MaterialIcons name="check-circle" size={14} color="#fff" />
                        <Text style={styles.completedCountText}>{workout.timesCompleted}x</Text>
                      </View>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
                
                {/* Edit and Delete buttons for workout */}
                <View style={styles.cardActions}>
                  <TouchableOpacity 
                    style={styles.cardActionButton}
                    onPress={() => openEditWorkout(workout)}
                  >
                    <LinearGradient colors={['#00ff88', '#00cc66']} style={styles.cardActionGradient}>
                      <MaterialIcons name="edit" size={16} color="#0a0a0a" />
                    </LinearGradient>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.cardActionButton}
                    onPress={() => deleteWorkout(workout.id)}
                  >
                    <LinearGradient colors={['#ff4444', '#cc0000']} style={styles.cardActionGradient}>
                      <MaterialIcons name="delete" size={16} color="#fff" />
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            {/* Create New Card */}
            <TouchableOpacity 
              style={styles.createCard}
              onPress={() => setWorkoutModalVisible(true)}
            >
              <View style={styles.createContent}>
                <View style={styles.createIconContainer}>
                  <MaterialIcons name="add" size={40} color="#00ff88" />
                </View>
                <Text style={styles.createText}>CREATE NEW</Text>
                <Text style={styles.createSubtext}>Design your routine</Text>
              </View>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Goals Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <MaterialIcons name="emoji-events" size={24} color="#00ff88" />
              <Text style={styles.sectionTitle}>FITNESS GOALS</Text>
            </View>
            <TouchableOpacity onPress={() => setGoalModalVisible(true)}>
              <LinearGradient colors={['#00ff88', '#00cc66']} style={styles.addButton}>
                <MaterialIcons name="add" size={20} color="#0a0a0a" />
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {workoutGoals.length === 0 ? (
            <View style={styles.emptyGoals}>
              <MaterialIcons name="emoji-events" size={60} color="#333" />
              <Text style={styles.emptyText}>NO GOALS SET</Text>
              <Text style={styles.emptySubtext}>Add your first goal to start grinding</Text>
            </View>
          ) : (
            workoutGoals.map((goal) => (
              <View key={goal.id} style={styles.goalCardWrapper}>
                <TouchableOpacity 
                  style={styles.goalCard}
                  activeOpacity={0.9}
                >
                  <View style={styles.goalHeader}>
                    <View style={styles.goalTitleSection}>
                      <View style={[styles.goalIcon, { backgroundColor: goal.color + '20' }]}>
                        <MaterialIcons name={goal.icon} size={20} color={goal.color} />
                      </View>
                      <View>
                        <Text style={[styles.goalName, { paddingTop: 30 }]}>{goal.name}</Text>
                        {/* <Text style={styles.goalDea/dline}>{goal.deadline}</Text> */}
                      </View>
                    </View>
                    <Text style={[styles.goalTarget, { paddingTop: 30 }]}>{goal.target} {goal.unit}</Text>
                  </View>
                  
                  {/* <View style={styles.progressSection}>
                    <View style={styles.progressBarBg}>
                      <View 
                        style={[
                          styles.progressBarFill, 
                          { 
                            width: `${(goal.progress / parseFloat(goal.target)) * 100}%`,
                            backgroundColor: goal.color 
                          }
                        ]} 
                      />
                    </View>
                    <View style={styles.progressLabels}>
                      <Text style={styles.progressCurrent}>{goal.progress} {goal.unit}</Text>
                      <Text style={styles.progressTarget}>{goal.target} {goal.unit}</Text>
                    </View>
                  </View> */}
                </TouchableOpacity>
                
                {/* Edit and Delete buttons for goal */}
                <View style={styles.goalCardActions}>
                  <TouchableOpacity 
                    style={styles.goalActionButton}
                    onPress={() => openEditGoal(goal)}
                  >
                    <LinearGradient colors={['#00ff88', '#00cc66']} style={styles.goalActionGradient}>
                      <MaterialIcons name="edit" size={14} color="#0a0a0a" />
                    </LinearGradient>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.goalActionButton}
                    onPress={() => deleteGoal(goal.id)}
                  >
                    <LinearGradient colors={['#ff4444', '#cc0000']} style={styles.goalActionGradient}>
                      <MaterialIcons name="delete" size={14} color="#fff" />
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>

        {/* Quick Chat CTA */}
        <TouchableOpacity
          style={styles.chatCta}
          onPress={() => router.push('/chat')}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={['#00ff88', '#00cc66']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.chatGradient}
          >
            <View style={styles.chatContent}>
              {/* <View style={styles.chatIconContainer}>
                <MaterialIcons name="chat" size={32} color="#0a0a0a" />
              </View> */}
              <View style={styles.chatIconContainer}>
                <Text style={styles.profileAi}>🤖</Text>
              </View>
              <View style={styles.chatTextContainer}>
                <Text style={styles.chatTitle}>NEED ADVICE?</Text>
                <Text style={styles.chatSubtitle}>Ask your AI fitness coach</Text>
              </View>
              <MaterialIcons name="arrow-forward" size={24} color="#0a0a0a" />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Tips Section */}
        <View style={styles.tipsSection}>
          <Text style={styles.tipsTitle}>🔥 GRIND MINDSET</Text>
          {tips.map((tip, index) => (
            <View key={index} style={styles.tipCard}>
              <LinearGradient colors={['#1a1a1a', '#0a0a0a']} style={styles.tipGradient}>
                <View style={styles.tipIcon}>
                  <MaterialIcons name={tip.icon} size={20} color="#00ff88" />
                </View>
                <View style={styles.tipContent}>
                  <Text style={styles.tipCategory}>{tip.category}</Text>
                  <Text style={styles.tipText}>{tip.text}</Text>
                </View>
              </LinearGradient>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Edit Goal Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editGoalModalVisible}
        onRequestClose={() => setEditGoalModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <LinearGradient colors={['#1a1a1a', '#0a0a0a']} style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>EDIT GOAL</Text>
              <TouchableOpacity onPress={() => setEditGoalModalVisible(false)}>
                <MaterialIcons name="close" size={24} color="#00ff88" />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.modalInput}
              placeholder="GOAL NAME"
              placeholderTextColor="#666"
              value={newGoal.name}
              onChangeText={(text) => setNewGoal({...newGoal, name: text})}
            />

            <TextInput
              style={styles.modalInput}
              placeholder="TARGET VALUE"
              placeholderTextColor="#666"
              value={newGoal.target}
              onChangeText={(text) => setNewGoal({...newGoal, target: text})}
              keyboardType="numeric"
            />

            <View style={styles.unitSelector}>
              <Text style={styles.unitLabel}>UNIT:</Text>
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
                    ]}>{unit.toUpperCase()}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* <TextInput
              style={styles.modalInput}
              placeholder="DEADLINE"
              placeholderTextColor="#666"
              value={newGoal.deadline}
              onChangeText={(text) => setNewGoal({...newGoal, deadline: text})}
            /> */}

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancel}
                onPress={() => setEditGoalModalVisible(false)}
              >
                <Text style={styles.modalCancelText}>CANCEL</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSave}
                onPress={updateGoal}
              >
                <LinearGradient colors={['#00ff88', '#00cc66']} style={styles.modalSaveGradient}>
                  <Text style={styles.modalSaveText}>UPDATE GOAL</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>
      </Modal>

      {/* Edit Workout Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editWorkoutModalVisible}
        onRequestClose={() => setEditWorkoutModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <LinearGradient colors={['#1a1a1a', '#0a0a0a']} style={[styles.modalContent, styles.workoutModalContent]}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>EDIT WORKOUT</Text>
                <TouchableOpacity onPress={() => setEditWorkoutModalVisible(false)}>
                  <MaterialIcons name="close" size={24} color="#00ff88" />
                </TouchableOpacity>
              </View>

              <TextInput
                style={styles.modalInput}
                placeholder="WORKOUT NAME"
                placeholderTextColor="#666"
                value={newWorkout.name}
                onChangeText={(text) => setNewWorkout({...newWorkout, name: text})}
              />

              <TextInput
                style={styles.modalInput}
                placeholder="DESCRIPTION (OPTIONAL)"
                placeholderTextColor="#666"
                value={newWorkout.description}
                onChangeText={(text) => setNewWorkout({...newWorkout, description: text})}
              />

              <TextInput
                style={styles.modalInput}
                placeholder="DURATION (MINUTES)"
                placeholderTextColor="#666"
                value={newWorkout.duration}
                onChangeText={(text) => setNewWorkout({...newWorkout, duration: text})}
                keyboardType="numeric"
              />

              <View style={styles.unitSelector}>
                <Text style={styles.unitLabel}>INTENSITY:</Text>
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
                      ]}>{intensity.toUpperCase()}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Exercises Section */}
              <View style={styles.exercisesSection}>
                <View style={styles.exercisesHeader}>
                  <Text style={styles.exercisesTitle}>EXERCISES</Text>
                  <TouchableOpacity
                    style={styles.addExerciseButton}
                    onPress={() => openExerciseModal()}
                  >
                    <LinearGradient colors={['#00ff88', '#00cc66']} style={styles.addExerciseGradient}>
                      <MaterialIcons name="add" size={20} color="#0a0a0a" />
                      <Text style={styles.addExerciseText}>ADD</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>

                {newWorkout.exercises.length === 0 ? (
                  <View style={styles.noExercises}>
                    <MaterialIcons name="fitness-center" size={40} color="#333" />
                    <Text style={styles.noExercisesText}>NO EXERCISES ADDED</Text>
                    <Text style={styles.noExercisesSubtext}>Tap ADD to create your first exercise</Text>
                  </View>
                ) : (
                  newWorkout.exercises.map((exercise, index) => (
                    <View key={exercise.id} style={styles.exerciseItem}>
                      <LinearGradient colors={['#1a1a1a', '#0a0a0a']} style={styles.exerciseGradient}>
                        <View style={styles.exerciseNumber}>
                          <Text style={styles.exerciseNumberText}>{index + 1}</Text>
                        </View>
                        <View style={styles.exerciseDetails}>
                          <Text style={styles.exerciseName}>{exercise.name}</Text>
                          <View style={styles.exerciseMetrics}>
                            <Text style={styles.exerciseMetric}>{exercise.sets} SETS</Text>
                            <Text style={styles.exerciseMetric}>{exercise.reps} REPS</Text>
                            {exercise.weight !== 'BW' && (
                              <Text style={styles.exerciseMetric}>{exercise.weight} KG</Text>
                            )}
                            <Text style={styles.exerciseMetric}>REST {exercise.restTime}S</Text>
                          </View>
                          {exercise.notes ? (
                            <Text style={styles.exerciseNotes}>📝 {exercise.notes}</Text>
                          ) : null}
                        </View>
                        <View style={styles.exerciseActions}>
                          <TouchableOpacity
                            onPress={() => openExerciseModal(exercise)}
                            style={styles.exerciseAction}
                          >
                            <MaterialIcons name="edit" size={18} color="#00ff88" />
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => removeExercise(exercise.id)}
                            style={styles.exerciseAction}
                          >
                            <MaterialIcons name="delete" size={18} color="#ff4444" />
                          </TouchableOpacity>
                        </View>
                      </LinearGradient>
                    </View>
                  ))
                )}
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.modalCancel}
                  onPress={() => setEditWorkoutModalVisible(false)}
                >
                  <Text style={styles.modalCancelText}>CANCEL</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalSave}
                  onPress={updateWorkout}
                >
                  <LinearGradient colors={['#00ff88', '#00cc66']} style={styles.modalSaveGradient}>
                    <Text style={styles.modalSaveText}>UPDATE WORKOUT</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </LinearGradient>
        </View>
      </Modal>

      {/* Add Goal Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={goalModalVisible}
        onRequestClose={() => setGoalModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <LinearGradient colors={['#1a1a1a', '#0a0a0a']} style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>SET NEW GOAL</Text>
              <TouchableOpacity onPress={() => setGoalModalVisible(false)}>
                <MaterialIcons name="close" size={24} color="#00ff88" />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.modalInput}
              placeholder="GOAL NAME"
              placeholderTextColor="#666"
              value={newGoal.name}
              onChangeText={(text) => setNewGoal({...newGoal, name: text})}
            />

            <TextInput
              style={styles.modalInput}
              placeholder="TARGET VALUE"
              placeholderTextColor="#666"
              value={newGoal.target}
              onChangeText={(text) => setNewGoal({...newGoal, target: text})}
              keyboardType="numeric"
            />

            <View style={styles.unitSelector}>
              <Text style={styles.unitLabel}>UNIT:</Text>
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
                    ]}>{unit.toUpperCase()}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* <TextInput
              style={styles.modalInput}
              placeholder="DEADLINE"
              placeholderTextColor="#666"
              value={newGoal.deadline}
              onChangeText={(text) => setNewGoal({...newGoal, deadline: text})}
            /> */}

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancel}
                onPress={() => setGoalModalVisible(false)}
              >
                <Text style={styles.modalCancelText}>CANCEL</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSave}
                onPress={addNewGoal}
              >
                <LinearGradient colors={['#00ff88', '#00cc66']} style={styles.modalSaveGradient}>
                  <Text style={styles.modalSaveText}>SET GOAL</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>
      </Modal>

      {/* Create Workout Modal with Exercises */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={workoutModalVisible}
        onRequestClose={() => setWorkoutModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <LinearGradient colors={['#1a1a1a', '#0a0a0a']} style={[styles.modalContent, styles.workoutModalContent]}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>CREATE WORKOUT</Text>
                <TouchableOpacity onPress={() => setWorkoutModalVisible(false)}>
                  <MaterialIcons name="close" size={24} color="#00ff88" />
                </TouchableOpacity>
              </View>

              <TextInput
                style={styles.modalInput}
                placeholder="WORKOUT NAME"
                placeholderTextColor="#666"
                value={newWorkout.name}
                onChangeText={(text) => setNewWorkout({...newWorkout, name: text})}
              />

              <TextInput
                style={styles.modalInput}
                placeholder="DESCRIPTION (OPTIONAL)"
                placeholderTextColor="#666"
                value={newWorkout.description}
                onChangeText={(text) => setNewWorkout({...newWorkout, description: text})}
              />

              <TextInput
                style={styles.modalInput}
                placeholder="DURATION (MINUTES)"
                placeholderTextColor="#666"
                value={newWorkout.duration}
                onChangeText={(text) => setNewWorkout({...newWorkout, duration: text})}
                keyboardType="numeric"
              />

              <View style={styles.unitSelector}>
                <Text style={styles.unitLabel}>INTENSITY:</Text>
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
                      ]}>{intensity.toUpperCase()}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Exercises Section */}
              <View style={styles.exercisesSection}>
                <View style={styles.exercisesHeader}>
                  <Text style={styles.exercisesTitle}>EXERCISES</Text>
                  <TouchableOpacity
                    style={styles.addExerciseButton}
                    onPress={() => openExerciseModal()}
                  >
                    <LinearGradient colors={['#00ff88', '#00cc66']} style={styles.addExerciseGradient}>
                      <MaterialIcons name="add" size={20} color="#0a0a0a" />
                      <Text style={styles.addExerciseText}>ADD</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>

                {newWorkout.exercises.length === 0 ? (
                  <View style={styles.noExercises}>
                    <MaterialIcons name="fitness-center" size={40} color="#333" />
                    <Text style={styles.noExercisesText}>NO EXERCISES ADDED</Text>
                    <Text style={styles.noExercisesSubtext}>Tap ADD to create your first exercise</Text>
                  </View>
                ) : (
                  newWorkout.exercises.map((exercise, index) => (
                    <View key={exercise.id} style={styles.exerciseItem}>
                      <LinearGradient colors={['#1a1a1a', '#0a0a0a']} style={styles.exerciseGradient}>
                        <View style={styles.exerciseNumber}>
                          <Text style={styles.exerciseNumberText}>{index + 1}</Text>
                        </View>
                        <View style={styles.exerciseDetails}>
                          <Text style={styles.exerciseName}>{exercise.name}</Text>
                          <View style={styles.exerciseMetrics}>
                            <Text style={styles.exerciseMetric}>{exercise.sets} SETS</Text>
                            <Text style={styles.exerciseMetric}>{exercise.reps} REPS</Text>
                            {exercise.weight !== 'BW' && (
                              <Text style={styles.exerciseMetric}>{exercise.weight} KG</Text>
                            )}
                            <Text style={styles.exerciseMetric}>REST {exercise.restTime}S</Text>
                          </View>
                          {exercise.notes ? (
                            <Text style={styles.exerciseNotes}>📝 {exercise.notes}</Text>
                          ) : null}
                        </View>
                        <View style={styles.exerciseActions}>
                          <TouchableOpacity
                            onPress={() => openExerciseModal(exercise)}
                            style={styles.exerciseAction}
                          >
                            <MaterialIcons name="edit" size={18} color="#00ff88" />
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => removeExercise(exercise.id)}
                            style={styles.exerciseAction}
                          >
                            <MaterialIcons name="delete" size={18} color="#ff4444" />
                          </TouchableOpacity>
                        </View>
                      </LinearGradient>
                    </View>
                  ))
                )}
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.modalCancel}
                  onPress={() => setWorkoutModalVisible(false)}
                >
                  <Text style={styles.modalCancelText}>CANCEL</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalSave}
                  onPress={addNewWorkout}
                >
                  <LinearGradient colors={['#00ff88', '#00cc66']} style={styles.modalSaveGradient}>
                    <Text style={styles.modalSaveText}>CREATE</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </LinearGradient>
        </View>
      </Modal>

      {/* Add/Edit Exercise Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={exerciseModalVisible}
        onRequestClose={() => setExerciseModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <LinearGradient colors={['#1a1a1a', '#0a0a0a']} style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{editingExercise ? 'EDIT EXERCISE' : 'ADD EXERCISE'}</Text>
              <TouchableOpacity onPress={() => setExerciseModalVisible(false)}>
                <MaterialIcons name="close" size={24} color="#00ff88" />
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>EXERCISE NAME</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="e.g., Bench Press"
              placeholderTextColor="#666"
              value={newExercise.name}
              onChangeText={(text) => setNewExercise({...newExercise, name: text})}
            />

            {/* Quick select from database */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.exerciseDatabase}>
              {exerciseDatabase.map((ex, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.databaseItem}
                  onPress={() => selectExerciseFromDatabase(ex.name)}
                >
                  <LinearGradient colors={['#1a1a1a', '#0a0a0a']} style={styles.databaseGradient}>
                    <MaterialIcons name={ex.icon} size={16} color="#00ff88" />
                    <Text style={styles.databaseItemText}>{ex.name}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.exerciseFormRow}>
              <View style={styles.exerciseFormHalf}>
                <Text style={styles.inputLabel}>SETS</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="4"
                  placeholderTextColor="#666"
                  value={newExercise.sets}
                  onChangeText={(text) => setNewExercise({...newExercise, sets: text})}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.exerciseFormHalf}>
                <Text style={styles.inputLabel}>REPS</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="10"
                  placeholderTextColor="#666"
                  value={newExercise.reps}
                  onChangeText={(text) => setNewExercise({...newExercise, reps: text})}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.exerciseFormRow}>
              <View style={styles.exerciseFormHalf}>
                <Text style={styles.inputLabel}>WEIGHT (KG)</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="60 or BW"
                  placeholderTextColor="#666"
                  value={newExercise.weight}
                  onChangeText={(text) => setNewExercise({...newExercise, weight: text})}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.exerciseFormHalf}>
                <Text style={styles.inputLabel}>REST (SEC)</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="60"
                  placeholderTextColor="#666"
                  value={newExercise.restTime}
                  onChangeText={(text) => setNewExercise({...newExercise, restTime: text})}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <Text style={styles.inputLabel}>NOTES (OPTIONAL)</Text>
            <TextInput
              style={[styles.modalInput, styles.notesInput]}
              placeholder="e.g., Slow and controlled"
              placeholderTextColor="#666"
              value={newExercise.notes}
              onChangeText={(text) => setNewExercise({...newExercise, notes: text})}
              multiline
              numberOfLines={2}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancel}
                onPress={() => setExerciseModalVisible(false)}
              >
                <Text style={styles.modalCancelText}>CANCEL</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSave}
                onPress={editingExercise ? editExercise : addExercise}
              >
                <LinearGradient colors={['#00ff88', '#00cc66']} style={styles.modalSaveGradient}>
                  <Text style={styles.modalSaveText}>{editingExercise ? 'UPDATE' : 'ADD'}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>
      </Modal>

      {/* Workout Details Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={workoutDetailVisible}
        onRequestClose={() => setWorkoutDetailVisible(false)}
      >
        <View style={styles.modalOverlay}>
          {selectedWorkout && (
            <LinearGradient colors={['#1a1a1a', '#0a0a0a']} style={[styles.modalContent, styles.detailModal]}>
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.detailHeader}>
                  <TouchableOpacity onPress={() => setWorkoutDetailVisible(false)}>
                    <MaterialIcons name="close" size={24} color="#00ff88" />
                  </TouchableOpacity>
                </View>

                <LinearGradient
                  colors={selectedWorkout.color}
                  style={styles.detailIconContainer}
                >
                  <MaterialIcons name={selectedWorkout.icon} size={60} color="#fff" />
                </LinearGradient>

                <Text style={styles.detailTitle}>{selectedWorkout.name}</Text>
                <Text style={styles.detailDescription}>{selectedWorkout.description}</Text>

                <View style={styles.detailStats}>
                  <View style={styles.detailStat}>
                    <MaterialIcons name="timer" size={20} color="#00ff88" />
                    <Text style={styles.detailStatValue}>{selectedWorkout.duration} min</Text>
                    <Text style={styles.detailStatLabel}>DURATION</Text>
                  </View>
                  <View style={styles.detailStat}>
                    <MaterialIcons name="fitness-center" size={20} color="#00ff88" />
                    <Text style={styles.detailStatValue}>{selectedWorkout.exercises.length}</Text>
                    <Text style={styles.detailStatLabel}>EXERCISES</Text>
                  </View>
                  <View style={styles.detailStat}>
                    <MaterialIcons name="speed" size={20} color="#00ff88" />
                    <Text style={styles.detailStatValue}>{selectedWorkout.intensity}</Text>
                    <Text style={styles.detailStatLabel}>INTENSITY</Text>
                  </View>
                </View>

                {/* Exercise List in Detail View */}
                <Text style={styles.detailExercisesTitle}>EXERCISES</Text>
                {selectedWorkout.exercises.map((exercise, index) => (
                  <View key={exercise.id} style={styles.detailExerciseItem}>
                    <LinearGradient colors={['#1a1a1a', '#0a0a0a']} style={styles.detailExerciseGradient}>
                      <View style={styles.detailExerciseNumber}>
                        <Text style={styles.detailExerciseNumberText}>{index + 1}</Text>
                      </View>
                      <View style={styles.detailExerciseContent}>
                        <Text style={styles.detailExerciseName}>{exercise.name}</Text>
                        <View style={styles.detailExerciseMetrics}>
                          <Text style={styles.detailExerciseMetric}>{exercise.sets} × {exercise.reps}</Text>
                          <Text style={styles.detailExerciseMetric}>•</Text>
                          <Text style={styles.detailExerciseMetric}>{exercise.weight} KG</Text>
                          <Text style={styles.detailExerciseMetric}>•</Text>
                          <Text style={styles.detailExerciseMetric}>REST {exercise.restTime}S</Text>
                        </View>
                        {exercise.notes && (
                          <Text style={styles.detailExerciseNotes}>{exercise.notes}</Text>
                        )}
                      </View>
                    </LinearGradient>
                  </View>
                ))}

                <TouchableOpacity
                  style={styles.startWorkoutDetail}
                  onPress={() => {
                    completeWorkout(selectedWorkout.id);
                    setWorkoutDetailVisible(false);
                  }}
                >
                  {/* <LinearGradient colors={['#00ff88', '#00cc66']} style={styles.startWorkoutGradient}>
                    <Text style={styles.startWorkoutText}>START WORKOUT</Text>
                    <MaterialIcons name="play-arrow" size={24} color="#0a0a0a" />
                  </LinearGradient> */}
                </TouchableOpacity>
              </ScrollView>
            </LinearGradient>
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: '#00ff88',
    fontWeight: '700',
    letterSpacing: 2,
  },
  headerGradient: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  greeting: {
    fontSize: 14,
    color: '#00ff88',
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 5,
  },
  quote: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 1,
  },
  profileButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
  },
  profileGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitial: {
    fontSize: 24,
  },
  profileAi: {
    fontSize: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: '#1a1a1a',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    width: (width - 70) / 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#fff',
    marginTop: 5,
  },
  statLabel: {
    fontSize: 10,
    color: '#666',
    fontWeight: '600',
    marginTop: 2,
  },
  section: {
    padding: 20,
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
    fontWeight: '800',
    color: '#fff',
    marginLeft: 10,
    letterSpacing: 1,
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  workoutScroll: {
    marginBottom: 10,
  },
  workoutCard: {
    width: 200,
    height: 200,
    marginRight: 15,
    borderRadius: 20,
    overflow: 'hidden',
  },
  workoutGradient: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  workoutBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  workoutBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  workoutIcon: {
    alignSelf: 'flex-end',
  },
  workoutName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 10,
  },
  workoutMeta: {
    flexDirection: 'row',
  },
  workoutMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  workoutMetaText: {
    color: '#fff',
    fontSize: 12,
    marginLeft: 5,
    fontWeight: '600',
  },
  completedCount: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,255,136,0.3)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 5,
  },
  completedCountText: {
    color: '#fff',
    fontSize: 10,
    marginLeft: 4,
    fontWeight: '700',
  },
  createCard: {
    width: 200,
    height: 200,
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#00ff88',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  createContent: {
    alignItems: 'center',
    padding: 20,
  },
  createIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#00ff8820',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  createText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#00ff88',
    letterSpacing: 1,
  },
  createSubtext: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  emptyGoals: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#fff',
    marginTop: 15,
    letterSpacing: 1,
  },
  emptySubtext: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  goalCard: {
    backgroundColor: '#1a1a1a',
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  goalTitleSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  goalIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginTop: 25,
  },
  goalName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.5,
  },
  goalDeadline: {
    fontSize: 11,
    color: '#666',
    marginTop: 2,
  },
  goalTarget: {
    fontSize: 16,
    fontWeight: '800',
    color: '#00ff88',
  },
  progressSection: {
    marginLeft: 50,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: '#333',
    borderRadius: 3,
    marginBottom: 5,
  },
  progressBarFill: {
    height: 6,
    borderRadius: 3,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressCurrent: {
    fontSize: 11,
    color: '#666',
  },
  progressTarget: {
    fontSize: 11,
    color: '#999',
  },
  chatCta: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 15,
    overflow: 'hidden',
  },
  chatGradient: {
    padding: 20,
  },
  chatContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#0a0a0a',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  chatTextContainer: {
    flex: 1,
  },
  chatTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0a0a0a',
    letterSpacing: 1,
  },
  chatSubtitle: {
    fontSize: 12,
    color: '#0a0a0a',
    opacity: 0.8,
    marginTop: 2,
  },
  tipsSection: {
    padding: 20,
    paddingTop: 0,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#00ff88',
    marginBottom: 15,
    letterSpacing: 1,
  },
  tipCard: {
    marginBottom: 10,
    borderRadius: 12,
    overflow: 'hidden',
  },
  tipGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  tipIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#00ff8820',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  tipContent: {
    flex: 1,
  },
  tipCategory: {
    fontSize: 10,
    color: '#00ff88',
    fontWeight: '700',
    marginBottom: 2,
  },
  tipText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  modalContent: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    paddingBottom: 40,
  },
  detailModal: {
    flex: 1,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 1,
  },
  modalInput: {
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  unitSelector: {
    marginBottom: 15,
  },
  unitLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
    fontWeight: '600',
  },
  unitButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  unitButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#1a1a1a',
    marginRight: 8,
    marginBottom: 8,
  },
  unitButtonActive: {
    backgroundColor: '#00ff88',
  },
  unitButtonText: {
    color: '#666',
    fontSize: 12,
    fontWeight: '600',
  },
  unitButtonTextActive: {
    color: '#0a0a0a',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  modalCancel: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
    marginRight: 10,
  },
  modalCancelText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '700',
  },
  modalSave: {
    flex: 1,
    borderRadius: 10,
    overflow: 'hidden',
  },
  modalSaveGradient: {
    padding: 15,
    alignItems: 'center',
  },
  modalSaveText: {
    color: '#0a0a0a',
    fontSize: 14,
    fontWeight: '700',
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 30,
  },
  detailIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
  detailTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: 1,
  },
  detailDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  detailStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 40,
  },
  detailStat: {
    alignItems: 'center',
  },
  detailStatValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#fff',
    marginTop: 5,
  },
  detailStatLabel: {
    fontSize: 10,
    color: '#666',
    marginTop: 2,
  },
  startWorkoutDetail: {
    borderRadius: 15,
    overflow: 'hidden',
  },
  startWorkoutGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
  },
  startWorkoutText: {
    color: '#0a0a0a',
    fontSize: 18,
    fontWeight: '800',
    marginRight: 10,
    letterSpacing: 1,
  },
  workoutModalContent: {
    maxHeight: height * 0.9,
  },
  exercisesSection: {
    marginTop: 20,
    marginBottom: 20,
  },
  exercisesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  exercisesTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 1,
  },
  addExerciseButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  addExerciseGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  addExerciseText: {
    color: '#0a0a0a',
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 5,
  },
  noExercises: {
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#1a1a1a',
    borderRadius: 15,
  },
  noExercisesText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#666',
    marginTop: 10,
  },
  noExercisesSubtext: {
    fontSize: 12,
    color: '#444',
    marginTop: 5,
  },
  exerciseItem: {
    marginBottom: 10,
    borderRadius: 12,
    overflow: 'hidden',
  },
  exerciseGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  exerciseNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#00ff88',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  exerciseNumberText: {
    color: '#0a0a0a',
    fontSize: 14,
    fontWeight: '800',
  },
  exerciseDetails: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  exerciseMetrics: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  exerciseMetric: {
    fontSize: 11,
    color: '#00ff88',
    marginRight: 8,
    fontWeight: '600',
  },
  exerciseNotes: {
    fontSize: 10,
    color: '#666',
    marginTop: 4,
    fontStyle: 'italic',
  },
  exerciseActions: {
    flexDirection: 'row',
  },
  exerciseAction: {
    padding: 5,
    marginLeft: 5,
  },
  inputLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
    fontWeight: '600',
  },
  exerciseFormRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  exerciseFormHalf: {
    width: '48%',
  },
  notesInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  exerciseDatabase: {
    maxHeight: 80,
    marginBottom: 15,
  },
  databaseItem: {
    marginRight: 8,
    borderRadius: 15,
    overflow: 'hidden',
  },
  databaseGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  databaseItemText: {
    color: '#fff',
    fontSize: 12,
    marginLeft: 5,
    fontWeight: '500',
  },
  detailExercisesTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#fff',
    marginTop: 20,
    marginBottom: 15,
    letterSpacing: 1,
  },
  detailExerciseItem: {
    marginBottom: 10,
    borderRadius: 12,
    overflow: 'hidden',
  },
  detailExerciseGradient: {
    flexDirection: 'row',
    padding: 15,
  },
  detailExerciseNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#00ff88',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  detailExerciseNumberText: {
    color: '#0a0a0a',
    fontSize: 14,
    fontWeight: '800',
  },
  detailExerciseContent: {
    flex: 1,
  },
  detailExerciseName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 5,
  },
  detailExerciseMetrics: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 5,
  },
  detailExerciseMetric: {
    fontSize: 12,
    color: '#00ff88',
    marginRight: 8,
    fontWeight: '600',
  },
  detailExerciseNotes: {
    fontSize: 11,
    color: '#666',
    fontStyle: 'italic',
  },
  workoutCardWrapper: {
    marginRight: 15,
    position: 'relative',
  },
  cardActions: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    zIndex: 10,
  },
  cardActionButton: {
    marginLeft: 5,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  cardActionGradient: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  goalCardWrapper: {
    marginBottom: 10,
    position: 'relative',
  },
  goalCardActions: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    zIndex: 10,
  },
  goalActionButton: {
    marginLeft: 5,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  goalActionGradient: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
});