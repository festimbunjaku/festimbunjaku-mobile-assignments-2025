import AsyncStorage from "@react-native-async-storage/async-storage";
import { TimerState } from "../types";

// Extended timer state for storage (includes serialized dates)
type StoredTimerState = Omit<TimerState, "startedAt" | "pausedAt"> & {
  startedAt: string | null;
  pausedAt: string | null;
};

const STORAGE_KEYS = {
  TIMER_STATE: "@pomodoro/timer_state",
  THEME_MODE: "@pomodoro/theme_mode",
} as const;

export const storageService = {
  // Timer state persistence
  async saveTimerState(state: TimerState): Promise<void> {
    try {
      // Serialize Date objects to ISO strings for storage
      const serializedState: StoredTimerState = {
        ...state,
        startedAt: state.startedAt
          ? state.startedAt instanceof Date
            ? state.startedAt.toISOString()
            : typeof state.startedAt === "string"
            ? state.startedAt
            : null
          : null,
        pausedAt: state.pausedAt
          ? state.pausedAt instanceof Date
            ? state.pausedAt.toISOString()
            : typeof state.pausedAt === "string"
            ? state.pausedAt
            : null
          : null,
      };
      await AsyncStorage.setItem(
        STORAGE_KEYS.TIMER_STATE,
        JSON.stringify(serializedState)
      );
    } catch (error) {
      console.error("Error saving timer state:", error);
      // Optionally: Send to error tracking service (Sentry, etc.)
    }
  },

  async getTimerState(): Promise<TimerState | null> {
    try {
      const state = await AsyncStorage.getItem(STORAGE_KEYS.TIMER_STATE);
      if (!state) return null;

      const parsed: Partial<StoredTimerState> = JSON.parse(state);
      // Deserialize ISO strings back to Date objects
      return {
        status: parsed.status || "idle",
        sessionType: parsed.sessionType || "work",
        timeRemaining: parsed.timeRemaining ?? 0,
        targetDuration: parsed.targetDuration ?? 0,
        currentSessionId: parsed.currentSessionId ?? null,
        startedAt: parsed.startedAt ? new Date(parsed.startedAt) : null,
        pausedAt: parsed.pausedAt ? new Date(parsed.pausedAt) : null,
        totalPausedTime: parsed.totalPausedTime ?? 0,
      };
    } catch (error) {
      console.error("Error getting timer state:", error);
      return null;
    }
  },

  async clearTimerState(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.TIMER_STATE);
    } catch (error) {
      console.error("Error clearing timer state:", error);
      // Optionally: Send to error tracking service
    }
  },

  // Theme persistence
  async saveThemeMode(mode: "light" | "dark"): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.THEME_MODE, mode);
    } catch (error) {
      console.error("Error saving theme mode:", error);
      // Optionally: Send to error tracking service
    }
  },

  async getThemeMode(): Promise<"light" | "dark" | null> {
    try {
      return (await AsyncStorage.getItem(STORAGE_KEYS.THEME_MODE)) as
        | "light"
        | "dark"
        | null;
    } catch (error) {
      console.error("Error getting theme mode:", error);
      return null;
    }
  },
};
