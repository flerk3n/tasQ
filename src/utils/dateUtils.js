/**
 * Date utility functions for the tasQ app
 */

/**
 * Get greeting based on current time
 * @returns {string} - "Good Morning", "Good Afternoon", or "Good Evening"
 */
export const getTimeBasedGreeting = () => {
  const hour = new Date().getHours();
  
  if (hour < 12) {
    return 'Good Morning';
  } else if (hour < 17) {
    return 'Good Afternoon';
  } else {
    return 'Good Evening';
  }
};

/**
 * Format date to YYYY-MM-DD string
 * @param {Date} date - Date object
 * @returns {string} - Formatted date string
 */
export const formatDateToString = (date) => {
  return date.toISOString().split('T')[0];
};

/**
 * Get human readable date string
 * @param {Date} date - Date object
 * @returns {string} - Formatted date like "Tuesday, 3 July"
 */
export const getHumanReadableDate = (date) => {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
};

/**
 * Get time string in 12-hour format
 * @param {Date} date - Date object
 * @returns {string} - Formatted time like "9:00 AM"
 */
export const getTimeString = (date) => {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

/**
 * Get start of week date (Monday)
 * @param {Date} date - Date object
 * @returns {Date} - Start of week date
 */
export const getStartOfWeek = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  return new Date(d.setDate(diff));
};

/**
 * Get array of dates for the week
 * @param {Date} startDate - Start of week date
 * @returns {Array<Date>} - Array of 7 dates
 */
export const getWeekDates = (startDate) => {
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    dates.push(date);
  }
  return dates;
};

/**
 * Check if two dates are the same day
 * @param {Date} date1 - First date
 * @param {Date} date2 - Second date
 * @returns {boolean} - True if same day
 */
export const isSameDay = (date1, date2) => {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
};

/**
 * Get relative date string
 * @param {Date} date - Date object
 * @returns {string} - "Today", "Tomorrow", "Yesterday", or date string
 */
export const getRelativeDateString = (date) => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  if (isSameDay(date, today)) {
    return 'Today';
  } else if (isSameDay(date, tomorrow)) {
    return 'Tomorrow';
  } else if (isSameDay(date, yesterday)) {
    return 'Yesterday';
  } else {
    return getHumanReadableDate(date);
  }
}; 