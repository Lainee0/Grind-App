// components/WorkoutDetailModal.js
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import {
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export const WorkoutDetailModal = ({ visible, workout, onClose }) => {
  if (!workout) return null;
  
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
    >
      <View style={styles.modalContainer}>
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          style={styles.modalContent}
        >
          <ScrollView>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{workout.name}</Text>
              <TouchableOpacity onPress={onClose}>
                <MaterialIcons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalBody}>
              <View style={styles.infoRow}>
                <MaterialIcons name="timer" size={20} color="#fff" />
                <Text style={styles.infoText}>
                  Duration: {workout.duration || workout.sets}
                </Text>
              </View>
              
              <View style={styles.infoRow}>
                <MaterialIcons name="speed" size={20} color="#fff" />
                <Text style={styles.infoText}>
                  Intensity: {workout.intensity}
                </Text>
              </View>
              
              <View style={styles.infoRow}>
                <MaterialIcons name="fitness-center" size={20} color="#fff" />
                <Text style={styles.infoText}>
                  Benefits: {workout.benefits}
                </Text>
              </View>
              
              {workout.calories && (
                <View style={styles.infoRow}>
                  <MaterialIcons name="whatshot" size={20} color="#fff" />
                  <Text style={styles.infoText}>
                    Calories: {workout.calories} cal
                  </Text>
                </View>
              )}
              
              <View style={styles.tipsContainer}>
                <Text style={styles.tipsTitle}>Safety Tips:</Text>
                <Text style={styles.tipsText}>
                  • Start with 5-10 minutes of warm-up{'\n'}
                  • Stay hydrated throughout{'\n'}
                  • Listen to your body and rest when needed{'\n'}
                  • Consult with healthcare provider before starting
                </Text>
              </View>
            </View>
          </ScrollView>
        </LinearGradient>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    borderRadius: 20,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  modalBody: {
    marginTop: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  infoText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
    flex: 1,
  },
  tipsContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
  },
  tipsTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  tipsText: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 22,
  },
});