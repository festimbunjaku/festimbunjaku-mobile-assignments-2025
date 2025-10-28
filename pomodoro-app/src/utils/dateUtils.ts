import { format, isToday, isYesterday, parseISO } from "date-fns";

/**
 * Format date to readable format
 * e.g., "Today", "Yesterday", "Jan 15, 2024"
 */
export const formatSessionDate = (dateString: string): string => {
  const date = parseISO(dateString);

  if (isToday(date)) {
    return "Today";
  }

  if (isYesterday(date)) {
    return "Yesterday";
  }

  return format(date, "MMM d, yyyy");
};

/**
 * Format time to HH:mm format
 */
export const formatSessionTime = (dateString: string): string => {
  const date = parseISO(dateString);
  return format(date, "HH:mm");
};

/**
 * Group items by date
 */
export const groupByDate = <T extends { started_at: string }>(
  items: T[]
): Record<string, T[]> => {
  return items.reduce((acc, item) => {
    const dateKey = format(parseISO(item.started_at), "yyyy-MM-dd");
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(item);
    return acc;
  }, {} as Record<string, T[]>);
};

/**
 * Get date range for queries
 */
export const getDateRange = (days: number): { start: string; end: string } => {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - days);

  return {
    start: start.toISOString(),
    end: end.toISOString(),
  };
};
