
/**
 * Utility functions for handling time-related operations
 */

/**
 * Check if current time is within lunch hours (12:00 PM - 3:00 PM)
 * @returns {boolean} - True if current time is lunch time
 */
export const isLunchTime = () => {
  const now = new Date();
  const hours = now.getHours();
  return hours >= 12 && hours < 15;
};

/**
 * Check if current time is within dinner hours (6:30 PM - 9:00 PM)
 * @returns {boolean} - True if current time is dinner time
 */
export const isDinnerTime = () => {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  return (hours > 18 || (hours === 18 && minutes >= 30)) && hours < 23;
};

/**
 * Get current meal time based on current time
 * @returns {string|null} - "lunch", "dinner", or null if not meal time
 */
export const getCurrentMealTime = () => {
  if (isLunchTime()) return "lunch";
  if (isDinnerTime()) return "dinner";
  return null;
};

/**
 * Format time to 12-hour format with AM/PM
 * @param {Date} date - Date object
 * @returns {string} - Formatted time string
 */
export const formatTime = (date) => {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

/**
 * Format date to readable format (e.g., "April 10, 2025")
 * @param {Date|string} date - Date object or date string
 * @returns {string} - Formatted date string
 */
export const formatDateReadable = (date) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Format date to short format (e.g., "Apr 10")
 * @param {Date|string} date - Date object or date string
 * @returns {string} - Formatted date string
 */
export const formatDateShort = (date) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
};

/**
 * Get day name from date
 * @param {Date|string} date - Date object or date string
 * @returns {string} - Day name (e.g., "Monday")
 */
export const getDayName = (date) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('en-US', { weekday: 'long' });
};
