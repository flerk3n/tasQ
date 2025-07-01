import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../services/firebase';
import { getTimeString, getHumanReadableDate, getTimeBasedGreeting } from '../utils/dateUtils';
import { scheduleTaskReminder, cancelTaskReminder, getNotificationSettings } from '../services/notificationService';
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  query,
  where,
  onSnapshot,
  orderBy,
} from 'firebase/firestore';

const { width, height } = Dimensions.get('window');

const TaskScreen = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [showAddInput, setShowAddInput] = useState(false);
  const [newTaskText, setNewTaskText] = useState('');

  // Get current date and time using utility functions
  const now = new Date();
  const timeString = getTimeString(now);
  const dateString = getHumanReadableDate(now);
  const greeting = getTimeBasedGreeting();

  // Get user's first name
  const userName = user?.displayName?.split(' ')[0] || 'User';

  useEffect(() => {
    if (!user) return;

    console.log('📊 Setting up task listener for user:', user.uid);
    
    const today = new Date().toISOString().split('T')[0];
    console.log('📊 Today date:', today);
    
    const tasksRef = collection(db, 'tasks');
    
    // Simplified query without orderBy to avoid composite index requirement
    // TODO: Add composite index for (userId, date, createdAt) to enable sorting
    const q = query(
      tasksRef,
      where('userId', '==', user.uid),
      where('date', '==', today)
      // orderBy('createdAt', 'desc') // Commented out - requires composite index
    );

    console.log('📊 Setting up onSnapshot listener...');

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        console.log('📊 Query result - docs count:', snapshot.docs.length);
        
        const tasksData = snapshot.docs.map((doc) => {
          const data = doc.data();
          console.log('📊 Task doc:', { id: doc.id, ...data });
          return {
            id: doc.id,
            ...data,
          };
        });
        
        // Sort manually on client side for now
        tasksData.sort((a, b) => {
          const aTime = a.createdAt?.toDate?.() || new Date(a.createdAt);
          const bTime = b.createdAt?.toDate?.() || new Date(b.createdAt);
          return bTime - aTime; // desc order
        });
        
        console.log('📊 Setting tasks state:', tasksData);
        setTasks(tasksData);
      },
      (error) => {
        console.error('❌ Query error:', error);
        console.error('❌ Error code:', error.code);
        console.error('❌ Error message:', error.message);
        
        if (error.code === 'failed-precondition') {
          console.error('❌ This might be a missing index error');
          Alert.alert(
            'Index Required', 
            'Firestore needs an index for this query. Check the browser console for the index creation link.'
          );
        }
      }
    );

    return unsubscribe;
  }, [user]);

  const toggleTask = async (taskId, currentStatus, task) => {
    try {
      const taskRef = doc(db, 'tasks', taskId);
      const isCompleting = !currentStatus;
      
      await updateDoc(taskRef, {
        isComplete: isCompleting,
        completedAt: isCompleting ? new Date() : null,
      });

      // Cancel notification if task is completed
      if (isCompleting && task.time) {
        await cancelTaskReminder(taskId);
      }
      // Reschedule notification if task is marked incomplete again
      else if (!isCompleting && task.time) {
        const notificationSettings = await getNotificationSettings();
        if (notificationSettings.taskReminders) {
          await scheduleTaskReminder({
            id: taskId,
            title: task.title,
            time: task.time,
            date: task.date,
          });
        }
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const addTask = async () => {
    if (!newTaskText.trim()) {
      Alert.alert('Error', 'Please enter a task');
      return;
    }

    try {
      console.log('📝 Creating task with user:', user?.uid, user?.email);
      
      const today = new Date().toISOString().split('T')[0];
      const taskData = {
        title: newTaskText.trim(),
        isComplete: false,
        date: today,
        userId: user.uid,
        createdAt: new Date(),
      };
      
      console.log('📝 Task data:', taskData);
      
      await addDoc(collection(db, 'tasks'), taskData);
      
      console.log('✅ Task created successfully');
      setNewTaskText('');
      setShowAddInput(false);
    } catch (error) {
      console.error('❌ Error adding task:', error);
      console.error('❌ Error code:', error.code);
      console.error('❌ Error message:', error.message);
      console.error('❌ User info:', { uid: user?.uid, email: user?.email });
      
      if (error.code === 'permission-denied') {
        Alert.alert(
          'Permission Denied', 
          'Please check Firestore security rules. Go to Firebase Console → Firestore → Rules and update them.'
        );
      } else if (error.message.includes('blocked')) {
        Alert.alert(
          'Request Blocked', 
          'Ad blocker might be interfering. Try disabling ad blockers or use incognito mode.'
        );
      } else {
        Alert.alert('Error', `Failed to add task: ${error.message}`);
      }
    }
  };

  const renderTask = (task, index) => (
    <Animatable.View
      key={task.id}
      animation="fadeInUp"
      delay={index * 100}
      style={styles.taskItem}
    >
      <TouchableOpacity
        style={styles.taskRow}
        onPress={() => toggleTask(task.id, task.isComplete, task)}
        activeOpacity={0.7}
      >
        <View style={styles.checkbox}>
          {task.isComplete && (
            <Ionicons name="checkmark" size={20} color="#fff" />
          )}
        </View>
        <Text
          style={[
            styles.taskText,
            task.isComplete && styles.completedTaskText,
          ]}
        >
          {task.title}
        </Text>
      </TouchableOpacity>
    </Animatable.View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.time}>{`${dateString}  ${timeString}`}</Text>
        <Text style={styles.greeting}>{greeting}</Text>
        <Text style={styles.userName}>{userName} !</Text>
      </View>

      <View style={styles.tasksContainer}>
        <View style={styles.tasksHeader}>
          <Text style={styles.tasksTitle}>Tasks for the day</Text>
          <View style={styles.divider} />
        </View>

        <ScrollView style={styles.tasksList} showsVerticalScrollIndicator={false}>
          {tasks.map((task, index) => renderTask(task, index))}

          {showAddInput ? (
            <View style={styles.addInputContainer}>
              <TextInput
                style={styles.addInput}
                placeholder="Enter new task..."
                placeholderTextColor="#666"
                value={newTaskText}
                onChangeText={setNewTaskText}
                autoFocus
                onSubmitEditing={addTask}
                returnKeyType="done"
              />
              <TouchableOpacity onPress={addTask} style={styles.addButton}>
                <Ionicons name="checkmark" size={20} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setShowAddInput(false);
                  setNewTaskText('');
                }}
                style={styles.cancelButton}
              >
                <Ionicons name="close" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.addMoreButton}
              onPress={() => setShowAddInput(true)}
              activeOpacity={0.7}
            >
              <Ionicons name="add" size={20} color="#fff" />
              <Text style={styles.addMoreText}>add more..</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: height * 0.06,
  },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 30,
  },
  time: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '300',
    marginBottom: 10,
  },
  greeting: {
    fontSize: 24,
    color: '#fff',
    fontWeight: '300',
  },
  userName: {
    fontSize: 32,
    color: '#fff',
    fontWeight: 'bold',
  },
  tasksContainer: {
    flex: 1,
    marginHorizontal: 24,
    marginTop: 20,
  },
  tasksHeader: {
    marginBottom: 20,
  },
  tasksTitle: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '600',
    marginBottom: 10,
  },
  divider: {
    height: 1,
    backgroundColor: '#333',
    width: '100%',
  },
  tasksList: {
    flex: 1,
  },
  taskItem: {
    marginVertical: 5,
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#fff',
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  taskText: {
    fontSize: 16,
    color: '#fff',
    flex: 1,
  },
  completedTaskText: {
    textDecorationLine: 'line-through',
    color: '#666',
  },
  addMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 10,
  },
  addMoreText: {
    fontSize: 16,
    color: '#fff',
    marginLeft: 15,
  },
  addInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingVertical: 8,
  },
  addInput: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    paddingBottom: 5,
    marginRight: 10,
  },
  addButton: {
    padding: 8,
    marginHorizontal: 5,
  },
  cancelButton: {
    padding: 8,
    marginHorizontal: 5,
  },
});

export default TaskScreen; 