import { useState, useEffect } from "react";
import { timerService } from "../services/timer.service";
import { useAuth } from "./useAuth";

export interface StatsData {
  todayFocusTime: number;
  todaySessionCount: number;
  last7DaysStats: Array<{
    date: string;
    totalTime: number;
    sessionCount: number;
  }>;
}

export const useStats = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<StatsData>({
    todayFocusTime: 0,
    todaySessionCount: 0,
    last7DaysStats: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const todayFocus = await timerService.getTodaysFocusTime(user.id);
      const todayCount = await timerService.getTodaysSessionCount(user.id);
      const last7Days = await timerService.getStatsForDays(user.id, 7);

      setStats({
        todayFocusTime: todayFocus,
        todaySessionCount: todayCount,
        last7DaysStats: last7Days,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch stats");
      console.error("Error fetching stats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [user]);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  };
};
