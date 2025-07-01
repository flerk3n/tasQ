import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configure notification handling
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

/**
 * Initialize notification service
 * @returns {Promise<string|null>} - Push token or null
 */
export const initializeNotifications = async () => {
  try {
    // Check if device supports notifications
    if (!Device.isDevice) {
      console.warn('Must use physical device for Push Notifications');
      return null;
    }

    // Get existing permission status
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    // Request permission if not granted
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.warn('Push notification permission denied');
      return null;
    }

    // Get push token
    const projectId = Constants.expoConfig?.extra?.eas?.projectId || Constants.easConfig?.projectId;
    
    if (!projectId) {
      console.warn('Project ID not found for push notifications');
      return null;
    }

    const token = await Notifications.getExpoPushTokenAsync({ projectId });
    console.log('Push notification token:', token.data);

    // Store token locally
    await AsyncStorage.setItem('pushToken', token.data);

    // Configure notification categories
    await setupNotificationCategories();

    return token.data;
  } catch (error) {
    console.error('Error initializing notifications:', error);
    return null;
  }
};

/**
 * Setup notification categories for different types of notifications
 */
const setupNotificationCategories = async () => {
  try {
    await Notifications.setNotificationCategoryAsync('TASK_REMINDER', [
      {
        identifier: 'MARK_COMPLETE',
        buttonTitle: '✅ Mark Complete',
        options: { foreground: true },
      },
      {
        identifier: 'SNOOZE',
        buttonTitle: '⏰ Snooze 10min',
        options: { foreground: false },
      },
    ]);

    await Notifications.setNotificationCategoryAsync('DAILY_SUMMARY', [
      {
        identifier: 'VIEW_TASKS',
        buttonTitle: '📋 View Tasks',
        options: { foreground: true },
      },
    ]);
  } catch (error) {
    console.error('Error setting up notification categories:', error);
  }
};

/**
 * Schedule a local notification for a task reminder
 * @param {Object} task - Task object with title, time, date
 * @returns {Promise<string|null>} - Notification ID or null
 */
export const scheduleTaskReminder = async (task) => {
  try {
    if (!task.time || !task.date) {
      return null; // No time specified
    }

    const notificationDate = parseTaskDateTime(task.date, task.time);
    
    if (!notificationDate || notificationDate <= new Date()) {
      return null; // Invalid date or past date
    }

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: '📋 Task Reminder',
        body: `Time for: ${task.title}`,
        data: {
          taskId: task.id,
          taskTitle: task.title,
          type: 'TASK_REMINDER',
        },
        categoryIdentifier: 'TASK_REMINDER',
        sound: 'default',
      },
      trigger: {
        date: notificationDate,
      },
    });

    // Store notification mapping
    await storeNotificationMapping(task.id, notificationId);

    console.log(`Scheduled notification for task "${task.title}" at ${notificationDate}`);
    return notificationId;
  } catch (error) {
    console.error('Error scheduling task reminder:', error);
    return null;
  }
};

/**
 * Cancel a scheduled notification for a task
 * @param {string} taskId - Task ID
 */
export const cancelTaskReminder = async (taskId) => {
  try {
    const notificationId = await getNotificationIdForTask(taskId);
    if (notificationId) {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
      await removeNotificationMapping(taskId);
      console.log(`Cancelled notification for task ${taskId}`);
    }
  } catch (error) {
    console.error('Error cancelling task reminder:', error);
  }
};

/**
 * Schedule daily summary notification
 * @param {number} hour - Hour (0-23) to send summary
 * @returns {Promise<string|null>} - Notification ID or null
 */
export const scheduleDailySummary = async (hour = 20) => {
  try {
    // Cancel existing daily summary
    await cancelDailySummary();

    // Schedule for today or tomorrow if time has passed
    const now = new Date();
    const summaryTime = new Date();
    summaryTime.setHours(hour, 0, 0, 0);

    if (summaryTime <= now) {
      summaryTime.setDate(summaryTime.getDate() + 1);
    }

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: '📊 Daily Summary',
        body: 'Check your progress and plan for tomorrow!',
        data: {
          type: 'DAILY_SUMMARY',
        },
        categoryIdentifier: 'DAILY_SUMMARY',
        sound: 'default',
      },
      trigger: {
        date: summaryTime,
        repeats: true,
      },
    });

    await AsyncStorage.setItem('dailySummaryNotificationId', notificationId);
    console.log(`Scheduled daily summary at ${summaryTime}`);
    return notificationId;
  } catch (error) {
    console.error('Error scheduling daily summary:', error);
    return null;
  }
};

/**
 * Cancel daily summary notification
 */
export const cancelDailySummary = async () => {
  try {
    const notificationId = await AsyncStorage.getItem('dailySummaryNotificationId');
    if (notificationId) {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
      await AsyncStorage.removeItem('dailySummaryNotificationId');
      console.log('Cancelled daily summary notification');
    }
  } catch (error) {
    console.error('Error cancelling daily summary:', error);
  }
};

/**
 * Handle notification response (when user taps notification)
 * @param {Object} response - Notification response
 * @param {Function} navigation - Navigation object
 */
export const handleNotificationResponse = async (response, navigation) => {
  try {
    const { data, actionIdentifier } = response.notification.request.content;

    switch (actionIdentifier) {
      case 'MARK_COMPLETE':
        if (data.taskId) {
          // You can implement task completion logic here
          console.log(`Marking task ${data.taskId} as complete`);
        }
        break;

      case 'SNOOZE':
        if (data.taskId) {
          // Reschedule notification for 10 minutes later
          await snoozeNotification(data.taskId, data.taskTitle);
        }
        break;

      case 'VIEW_TASKS':
        // Navigate to tasks screen
        navigation?.navigate('Tasks');
        break;

      default:
        // Default tap action
        if (data.type === 'TASK_REMINDER') {
          navigation?.navigate('Tasks');
        } else if (data.type === 'DAILY_SUMMARY') {
          navigation?.navigate('Calendar');
        }
        break;
    }
  } catch (error) {
    console.error('Error handling notification response:', error);
  }
};

/**
 * Snooze a notification by 10 minutes
 * @param {string} taskId - Task ID
 * @param {string} taskTitle - Task title
 */
const snoozeNotification = async (taskId, taskTitle) => {
  try {
    const snoozeTime = new Date();
    snoozeTime.setMinutes(snoozeTime.getMinutes() + 10);

    await Notifications.scheduleNotificationAsync({
      content: {
        title: '📋 Task Reminder (Snoozed)',
        body: `Time for: ${taskTitle}`,
        data: {
          taskId,
          taskTitle,
          type: 'TASK_REMINDER',
        },
        categoryIdentifier: 'TASK_REMINDER',
        sound: 'default',
      },
      trigger: {
        date: snoozeTime,
      },
    });

    console.log(`Snoozed task "${taskTitle}" for 10 minutes`);
  } catch (error) {
    console.error('Error snoozing notification:', error);
  }
};

/**
 * Parse task date and time into a Date object
 * @param {string} dateStr - Date string (e.g., "tomorrow", "Monday")
 * @param {string} timeStr - Time string (e.g., "8pm", "3:30 AM")
 * @returns {Date|null} - Parsed date or null
 */
const parseTaskDateTime = (dateStr, timeStr) => {
  try {
    const today = new Date();
    let targetDate = new Date(today);

    // Parse date
    const lowerDate = dateStr.toLowerCase();
    
    if (lowerDate === 'today') {
      // Keep today
    } else if (lowerDate === 'tomorrow') {
      targetDate.setDate(today.getDate() + 1);
    } else {
      // Try to parse as day of week
      const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      const dayIndex = dayNames.indexOf(lowerDate);
      
      if (dayIndex !== -1) {
        const todayDay = today.getDay();
        const daysUntilTarget = (dayIndex - todayDay + 7) % 7 || 7;
        targetDate.setDate(today.getDate() + daysUntilTarget);
      } else {
        // Try to parse as actual date
        const parsedDate = new Date(dateStr);
        if (!isNaN(parsedDate.getTime())) {
          targetDate = parsedDate;
        }
      }
    }

    // Parse time
    const timeMatch = timeStr.match(/(\d{1,2}):?(\d{0,2})\s*(am|pm)/i);
    if (timeMatch) {
      let hour = parseInt(timeMatch[1]);
      const minute = parseInt(timeMatch[2]) || 0;
      const ampm = timeMatch[3].toLowerCase();

      if (ampm === 'pm' && hour !== 12) {
        hour += 12;
      } else if (ampm === 'am' && hour === 12) {
        hour = 0;
      }

      targetDate.setHours(hour, minute, 0, 0);
    }

    return targetDate;
  } catch (error) {
    console.error('Error parsing task date/time:', error);
    return null;
  }
};

/**
 * Store notification ID mapping for a task
 * @param {string} taskId - Task ID
 * @param {string} notificationId - Notification ID
 */
const storeNotificationMapping = async (taskId, notificationId) => {
  try {
    const mappings = await getNotificationMappings();
    mappings[taskId] = notificationId;
    await AsyncStorage.setItem('notificationMappings', JSON.stringify(mappings));
  } catch (error) {
    console.error('Error storing notification mapping:', error);
  }
};

/**
 * Get notification ID for a task
 * @param {string} taskId - Task ID
 * @returns {Promise<string|null>} - Notification ID or null
 */
const getNotificationIdForTask = async (taskId) => {
  try {
    const mappings = await getNotificationMappings();
    return mappings[taskId] || null;
  } catch (error) {
    console.error('Error getting notification ID:', error);
    return null;
  }
};

/**
 * Remove notification mapping for a task
 * @param {string} taskId - Task ID
 */
const removeNotificationMapping = async (taskId) => {
  try {
    const mappings = await getNotificationMappings();
    delete mappings[taskId];
    await AsyncStorage.setItem('notificationMappings', JSON.stringify(mappings));
  } catch (error) {
    console.error('Error removing notification mapping:', error);
  }
};

/**
 * Get all notification mappings
 * @returns {Promise<Object>} - Notification mappings
 */
const getNotificationMappings = async () => {
  try {
    const mappings = await AsyncStorage.getItem('notificationMappings');
    return mappings ? JSON.parse(mappings) : {};
  } catch (error) {
    console.error('Error getting notification mappings:', error);
    return {};
  }
};

/**
 * Get push notification settings
 * @returns {Promise<Object>} - Notification settings
 */
export const getNotificationSettings = async () => {
  try {
    const settings = await AsyncStorage.getItem('notificationSettings');
    return settings ? JSON.parse(settings) : {
      taskReminders: true,
      dailySummary: true,
      summaryTime: 20, // 8 PM
    };
  } catch (error) {
    console.error('Error getting notification settings:', error);
    return {
      taskReminders: true,
      dailySummary: true,
      summaryTime: 20,
    };
  }
};

/**
 * Update notification settings
 * @param {Object} newSettings - New settings
 */
export const updateNotificationSettings = async (newSettings) => {
  try {
    const currentSettings = await getNotificationSettings();
    const updatedSettings = { ...currentSettings, ...newSettings };
    await AsyncStorage.setItem('notificationSettings', JSON.stringify(updatedSettings));
    
    // Update daily summary if time changed
    if (newSettings.summaryTime !== undefined || newSettings.dailySummary !== undefined) {
      if (updatedSettings.dailySummary) {
        await scheduleDailySummary(updatedSettings.summaryTime);
      } else {
        await cancelDailySummary();
      }
    }
    
    console.log('Updated notification settings:', updatedSettings);
  } catch (error) {
    console.error('Error updating notification settings:', error);
  }
};

export default {
  initializeNotifications,
  scheduleTaskReminder,
  cancelTaskReminder,
  scheduleDailySummary,
  cancelDailySummary,
  handleNotificationResponse,
  getNotificationSettings,
  updateNotificationSettings,
}; 