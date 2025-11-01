import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEYS = {
  TIMER_STATE: "@pomodoro/timer_state",
  THEME_MODE: "@pomodoro/theme_mode",
} as const;

export const storageService = {
  // Timer state persistence
  async saveTimerState(state: any): Promise<void> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.TIMER_STATE,
        JSON.stringify(state)
      );
    } catch (error) {
      // Error saving timer state
    }
  },

  async getTimerState(): Promise<any | null> {
    try {
      const state = await AsyncStorage.getItem(STORAGE_KEYS.TIMER_STATE);
      return state ? JSON.parse(state) : null;
    } catch (error) {
      return null;
    }
  },

  async clearTimerState(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.TIMER_STATE);
    } catch (error) {
      // Error clearing timer state
    }
  },

  // Theme persistence
  async saveThemeMode(mode: "light" | "dark"): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.THEME_MODE, mode);
    } catch (error) {
      // Error saving theme mode
    }
  },

  async getThemeMode(): Promise<"light" | "dark" | null> {
    try {
      return (await AsyncStorage.getItem(STORAGE_KEYS.THEME_MODE)) as
        | "light"
        | "dark"
        | null;
    } catch (error) {
      return null;
    }
  },
};
