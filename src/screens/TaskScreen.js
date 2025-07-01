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

    const today = new Date().toISOString().split('T')[0];
    const tasksRef = collection(db, 'tasks');
    const q = query(
      tasksRef,
      where('userId', '==', user.uid),
      where('date', '==', today),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasksData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasks(tasksData);
    });

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
      const today = new Date().toISOString().split('T')[0];
      await addDoc(collection(db, 'tasks'), {
        title: newTaskText.trim(),
        isComplete: false,
        date: today,
        userId: user.uid,
        createdAt: new Date(),
      });
      setNewTaskText('');
      setShowAddInput(false);
    } catch (error) {
      console.error('Error adding task:', error);
      Alert.alert('Error', 'Failed to add task');
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