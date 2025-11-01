import { supabase } from "./supabase";
import { storageService } from "./storage.service";
import { Session, SessionCreate, SessionUpdate } from "../types";

export const timerService = {
  // Create a new session
  async createSession(session: SessionCreate): Promise<Session | null> {
    try {
      const { data, error } = await supabase
        .from("sessions")
        .insert([session])
        .select()
        .single();

      if (error) {
        console.error("Error creating session:", error);
        return null;
      }

      return data;
    } catch (error) {
      console.error("Error creating session:", error);
      return null;
    }
  },

  // Update a session
  async updateSession(
    sessionId: string,
    updates: SessionUpdate
  ): Promise<Session | null> {
    try {
      const { data, error } = await supabase
        .from("sessions")
        .update(updates)
        .eq("id", sessionId)
        .select()
        .single();

      if (error) {
        console.error("Error updating session:", error);
        return null;
      }

      return data;
    } catch (error) {
      console.error("Error updating session:", error);
      return null;
    }
  },

  // Get today's sessions
  async getTodaysSessions(userId: string): Promise<Session[]> {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { data, error } = await supabase
        .from("sessions")
        .select("*")
        .eq("user_id", userId)
        .gte("started_at", today.toISOString())
        .order("started_at", { ascending: false });

      if (error) {
        console.error("Error fetching today's sessions:", error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error("Error fetching today's sessions:", error);
      return [];
    }
  },

  // Get sessions for a date range
  async getSessionsInRange(
    userId: string,
    startDate: Date,
    endDate: Date
  ): Promise<Session[]> {
    try {
      const { data, error } = await supabase
        .from("sessions")
        .select("*")
        .eq("user_id", userId)
        .gte("started_at", startDate.toISOString())
        .lte("started_at", endDate.toISOString())
        .order("started_at", { ascending: false });

      if (error) {
        console.error("Error fetching sessions in range:", error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error("Error fetching sessions in range:", error);
      return [];
    }
  },

  // Get total focus time for today
  async getTodaysFocusTime(userId: string): Promise<number> {
    try {
      // Use UTC to avoid timezone issues - get start of today in UTC
      const now = new Date();
      const todayStartUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0, 0));
      const todayEndUTC = new Date(todayStartUTC);
      todayEndUTC.setUTCDate(todayEndUTC.getUTCDate() + 1);

      // Get all work sessions for today (both completed and incomplete, but with duration > 0)
      const { data, error } = await supabase
        .from("sessions")
        .select("duration, started_at, is_completed, type")
        .eq("user_id", userId)
        .eq("type", "work")
        .gte("started_at", todayStartUTC.toISOString())
        .lt("started_at", todayEndUTC.toISOString())
        .gt("duration", 0); // Only count sessions with actual focus time

      if (error) {
        console.error("Error fetching today's focus time:", error);
        return 0;
      }

      const total = data?.reduce((sum, session) => {
        return sum + (session.duration || 0);
      }, 0) || 0;

      return total;
    } catch (error) {
      console.error("Error fetching today's focus time:", error);
      return 0;
    }
  },

  // Get completed sessions count for today
  async getTodaysSessionCount(userId: string): Promise<number> {
    try {
      // Use UTC to avoid timezone issues - get start of today in UTC
      const now = new Date();
      const todayStartUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0, 0));
      const todayEndUTC = new Date(todayStartUTC);
      todayEndUTC.setUTCDate(todayEndUTC.getUTCDate() + 1);

      // Count all work sessions with duration > 0 (both completed and in-progress)
      const { data, error, count } = await supabase
        .from("sessions")
        .select("id, started_at, is_completed, type, duration", { count: "exact" })
        .eq("user_id", userId)
        .eq("type", "work")
        .gte("started_at", todayStartUTC.toISOString())
        .lt("started_at", todayEndUTC.toISOString())
        .gt("duration", 0); // Only count sessions with actual focus time

      if (error) {
        console.error("Error fetching today's session count:", error);
        return 0;
      }

      return count || data?.length || 0;
    } catch (error) {
      console.error("Error fetching today's session count:", error);
      return 0;
    }
  },

  // Delete a session
  async deleteSession(sessionId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("sessions")
        .delete()
        .eq("id", sessionId);

      if (error) {
        console.error("Error deleting session:", error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error deleting session:", error);
      return false;
    }
  },

  // Get stats for last N days for graphs
  async getStatsForDays(
    userId: string,
    days: number
  ): Promise<
    Array<{
      date: string;
      totalTime: number;
      sessionCount: number;
    }>
  > {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const { data, error } = await supabase
        .from("sessions")
        .select("started_at, duration, type")
        .eq("user_id", userId)
        .eq("type", "work")
        .gt("duration", 0) // Include sessions with actual focus time, not just completed
        .gte("started_at", startDate.toISOString())
        .order("started_at", { ascending: true });

      if (error) {
        console.error("Error fetching stats:", error);
        return [];
      }

      // Group by date
      const stats: {
        [key: string]: { totalTime: number; sessionCount: number };
      } = {};

      data?.forEach((session: any) => {
        const date = new Date(session.started_at).toISOString().split("T")[0];
        if (!stats[date]) {
          stats[date] = { totalTime: 0, sessionCount: 0 };
        }
        stats[date].totalTime += session.duration;
        stats[date].sessionCount += 1;
      });

      // Convert to array
      return Object.entries(stats).map(
        ([date, { totalTime, sessionCount }]) => ({
          date,
          totalTime,
          sessionCount,
        })
      );
    } catch (error) {
      console.error("Error fetching stats for days:", error);
      return [];
    }
  },
};
