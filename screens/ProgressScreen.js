// screens/ProgressScreen.js
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');

const ProgressScreen = () => {
  const weeklyData = [
    { day: 'Mon', minutes: 20 },
    { day: 'Tue', minutes: 30 },
    { day: 'Wed', minutes: 15 },
    { day: 'Thu', minutes: 25 },
    { day: 'Fri', minutes: 40 },
    { day: 'Sat', minutes: 35 },
    { day: 'Sun', minutes: 20 },
  ];

  const achievements = [
    {
      id: 1,
      title: 'First Steps',
      description: 'Completed your first workout',
      date: '2 days ago',
      icon: 'directions-walk',
      achieved: true,
    },
    {
      id: 2,
      title: 'Consistency',
      description: 'Worked out 5 days in a row',
      date: 'In progress',
      icon: 'local-fire-department',
      achieved: false,
    },
    {
      id: 3,
      title: 'Strength Builder',
      description: 'Completed 10 strength exercises',
      date: '4/10 completed',
      icon: 'fitness-center',
      achieved: false,
    },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Summary Card */}
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.summaryCard}
      >
        <Text style={styles.summaryTitle}>This Week's Progress</Text>
        <View style={styles.summaryStats}>
          <View style={styles.summaryStat}>
            <Text style={styles.summaryStatValue}>185</Text>
            <Text style={styles.summaryStatLabel}>Minutes</Text>
          </View>
          <View style={styles.summaryStat}>
            <Text style={styles.summaryStatValue}>7</Text>
            <Text style={styles.summaryStatLabel}>Workouts</Text>
          </View>
          <View style={styles.summaryStat}>
            <Text style={styles.summaryStatValue}>1,250</Text>
            <Text style={styles.summaryStatLabel}>Calories</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Weekly Chart */}
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Weekly Activity</Text>
        <View style={styles.chartContainer}>
          {weeklyData.map((item, index) => (
            <View key={index} style={styles.chartBarContainer}>
              <View style={styles.chartBarWrapper}>
                <View
                  style={[
                    styles.chartBar,
                    { height: (item.minutes / 40) * 100 },
                  ]}
                />
              </View>
              <Text style={styles.chartLabel}>{item.day}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Achievements */}
      <View style={styles.achievementsCard}>
        <Text style={styles.achievementsTitle}>Achievements</Text>
        {achievements.map((achievement) => (
          <View
            key={achievement.id}
            style={[
              styles.achievementItem,
              !achievement.achieved && styles.achievementItemLocked,
            ]}
          >
            <View
              style={[
                styles.achievementIcon,
                achievement.achieved
                  ? styles.achievementIconAchieved
                  : styles.achievementIconLocked,
              ]}
            >
              <MaterialIcons
                name={achievement.icon}
                size={24}
                color={achievement.achieved ? '#667eea' : '#999'}
              />
            </View>
            <View style={styles.achievementInfo}>
              <Text style={styles.achievementTitle}>{achievement.title}</Text>
              <Text style={styles.achievementDescription}>
                {achievement.description}
              </Text>
              <Text style={styles.achievementDate}>{achievement.date}</Text>
            </View>
            {achievement.achieved && (
              <MaterialIcons name="check-circle" size={24} color="#4caf50" />
            )}
          </View>
        ))}
      </View>

      {/* Progress Stats */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <MaterialIcons name="trending-up" size={30} color="#667eea" />
          <Text style={styles.statCardValue}>+15%</Text>
          <Text style={styles.statCardLabel}>Fitness Score</Text>
        </View>
        <View style={styles.statCard}>
          <MaterialIcons name="fitness-center" size={30} color="#667eea" />
          <Text style={styles.statCardValue}>12</Text>
          <Text style={styles.statCardLabel}>Exercises Mastered</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  summaryCard: {
    margin: 15,
    padding: 20,
    borderRadius: 15,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryStat: {
    alignItems: 'center',
  },
  summaryStatValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  summaryStatLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 5,
  },
  chartCard: {
    backgroundColor: '#fff',
    margin: 15,
    marginTop: 0,
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 150,
  },
  chartBarContainer: {
    alignItems: 'center',
  },
  chartBarWrapper: {
    height: 100,
    width: 30,
    backgroundColor: '#f0f0f0',
    borderRadius: 15,
    overflow: 'hidden',
  },
  chartBar: {
    width: '100%',
    backgroundColor: '#667eea',
    position: 'absolute',
    bottom: 0,
    borderRadius: 15,
  },
  chartLabel: {
    marginTop: 8,
    fontSize: 12,
    color: '#666',
  },
  achievementsCard: {
    backgroundColor: '#fff',
    margin: 15,
    marginTop: 0,
    padding: 20,
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
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  achievementItemLocked: {
    opacity: 0.6,
  },
  achievementIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  achievementIconAchieved: {
    backgroundColor: '#e6e9ff',
  },
  achievementIconLocked: {
    backgroundColor: '#f0f0f0',
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  achievementDescription: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  achievementDate: {
    fontSize: 10,
    color: '#999',
    marginTop: 2,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 15,
    marginBottom: 30,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statCardValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  statCardLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
  },
});

export default ProgressScreen;