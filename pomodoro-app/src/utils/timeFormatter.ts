/**
 * Format seconds to MM:SS format
 */
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
};

/**
 * Convert minutes to seconds
 */
export const minutesToSeconds = (minutes: number): number => {
  return minutes * 60;
};

/**
 * Convert seconds to minutes
 */
export const secondsToMinutes = (seconds: number): number => {
  return Math.floor(seconds / 60);
};

/**
 * Format duration in seconds to human-readable format
 * e.g., "45 min", "1h 30min"
 */
export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return minutes > 0 ? `${hours}h ${minutes}min` : `${hours}h`;
  }
  return `${minutes}min`;
};

/**
 * Calculate elapsed time between two dates in seconds
 */
export const calculateElapsedTime = (
  startDate: Date,
  endDate: Date = new Date()
): number => {
  return Math.floor((endDate.getTime() - startDate.getTime()) / 1000);
};
