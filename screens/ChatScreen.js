import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useCallback, useEffect, useState } from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { Bubble, Composer, GiftedChat, InputToolbar, Send } from 'react-native-gifted-chat';

// Comprehensive exercise and fitness database
const fitnessDatabase = {
  // Weight Loss & Fat Burn
  weightLoss: [
    {
      id: 1,
      name: "HIIT Workouts",
      duration: "20-30 minutes",
      intensity: "High",
      benefits: "Maximum calorie burn, afterburn effect, time-efficient",
      calories: "300-500",
      frequency: "2-3 times/week",
      tips: "Alternate between high intensity and rest periods"
    },
    {
      id: 2,
      name: "Circuit Training",
      duration: "30-45 minutes",
      intensity: "Medium-High",
      benefits: "Combines cardio and strength, keeps heart rate up",
      calories: "250-400",
      frequency: "3 times/week",
      tips: "Minimize rest between exercises"
    },
    {
      id: 3,
      name: "Cardio Machines",
      duration: "30-60 minutes",
      intensity: "Medium",
      benefits: "Steady-state fat burning, low impact options",
      calories: "200-600",
      options: ["Treadmill", "Elliptical", "Stationary Bike", "Rowing Machine"],
      tips: "Vary machines to prevent boredom"
    }
  ],

  // Muscle Building & Strength
  muscleBuilding: [
    {
      id: 4,
      name: "Compound Exercises",
      sets: "3-5 sets of 6-12 reps",
      intensity: "High",
      benefits: "Build overall mass, multiple muscle groups",
      exercises: ["Squats", "Deadlifts", "Bench Press", "Pull-ups", "Overhead Press"],
      frequency: "2-3 times/week",
      tips: "Focus on proper form before increasing weight"
    },
    {
      id: 5,
      name: "Isolation Exercises",
      sets: "3-4 sets of 10-15 reps",
      intensity: "Medium",
      benefits: "Target specific muscles, improve definition",
      exercises: ["Bicep Curls", "Tricep Extensions", "Leg Curls", "Lateral Raises"],
      frequency: "2-3 times/week",
      tips: "Perfect for bringing up lagging muscles"
    },
    {
      id: 6,
      name: "Progressive Overload",
      duration: "Ongoing",
      intensity: "Variable",
      benefits: "Continuous muscle growth",
      methods: ["Increase weight", "More reps", "More sets", "Less rest time"],
      tips: "Track your workouts to ensure progression"
    }
  ],

  // Beginner Questions
  beginner: [
    {
      id: 7,
      name: "Full Body Workout",
      duration: "45-60 minutes",
      intensity: "Low-Medium",
      benefits: "Learn fundamentals, build foundation",
      frequency: "3 times/week",
      exercises: ["Squats", "Push-ups", "Rows", "Planks", "Lunges"],
      tips: "Start with bodyweight, then add weights gradually"
    },
    {
      id: 8,
      name: "Gym Etiquette",
      category: "Rules",
      rules: [
        "Wipe down equipment after use",
        "Rerack your weights",
        "Don't hog equipment during peak hours",
        "Ask before working in",
        "Keep phone conversations private"
      ],
      tips: "When in doubt, ask staff or regulars"
    },
    {
      id: 9,
      name: "Proper Form Tips",
      category: "Technique",
      tips: [
        "Keep back straight during lifts",
        "Breathe properly (exhale during effort)",
        "Control the negative portion",
        "Don't sacrifice form for weight",
        "Use mirrors to check posture"
      ]
    }
  ],

  // Nutrition & Diet
  nutrition: [
    {
      id: 10,
      name: "Pre-Workout Nutrition",
      timing: "1-2 hours before",
      options: ["Banana + PB", "Oatmeal", "Greek yogurt", "Protein shake"],
      benefits: "Provides energy, prevents muscle breakdown",
      tips: "Avoid heavy meals right before workout"
    },
    {
      id: 11,
      name: "Post-Workout Nutrition",
      timing: "Within 30-60 minutes",
      options: ["Protein shake", "Chicken + rice", "Eggs + toast", "Chocolate milk"],
      benefits: "Muscle recovery, glycogen replenishment",
      tips: "Aim for 20-40g protein after workout"
    },
    {
      id: 12,
      name: "Protein Intake",
      recommendation: "1.6-2.2g per kg bodyweight",
      sources: ["Chicken", "Fish", "Eggs", "Whey", "Beans", "Tofu"],
      timing: "Spread throughout the day",
      benefits: "Muscle repair, satiety, metabolism boost"
    },
    {
      id: 13,
      name: "Meal Prep Tips",
      benefits: "Saves time, controls portions, saves money",
      tips: [
        "Cook in bulk on Sundays",
        "Use containers for portion control",
        "Prep ingredients, not just meals",
        "Keep healthy snacks handy"
      ]
    }
  ],

  // Supplements
  supplements: [
    {
      id: 14,
      name: "Essential Supplements",
      essentials: ["Protein powder", "Creatine", "Multivitamin"],
      benefits: "Convenient nutrition, performance boost",
      timing: "Protein post-workout, creatine daily",
      tips: "Supplements supplement, not replace, real food"
    },
    {
      id: 15,
      name: "Pre-Workout",
      ingredients: ["Caffeine", "Beta-alanine", "Citrulline"],
      benefits: "Energy boost, focus, better pumps",
      timing: "15-30 minutes before workout",
      caution: "Build tolerance, don't take too late"
    },
    {
      id: 16,
      name: "BCAAs/EAA",
      benefits: "Muscle preservation, recovery",
      timing: "During workout or between meals",
      useCase: "Especially useful when fasting or dieting"
    }
  ],

  // Specific Goals
  specificGoals: [
    {
      id: 17,
      name: "Build Glutes",
      exercises: ["Hip Thrusts", "Romanian Deadlifts", "Bulgarian Split Squats", "Cable Kickbacks"],
      frequency: "2 times/week",
      tips: "Focus on glute activation, progressive overload",
      commonMistakes: "Using too much lower back, not squeezing at top"
    },
    {
      id: 18,
      name: "Six Pack Abs",
      exercises: ["Planks", "Cable Crunches", "Leg Raises", "Russian Twists"],
      frequency: "3-4 times/week",
      reality: "Abs are made in the kitchen, revealed in the gym",
      tips: "Lower body fat is key, train abs like any other muscle"
    },
    {
      id: 19,
      name: "Bigger Arms",
      exercises: ["Barbell Curls", "Skull Crushers", "Hammer Curls", "Close-grip Bench"],
      frequency: "2 times/week",
      tips: "Hit both biceps and triceps, triceps make 2/3 of arm mass"
    }
  ],

  // Recovery & Injury Prevention
  recovery: [
    {
      id: 20,
      name: "Post-Workout Stretching",
      duration: "10-15 minutes",
      benefits: "Reduces soreness, improves flexibility",
      stretches: ["Hamstring stretch", "Quad stretch", "Chest stretch", "Cat-cow"],
      timing: "Immediately after workout when muscles are warm"
    },
    {
      id: 21,
      name: "Active Recovery",
      activities: ["Walking", "Light swimming", "Yoga", "Foam rolling"],
      benefits: "Promotes blood flow, faster recovery",
      frequency: "On rest days",
      intensity: "Very low, just to move the body"
    },
    {
      id: 22,
      name: "Sleep for Gains",
      recommendation: "7-9 hours per night",
      benefits: "Muscle repair, hormone production, mental focus",
      tips: ["Consistent schedule", "No screens before bed", "Cool, dark room"]
    },
    {
      id: 23,
      name: "Common Injuries",
      types: ["Lower back pain", "Shoulder impingement", "Knee pain", "Tendonitis"],
      prevention: ["Proper form", "Warm-up properly", "Don't ego lift", "Listen to pain"],
      action: "See professional if pain persists"
    }
  ],

  // Workout Splits & Programming
  workoutSplits: [
    {
      id: 24,
      name: "Push/Pull/Legs (PPL)",
      schedule: {
        push: "Chest, shoulders, triceps",
        pull: "Back, biceps",
        legs: "Quads, hamstrings, glutes"
      },
      frequency: "Can do 3 or 6 days/week",
      benefits: "Balanced, allows adequate recovery",
      suitableFor: "Intermediate to advanced"
    },
    {
      id: 25,
      name: "Upper/Lower Split",
      schedule: {
        upper: "All upper body",
        lower: "All lower body"
      },
      frequency: "4 days/week (Upper/Lower/Upper/Lower)",
      benefits: "More frequency per muscle group",
      suitableFor: "Intermediate"
    },
    {
      id: 26,
      name: "Bro Split (Body Part)",
      schedule: {
        monday: "Chest",
        tuesday: "Back",
        wednesday: "Shoulders",
        thursday: "Arms",
        friday: "Legs"
      },
      benefits: "Focus on one muscle group deeply",
      drawback: "Less frequency per week",
      suitableFor: "Bodybuilding focus"
    }
  ],

  // Cardio & Conditioning
  cardio: [
    {
      id: 27,
      name: "LISS Cardio",
      duration: "30-60 minutes",
      intensity: "Low (conversation pace)",
      benefits: "Fat burning, recovery, endurance",
      examples: ["Brisk walking", "Light jogging", "Cycling"],
      bestFor: "Recovery days, beginners"
    },
    {
      id: 28,
      name: "HIIT Cardio",
      duration: "15-25 minutes",
      intensity: "Very high",
      benefits: "Time-efficient, afterburn effect, cardiovascular fitness",
      examples: ["Sprints", "Battle ropes", "Assault bike"],
      caution: "Not for beginners, need good base fitness"
    },
    {
      id: 29,
      name: "Stairmaster/Incline Walking",
      duration: "20-40 minutes",
      intensity: "Medium",
      benefits: "Glute activation, low impact, good for fat loss",
      tips: "Don't hold rails, maintain upright posture"
    }
  ],

  // Motivation & Mindset
  motivation: [
    {
      id: 30,
      name: "Plateau Breaking",
      strategies: [
        "Change rep ranges",
        "Deload week",
        "Try new exercises",
        "Fix weak points",
        "Improve nutrition/sleep"
      ],
      mindset: "Plateaus are normal, keep pushing through"
    },
    {
      id: 31,
      name: "Consistency Tips",
      tips: [
        "Set realistic goals",
        "Track progress",
        "Find a workout buddy",
        "Prepare workouts in advance",
        "Celebrate small wins"
      ],
      reminder: "Consistency beats intensity long-term"
    },
    {
      id: 32,
      name: "Gym Confidence",
      tips: [
        "Everyone started somewhere",
        "Most people focus on themselves",
        "Ask for spot/advice if needed",
        "Wear what makes you comfortable",
        "Go with a plan"
      ]
    }
  ]
};

const generateResponse = (message) => {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes('lose weight') || lowerMessage.includes('fat loss') || 
      lowerMessage.includes('burn fat') || lowerMessage.includes('get lean')) {
    return {
      text: "🔥 **FAT SHREDDING GUIDE** 🔥\n\nHere's how to torch that fat:",
      recommendations: fitnessDatabase.weightLoss,
      quickTip: "🔥 **PRO TIP**: Combine heavy lifts with HIIT. Diet is 80% of the equation!",
      category: "weightLoss"
    };
  }

  if (lowerMessage.includes('build muscle') || lowerMessage.includes('get bigger') || 
      lowerMessage.includes('mass') || lowerMessage.includes('bulk') ||
      lowerMessage.includes('strength')) {
    return {
      text: "💪 **BEAST MODE ACTIVATED** 💪\n\nMuscle building protocol:",
      recommendations: fitnessDatabase.muscleBuilding,
      quickTip: "🏋️ **IRON LAW**: Progressive overload - add weight or reps every week!",
      category: "muscleBuilding"
    };
  }

  if (lowerMessage.includes('beginner') || lowerMessage.includes('new to gym') || 
      lowerMessage.includes('first time') || lowerMessage.includes('where to start') ||
      lowerMessage.includes('noob')) {
    return {
      text: "🌱 **WELCOME TO THE GRIND** 🌱\n\nYour journey starts here:",
      recommendations: fitnessDatabase.beginner,
      quickTip: "🎯 **GOLDEN RULE**: Master form first. Everyone starts somewhere!",
      category: "beginner"
    };
  }

  if (lowerMessage.includes('eat') || lowerMessage.includes('diet') || 
      lowerMessage.includes('food') || lowerMessage.includes('meal') ||
      lowerMessage.includes('nutrition') || lowerMessage.includes('what to eat')) {
    return {
      text: "🥩 **FUEL FOR THE BEAST** 🥩\n\nNutrition to maximize gains:",
      recommendations: fitnessDatabase.nutrition,
      quickTip: "📊 **MACRO MATH**: 2g protein/kg bodyweight. Carbs = energy for heavy lifts!",
      category: "nutrition"
    };
  }

  if (lowerMessage.includes('supplement') || lowerMessage.includes('protein powder') || 
      lowerMessage.includes('creatine') || lowerMessage.includes('pre workout') ||
      lowerMessage.includes('whey')) {
    return {
      text: "🧪 **SUPPLEMENT SCIENCE** 🧪\n\nWhat actually works:",
      recommendations: fitnessDatabase.supplements,
      quickTip: "⚠️ **REAL TALK**: Supplements SUPPLEMENT real food. They're not magic!",
      category: "supplements"
    };
  }

  if (lowerMessage.includes('glutes') || lowerMessage.includes('booty') || 
      lowerMessage.includes('butt') || lowerMessage.includes('glute')) {
    return {
      text: "🍑 **GLUTE GAINS** 🍑\n\nBuild that shelf:",
      recommendations: fitnessDatabase.specificGoals.filter(g => g.id === 17),
      quickTip: "🔥 **ACTIVATION**: Squeeze at the top for 2 seconds. Mind-muscle connection!",
      category: "specificGoals"
    };
  }

  if (lowerMessage.includes('abs') || lowerMessage.includes('six pack') || 
      lowerMessage.includes('core') || lowerMessage.includes('stomach')) {
    return {
      text: "⚡ **CORE COMMANDMENTS** ⚡\n\nThe truth about abs:",
      recommendations: fitnessDatabase.specificGoals.filter(g => g.id === 18),
      quickTip: "🥗 **REALITY CHECK**: Abs are revealed in the kitchen, built in the gym!",
      category: "specificGoals"
    };
  }

  if (lowerMessage.includes('arms') || lowerMessage.includes('bicep') || 
      lowerMessage.includes('tricep') || lowerMessage.includes('bigger arms')) {
    return {
      text: "💪 **GUN SHOW** 💪\n\nBuild those cannons:",
      recommendations: fitnessDatabase.specificGoals.filter(g => g.id === 19),
      quickTip: "📏 **SIZE SECRET**: Triceps = 2/3 of arm mass. Don't neglect them!",
      category: "specificGoals"
    };
  }

  if (lowerMessage.includes('recovery') || lowerMessage.includes('sore') || 
      lowerMessage.includes('rest day') || lowerMessage.includes('injury') ||
      lowerMessage.includes('pain')) {
    return {
      text: "🔄 **RECOVERY IS GAINS** 🔄\n\nRest like a pro:",
      recommendations: fitnessDatabase.recovery,
      quickTip: "😴 **SLEEP = GROWTH**: 8 hours minimum. This is when muscles repair!",
      category: "recovery"
    };
  }

  if (lowerMessage.includes('split') || lowerMessage.includes('workout plan') || 
      lowerMessage.includes('program') || lowerMessage.includes('routine') ||
      lowerMessage.includes('schedule')) {
    return {
      text: "📅 **TRAINING SPLITS** 📅\n\nPick your weapon:",
      recommendations: fitnessDatabase.workoutSplits,
      quickTip: "🔄 **CONSISTENCY > PERFECTION**: Pick a split you can stick to!",
      category: "workoutSplits"
    };
  }

  if (lowerMessage.includes('cardio') || lowerMessage.includes('running') || 
      lowerMessage.includes('hiit') || lowerMessage.includes('stairmaster')) {
    return {
      text: "🏃 **CARDIO KILLER** 🏃\n\nConditioning for warriors:",
      recommendations: fitnessDatabase.cardio,
      quickTip: "⚡ **BALANCE**: Don't overdo cardio if strength is your goal",
      category: "cardio"
    };
  }

  if (lowerMessage.includes('motivation') || lowerMessage.includes('tired') || 
      lowerMessage.includes('give up') || lowerMessage.includes('discouraged') ||
      lowerMessage.includes('plateau')) {
    return {
      text: "💫 **MINDSET OF A CHAMPION** 💫\n\nStay hungry:",
      recommendations: fitnessDatabase.motivation,
      quickTip: "🌟 **REMEMBER**: Progress over perfection. Small wins add up!",
      category: "motivation"
    };
  }

  if (lowerMessage.includes('hi') || lowerMessage.includes('hello') || 
      lowerMessage.includes('hey') || lowerMessage.includes('sup')) {
    return {
      text: "👋 **READY TO GRIND?** 👋\n\nI'm your AI fitness coach. Ask me about:\n\n" +
            "💪 BUILDING MUSCLE\n" +
            "🔥 SHREDDING FAT\n" +
            "🥗 NUTRITION\n" +
            "📅 WORKOUT PLANS\n" +
            "🧪 SUPPLEMENTS\n" +
            "🔄 RECOVERY\n\n" +
            "WHAT'S YOUR GOAL TODAY?",
    };
  }

  return {
    text: "💪 **HOW CAN I HELP?** 💪\n\nTry asking about:\n\n" +
          "• WEIGHT LOSS & FAT BURN\n" +
          "• BUILDING MUSCLE\n" +
          "• BEGINNER GUIDES\n" +
          "• NUTRITION & MEAL PREP\n" +
          "• SUPPLEMENTS\n" +
          "• SPECIFIC BODY PARTS\n" +
          "• WORKOUT SPLITS\n" +
          "• CARDIO\n" +
          "• RECOVERY\n" +
          "• MOTIVATION",
  };
};

const BotAvatar = () => (
  <LinearGradient
    colors={['#00ff88', '#00cc66']}
    style={styles.botAvatar}
  >
    <MaterialIcons name="fitness-center" size={24} color="#0a0a0a" />
  </LinearGradient>
);

export default function ChatScreen() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        // text: "👋 **READY TO GRIND?** 👋\n\nI'm your AI fitness coach. Ask me about:\n\n💪 BUILDING MUSCLE\n🔥 SHREDDING FAT\n🥗 NUTRITION\n📅 WORKOUT PLANS\n🧪 SUPPLEMENTS\n🔄 RECOVERY\n\n**WHAT'S YOUR GOAL TODAY?**",
        text: "👋 **READY TO GRIND?** 👋\n\nI'm your AI fitness coach. Ask me about:\n\n💪 BUILDING MUSCLE\n🔥 SHREDDING FAT\n🥗 NUTRITION\n🧪 SUPPLEMENTS\n\n**WHAT'S YOUR GOAL TODAY?**",
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'FITNESS COACH',
          avatar: BotAvatar,
        },
      },
    ]);
  }, []);

  const onSend = useCallback((newMessages = []) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages));
    
    setTimeout(() => {
      const userMessage = newMessages[0].text;
      const response = generateResponse(userMessage);
      
      const botMessage = {
        _id: Math.round(Math.random() * 1000000),
        text: response.text,
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'FITNESS COACH',
          avatar: BotAvatar,
        },
      };
      
      setMessages(previousMessages => GiftedChat.append(previousMessages, [botMessage]));
      
      if (response.recommendations) {
        response.recommendations.forEach((rec, index) => {
          setTimeout(() => {
            let messageText = formatExerciseMessage(rec);
            
            const recMessage = {
              _id: Math.round(Math.random() * 1000000),
              text: messageText,
              createdAt: new Date(),
              user: {
                _id: 2,
                name: 'FITNESS COACH',
              },
            };
            setMessages(previousMessages => GiftedChat.append(previousMessages, [recMessage]));
          }, index * 600);
        });
        
        setTimeout(() => {
          const tipMessage = {
            _id: Math.round(Math.random() * 1000000),
            text: `⚡ **PRO TIP:** ${response.quickTip}`,
            createdAt: new Date(),
            user: {
              _id: 2,
              name: 'FITNESS COACH',
            },
          };
          setMessages(previousMessages => GiftedChat.append(previousMessages, [tipMessage]));
        }, response.recommendations.length * 600 + 600);
      }
    }, 800);
  }, []);

  const formatExerciseMessage = (rec) => {
    let message = `**${rec.name}**\n`;
    
    if (rec.duration) message += `⏱️ DURATION: ${rec.duration}\n`;
    if (rec.sets) message += `💪 SETS: ${rec.sets}\n`;
    if (rec.intensity) message += `🔥 INTENSITY: ${rec.intensity}\n`;
    if (rec.benefits) message += `✅ BENEFITS: ${rec.benefits}\n`;
    if (rec.calories) message += `🔥 CALORIES: ${rec.calories}\n`;
    if (rec.frequency) message += `📅 FREQUENCY: ${rec.frequency}\n`;
    if (rec.timing) message += `⏰ TIMING: ${rec.timing}\n`;
    if (rec.exercises) message += `🏋️ EXERCISES: ${rec.exercises.join(', ')}\n`;
    if (rec.options) message += `📋 OPTIONS: ${rec.options.join(', ')}\n`;
    if (rec.tips && !Array.isArray(rec.tips)) message += `💡 TIP: ${rec.tips}\n`;
    
    return message;
  };

  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#00ff88',
          },
          left: {
            backgroundColor: '#1a1a1a',
          },
        }}
        textStyle={{
          right: {
            color: '#0a0a0a',
            fontWeight: '500',
          },
          left: {
            color: '#fff',
            fontWeight: '500',
          },
        }}
      />
    );
  };

  const renderSend = (props) => {
    return (
      <Send {...props}>
        <LinearGradient colors={['#00ff88', '#00cc66']} style={styles.sendButton}>
          <MaterialIcons name="send" size={20} color="#0a0a0a" />
        </LinearGradient>
      </Send>
    );
  };

  const renderInputToolbar = (props) => {
    return (
      <InputToolbar
        {...props}
        containerStyle={styles.inputToolbar}
        primaryStyle={styles.inputPrimary}
      />
    );
  };

  const renderComposer = (props) => {
    return (
      <Composer
        {...props}
        textInputStyle={styles.composer}
        placeholder="ASK YOUR COACH..."
        placeholderTextColor="#666"
      />
    );
  };

  const quickQuestions = [
    { icon: 'whatshot', text: 'LOSE FAT', query: 'How do I lose weight and burn fat?' },
    { icon: 'fitness-center', text: 'BUILD MUSCLE', query: 'How do I build muscle and get bigger?' },
    { icon: 'star', text: 'BEGINNER', query: "I'm a beginner, where should I start?" },
    { icon: 'restaurant', text: 'NUTRITION', query: 'What should I eat before and after workout?' },
    { icon: 'science', text: 'SUPPLEMENTS', query: 'Do I need protein powder and supplements?' },
    { icon: 'accessibility', text: 'GLUTES', query: 'How do I grow my glutes?' },
    { icon: 'fitness-center', text: 'ABS', query: 'How do I get six pack abs?' },
    { icon: 'sports-mma', text: 'ARMS', query: 'How do I get bigger arms?' },
    { icon: 'calendar-today', text: 'SPLITS', query: "What's the best workout split?" },
    { icon: 'directions-run', text: 'CARDIO', query: 'How much cardio should I do?' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0a" />
      
      {/* <LinearGradient colors={['#0a0a0a', '#1a1a1a']} style={styles.header}>
        <View style={styles.headerContent}>
          <LinearGradient colors={['#00ff88', '#00cc66']} style={styles.headerIcon}>
            <MaterialIcons name="fitness-center" size={24} color="#0a0a0a" />
          </LinearGradient>
          <View>
            <Text style={styles.headerTitle}>FITNESS COACH</Text>
            <Text style={styles.headerSubtitle}>ALWAYS ONLINE • READY TO GRIND</Text>
          </View>
        </View>
      </LinearGradient> */}

      <View style={styles.chatContainer}>
        <GiftedChat
          messages={messages}
          onSend={messages => onSend(messages)}
          user={{
            _id: 1,
          }}
          renderBubble={renderBubble}
          renderSend={renderSend}
          renderInputToolbar={renderInputToolbar}
          renderComposer={renderComposer}
          alwaysShowSend
          scrollToBottom
          renderAvatar={null}
          messagesContainerStyle={styles.messagesContainer}
          placeholder="ASK YOUR COACH..."
          minInputToolbarHeight={70}
        />
      </View>
      
      <View style={styles.quickActions}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.quickActionsContent}
        >
          {quickQuestions.map((item, index) => (
            <TouchableOpacity 
              key={index}
              style={styles.quickActionCard}
              onPress={() => onSend([{
                _id: Math.random(),
                text: item.query,
                createdAt: new Date(),
                user: { _id: 1 }
              }])}
            >
              <LinearGradient colors={['#1a1a1a', '#0a0a0a']} style={styles.quickActionGradient}>
                <MaterialIcons name={item.icon} size={20} color="#00ff88" />
                <Text style={styles.quickActionCardText}>{item.text}</Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#00ff88',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    width: 45,
    height: 45,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 1,
  },
  headerSubtitle: {
    fontSize: 10,
    color: '#00ff88',
    marginTop: 2,
    fontWeight: '600',
  },
  chatContainer: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  messagesContainer: {
    backgroundColor: '#0a0a0a',
  },
  inputToolbar: {
    backgroundColor: '#1a1a1a',
    borderTopWidth: 1,
    borderTopColor: '#333',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  inputPrimary: {
    alignItems: 'center',
  },
  composer: {
    backgroundColor: '#1a1a1a',
    color: '#fff',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  sendButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  botAvatar: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickActions: {
    backgroundColor: '#0a0a0a',
    borderTopWidth: 1,
    borderTopColor: '#333',
    paddingVertical: 15,
  },
  quickActionsContent: {
    paddingHorizontal: 15,
  },
  quickActionCard: {
    marginRight: 10,
    borderRadius: 12,
    overflow: 'hidden',
  },
  quickActionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#333',
  },
  quickActionCardText: {
    marginLeft: 8,
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
    letterSpacing: 0.5,
  },
});