import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useCallback, useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Bubble, GiftedChat, Send } from 'react-native-gifted-chat';

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

  // Weight Loss Questions
  if (lowerMessage.includes('lose weight') || lowerMessage.includes('fat loss') || 
      lowerMessage.includes('burn fat') || lowerMessage.includes('get lean')) {
    return {
      text: "🎯 **Weight Loss Focus**: Here are the most effective workouts and tips:",
      recommendations: fitnessDatabase.weightLoss,
      quickTip: "🔥 **Pro Tip**: Combine strength training with cardio for best results. Diet is 70% of the equation!",
      category: "weightLoss"
    };
  }

  // Muscle Building
  if (lowerMessage.includes('build muscle') || lowerMessage.includes('get bigger') || 
      lowerMessage.includes('mass') || lowerMessage.includes('bulk') ||
      lowerMessage.includes('strength')) {
    return {
      text: "💪 **Muscle Building Guide**: Here's how to pack on quality mass:",
      recommendations: fitnessDatabase.muscleBuilding,
      quickTip: "🏋️ **Key Principle**: Progressive overload - aim to add weight or reps each week!",
      category: "muscleBuilding"
    };
  }

  // Beginner Questions
  if (lowerMessage.includes('beginner') || lowerMessage.includes('new to gym') || 
      lowerMessage.includes('first time') || lowerMessage.includes('where to start') ||
      lowerMessage.includes('noob')) {
    return {
      text: "🌱 **Welcome to the Gym!** Here's everything you need to know as a beginner:",
      recommendations: fitnessDatabase.beginner,
      quickTip: "🎯 **Start Simple**: Master form first, then add weight. Everyone was once a beginner!",
      category: "beginner"
    };
  }

  // Nutrition Questions
  if (lowerMessage.includes('eat') || lowerMessage.includes('diet') || 
      lowerMessage.includes('food') || lowerMessage.includes('meal') ||
      lowerMessage.includes('nutrition') || lowerMessage.includes('what to eat')) {
    return {
      text: "🥗 **Nutrition Guide**: Fuel your gains with proper nutrition:",
      recommendations: fitnessDatabase.nutrition,
      quickTip: "📊 **Macro Tip**: Protein: 1.6-2.2g/kg, Fats: 0.5-1g/kg, rest carbs",
      category: "nutrition"
    };
  }

  // Supplements
  if (lowerMessage.includes('supplement') || lowerMessage.includes('protein powder') || 
      lowerMessage.includes('creatine') || lowerMessage.includes('pre workout') ||
      lowerMessage.includes('whey')) {
    return {
      text: "🧪 **Supplement Guide**: What actually works and what's optional:",
      recommendations: fitnessDatabase.supplements,
      quickTip: "⚠️ **Remember**: Supplements supplement your diet, they don't replace it!",
      category: "supplements"
    };
  }

  // Specific Body Parts
  if (lowerMessage.includes('glutes') || lowerMessage.includes('booty') || 
      lowerMessage.includes('butt') || lowerMessage.includes('glute')) {
    return {
      text: "🍑 **Glute Building Guide**: Here's how to build stronger glutes:",
      recommendations: fitnessDatabase.specificGoals.filter(g => g.id === 17),
      quickTip: "🔥 **Activation Tip**: Squeeze at the top of each movement for 2 seconds!",
      category: "specificGoals"
    };
  }

  if (lowerMessage.includes('abs') || lowerMessage.includes('six pack') || 
      lowerMessage.includes('core') || lowerMessage.includes('stomach')) {
    return {
      text: "💪 **Abs Guide**: Truth about getting a six pack:",
      recommendations: fitnessDatabase.specificGoals.filter(g => g.id === 18),
      quickTip: "🥗 **Reality Check**: Abs are made in the kitchen, revealed in the gym!",
      category: "specificGoals"
    };
  }

  if (lowerMessage.includes('arms') || lowerMessage.includes('bicep') || 
      lowerMessage.includes('tricep') || lowerMessage.includes('bigger arms')) {
    return {
      text: "💪 **Arm Building Guide**: Build bigger, stronger arms:",
      recommendations: fitnessDatabase.specificGoals.filter(g => g.id === 19),
      quickTip: "📏 **Arm Size Tip**: Triceps make up 2/3 of arm mass - don't neglect them!",
      category: "specificGoals"
    };
  }

  // Recovery & Injury
  if (lowerMessage.includes('recovery') || lowerMessage.includes('sore') || 
      lowerMessage.includes('rest day') || lowerMessage.includes('injury') ||
      lowerMessage.includes('pain')) {
    return {
      text: "🔄 **Recovery & Injury Prevention**: Essential for long-term progress:",
      recommendations: fitnessDatabase.recovery,
      quickTip: "😴 **Sleep is #1**: 7-9 hours of quality sleep = better gains!",
      category: "recovery"
    };
  }

  // Workout Splits
  if (lowerMessage.includes('split') || lowerMessage.includes('workout plan') || 
      lowerMessage.includes('program') || lowerMessage.includes('routine') ||
      lowerMessage.includes('schedule')) {
    return {
      text: "📅 **Workout Splits**: Choose what fits your schedule and goals:",
      recommendations: fitnessDatabase.workoutSplits,
      quickTip: "🔄 **Pro Tip**: Pick a split you can stick to consistently!",
      category: "workoutSplits"
    };
  }

  // Cardio Questions
  if (lowerMessage.includes('cardio') || lowerMessage.includes('running') || 
      lowerMessage.includes('hiit') || lowerMessage.includes('stairmaster')) {
    return {
      text: "🏃 **Cardio Guide**: Different types for different goals:",
      recommendations: fitnessDatabase.cardio,
      quickTip: "⚖️ **Balance Tip**: Don't overdo cardio if trying to build muscle",
      category: "cardio"
    };
  }

  // Motivation & Mindset
  if (lowerMessage.includes('motivation') || lowerMessage.includes('tired') || 
      lowerMessage.includes('give up') || lowerMessage.includes('discouraged') ||
      lowerMessage.includes('plateau')) {
    return {
      text: "💫 **Motivation & Mindset**: Stay on track with these tips:",
      recommendations: fitnessDatabase.motivation,
      quickTip: "🌟 **Remember**: Progress, not perfection. Small steps lead to big changes!",
      category: "motivation"
    };
  }

  // Gym Etiquette
  if (lowerMessage.includes('etiquette') || lowerMessage.includes('gym rules') || 
      lowerMessage.includes('proper gym') || lowerMessage.includes('gym culture')) {
    return {
      text: "🤝 **Gym Etiquette 101**: Be a respectful gym member:",
      recommendations: fitnessDatabase.beginner.filter(b => b.id === 8),
      quickTip: "🧹 **Golden Rule**: Always wipe equipment and rerack weights!",
      category: "beginner"
    };
  }

  // Greeting
  if (lowerMessage.includes('hi') || lowerMessage.includes('hello') || 
      lowerMessage.includes('hey')) {
    return {
      text: "👋 **Welcome to Gym Assistant!** I can help you with:\n\n" +
            "💪 Building muscle\n" +
            "🔥 Losing weight\n" +
            "🥗 Nutrition advice\n" +
            "📅 Workout plans\n" +
            "🧪 Supplements\n" +
            "🔄 Recovery tips\n" +
            "🤝 Gym etiquette\n\n" +
            "What's your fitness goal today?",
    };
  }

  // Default Response
  return {
    text: "💪 **How can I help with your fitness journey?** Try asking about:\n\n" +
          "• Weight loss & fat burning\n" +
          "• Building muscle & strength\n" +
          "• Beginner guides\n" +
          "• Nutrition & meal prep\n" +
          "• Supplements (protein, creatine)\n" +
          "• Specific body parts (abs, glutes, arms)\n" +
          "• Workout splits & programs\n" +
          "• Cardio (HIIT, LISS)\n" +
          "• Recovery & injury prevention\n" +
          "• Gym etiquette\n" +
          "• Motivation & mindset",
  };
};

const BotAvatar = () => (
  <LinearGradient
    colors={['#2ecc71', '#27ae60']}
    style={styles.botAvatar}
  >
    <MaterialIcons name="fitness-center" size={20} color="#fff" />
  </LinearGradient>
);

export default function ChatScreen() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: "👋 **Welcome to Gym Assistant!** I'm here to help with all your fitness questions - from building muscle to losing weight, nutrition advice to workout plans. What's your fitness goal today?",
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'Gym Assistant',
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
          name: 'Gym Assistant',
          avatar: BotAvatar,
        },
      };
      
      setMessages(previousMessages => GiftedChat.append(previousMessages, [botMessage]));
      
      if (response.recommendations) {
        response.recommendations.forEach((rec, index) => {
          setTimeout(() => {
            let messageText = '';
            
            if (rec.rules || rec.tips) {
              if (rec.rules) {
                messageText = `**${rec.name}**\n\n` + rec.rules.map(rule => `• ${rule}`).join('\n');
              } else if (Array.isArray(rec.tips)) {
                messageText = `**${rec.name}**\n\n` + rec.tips.map(tip => `• ${tip}`).join('\n');
              } else {
                messageText = formatExerciseMessage(rec);
              }
            } else {
              messageText = formatExerciseMessage(rec);
            }
            
            const recMessage = {
              _id: Math.round(Math.random() * 1000000),
              text: messageText,
              createdAt: new Date(),
              user: {
                _id: 2,
                name: 'Gym Assistant',
              },
            };
            setMessages(previousMessages => GiftedChat.append(previousMessages, [recMessage]));
          }, index * 500);
        });
        
        setTimeout(() => {
          const tipMessage = {
            _id: Math.round(Math.random() * 1000000),
            text: `💡 **Quick Tip:** ${response.quickTip}`,
            createdAt: new Date(),
            user: {
              _id: 2,
              name: 'Gym Assistant',
            },
          };
          setMessages(previousMessages => GiftedChat.append(previousMessages, [tipMessage]));
        }, response.recommendations.length * 500 + 500);
      }
    }, 1000);
  }, []);

  const formatExerciseMessage = (rec) => {
    let message = `**${rec.name}**\n`;
    
    if (rec.duration) message += `⏱️ Duration: ${rec.duration}\n`;
    if (rec.sets) message += `💪 Sets: ${rec.sets}\n`;
    if (rec.intensity) message += `🔥 Intensity: ${rec.intensity}\n`;
    if (rec.benefits) message += `✅ Benefits: ${rec.benefits}\n`;
    if (rec.calories) message += `🔥 Calories: ${rec.calories}\n`;
    if (rec.frequency) message += `📅 Frequency: ${rec.frequency}\n`;
    if (rec.timing) message += `⏰ Timing: ${rec.timing}\n`;
    if (rec.exercises) message += `🏋️ Exercises: ${rec.exercises.join(', ')}\n`;
    if (rec.options) message += `📋 Options: ${rec.options.join(', ')}\n`;
    if (rec.methods) message += `📊 Methods: ${rec.methods.join(', ')}\n`;
    if (rec.ingredients) message += `🧪 Ingredients: ${rec.ingredients.join(', ')}\n`;
    if (rec.caution) message += `⚠️ Caution: ${rec.caution}\n`;
    if (rec.reality) message += `💭 Reality: ${rec.reality}\n`;
    if (rec.commonMistakes) message += `❌ Common Mistakes: ${rec.commonMistakes}\n`;
    
    return message;
  };

  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#2ecc71',
          },
          left: {
            backgroundColor: '#f0f0f0',
          },
        }}
        textStyle={{
          right: {
            color: '#fff',
          },
          left: {
            color: '#000',
          },
        }}
      />
    );
  };

  const renderSend = (props) => {
    return (
      <Send {...props}>
        <View style={styles.sendingContainer}>
          <MaterialIcons name="send" size={24} color="#2ecc71" />
        </View>
      </Send>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.chatContainer}>
        <GiftedChat
          messages={messages}
          onSend={messages => onSend(messages)}
          user={{
            _id: 1,
          }}
          renderBubble={renderBubble}
          renderSend={renderSend}
          alwaysShowSend
          scrollToBottom
          renderAvatar={null}
          messagesContainerStyle={styles.messagesContainer}
          placeholder="Ask about workouts, nutrition, supplements..."
        />
      </View>
      
      <View style={styles.quickActions}>
        <Text style={styles.quickActionsTitle}>📋 Quick Questions:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {/* Category 1: Goals */}
          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={() => onSend([{
              _id: Math.random(),
              text: "How do I lose weight and burn fat?",
              createdAt: new Date(),
              user: { _id: 1 }
            }])}
          >
            <MaterialIcons name="whatshot" size={20} color="#2ecc71" />
            <Text style={styles.quickActionText}>Weight Loss</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={() => onSend([{
              _id: Math.random(),
              text: "How do I build muscle and get bigger?",
              createdAt: new Date(),
              user: { _id: 1 }
            }])}
          >
            <MaterialIcons name="fitness-center" size={20} color="#2ecc71" />
            <Text style={styles.quickActionText}>Build Muscle</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={() => onSend([{
              _id: Math.random(),
              text: "I'm a beginner, where should I start?",
              createdAt: new Date(),
              user: { _id: 1 }
            }])}
          >
            <MaterialIcons name="star" size={20} color="#2ecc71" />
            <Text style={styles.quickActionText}>Beginner Guide</Text>
          </TouchableOpacity>

          {/* Category 2: Nutrition */}
          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={() => onSend([{
              _id: Math.random(),
              text: "What should I eat before and after workout?",
              createdAt: new Date(),
              user: { _id: 1 }
            }])}
          >
            <MaterialIcons name="restaurant" size={20} color="#2ecc71" />
            <Text style={styles.quickActionText}>Pre/Post Meals</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={() => onSend([{
              _id: Math.random(),
              text: "Do I need protein powder and supplements?",
              createdAt: new Date(),
              user: { _id: 1 }
            }])}
          >
            <MaterialIcons name="science" size={20} color="#2ecc71" />
            <Text style={styles.quickActionText}>Supplements</Text>
          </TouchableOpacity>

          {/* Category 3: Body Parts */}
          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={() => onSend([{
              _id: Math.random(),
              text: "How do I grow my glutes?",
              createdAt: new Date(),
              user: { _id: 1 }
            }])}
          >
            <MaterialIcons name="accessibility" size={20} color="#2ecc71" />
            <Text style={styles.quickActionText}>Build Glutes</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={() => onSend([{
              _id: Math.random(),
              text: "How do I get six pack abs?",
              createdAt: new Date(),
              user: { _id: 1 }
            }])}
          >
            <MaterialIcons name="fitness-center" size={20} color="#2ecc71" />
            <Text style={styles.quickActionText}>Six Pack Abs</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={() => onSend([{
              _id: Math.random(),
              text: "How do I get bigger arms?",
              createdAt: new Date(),
              user: { _id: 1 }
            }])}
          >
            <MaterialIcons name="sports-mma" size={20} color="#2ecc71" />
            <Text style={styles.quickActionText}>Bigger Arms</Text>
          </TouchableOpacity>

          {/* Category 4: Workout Structure */}
          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={() => onSend([{
              _id: Math.random(),
              text: "What's the best workout split?",
              createdAt: new Date(),
              user: { _id: 1 }
            }])}
          >
            <MaterialIcons name="calendar-today" size={20} color="#2ecc71" />
            <Text style={styles.quickActionText}>Workout Split</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={() => onSend([{
              _id: Math.random(),
              text: "How much cardio should I do?",
              createdAt: new Date(),
              user: { _id: 1 }
            }])}
          >
            <MaterialIcons name="directions-run" size={20} color="#2ecc71" />
            <Text style={styles.quickActionText}>Cardio Guide</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={() => onSend([{
              _id: Math.random(),
              text: "HIIT or LISS cardio?",
              createdAt: new Date(),
              user: { _id: 1 }
            }])}
          >
            <MaterialIcons name="speed" size={20} color="#2ecc71" />
            <Text style={styles.quickActionText}>HIIT vs LISS</Text>
          </TouchableOpacity>

          {/* Category 5: Recovery & Mindset */}
          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={() => onSend([{
              _id: Math.random(),
              text: "How do I recover faster?",
              createdAt: new Date(),
              user: { _id: 1 }
            }])}
          >
            <MaterialIcons name="healing" size={20} color="#2ecc71" />
            <Text style={styles.quickActionText}>Recovery Tips</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={() => onSend([{
              _id: Math.random(),
              text: "How do I stay motivated?",
              createdAt: new Date(),
              user: { _id: 1 }
            }])}
          >
            <MaterialIcons name="emoji-emotions" size={20} color="#2ecc71" />
            <Text style={styles.quickActionText}>Motivation</Text>
          </TouchableOpacity>

          {/* Category 6: Gym Culture */}
          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={() => onSend([{
              _id: Math.random(),
              text: "What's proper gym etiquette?",
              createdAt: new Date(),
              user: { _id: 1 }
            }])}
          >
            <MaterialIcons name="handshake" size={20} color="#2ecc71" />
            <Text style={styles.quickActionText}>Gym Etiquette</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={() => onSend([{
              _id: Math.random(),
              text: "How do I avoid injuries?",
              createdAt: new Date(),
              user: { _id: 1 }
            }])}
          >
            <MaterialIcons name="security" size={20} color="#2ecc71" />
            <Text style={styles.quickActionText}>Injury Prevention</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  chatContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  messagesContainer: {
    paddingBottom: 10,
  },
  sendingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginBottom: 5,
  },
  botAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickActions: {
    padding: 15,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  quickActionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 10,
  },
  quickActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
  },
  quickActionText: {
    marginLeft: 5,
    color: '#2ecc71',
    fontWeight: '500',
    fontSize: 12,
  },
});