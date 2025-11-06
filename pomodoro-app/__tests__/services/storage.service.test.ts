import { storageService } from "../../src/services/storage.service";
import AsyncStorage from "@react-native-async-storage/async-storage";

jest.mock("@react-native-async-storage/async-storage");

describe("storageService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("saveTimerState", () => {
    test("saves timer state successfully", async () => {
      const now = new Date();
      const timerState = {
        status: "running" as const,
        sessionType: "work" as const,
        timeRemaining: 1800,
        targetDuration: 1800,
        currentSessionId: "session-123",
        startedAt: now,
        pausedAt: null,
        totalPausedTime: 0,
      };

      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

      await storageService.saveTimerState(timerState);

      const callArgs = (AsyncStorage.setItem as jest.Mock).mock.calls[0];
      const savedData = JSON.parse(callArgs[1]);
      expect(savedData.status).toBe("running");
      expect(savedData.startedAt).toBe(now.toISOString());
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        "@pomodoro/timer_state",
        expect.any(String)
      );
    });

    test("handles save errors gracefully", async () => {
      const timerState = {
        status: "running",
        sessionType: "work",
        timeRemaining: 1800,
      };

      (AsyncStorage.setItem as jest.Mock).mockRejectedValue(
        new Error("Storage error")
      );

      await expect(
        storageService.saveTimerState(timerState)
      ).resolves.not.toThrow();
    });

    test("serializes Date objects correctly", async () => {
      const timerState = {
        status: "running",
        startedAt: new Date("2024-01-15T10:00:00Z"),
      };

      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

      await storageService.saveTimerState(timerState);

      const callArgs = (AsyncStorage.setItem as jest.Mock).mock.calls[0];
      const savedData = JSON.parse(callArgs[1]);
      expect(savedData.startedAt).toBe("2024-01-15T10:00:00.000Z");
    });
  });

  describe("getTimerState", () => {
    test("retrieves saved timer state", async () => {
      const timerState = {
        status: "running" as const,
        sessionType: "work" as const,
        timeRemaining: 1800,
        targetDuration: 1800,
        currentSessionId: null,
        startedAt: null,
        pausedAt: null,
        totalPausedTime: 0,
      };

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(timerState)
      );

      const result = await storageService.getTimerState();

      expect(result).toEqual(timerState);
      expect(AsyncStorage.getItem).toHaveBeenCalledWith(
        "@pomodoro/timer_state"
      );
    });

    test("returns null when no state exists", async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const result = await storageService.getTimerState();

      expect(result).toBeNull();
    });

    test("handles corrupted data", async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue("invalid json");

      // The function catches errors and returns null
      const result = await storageService.getTimerState();
      expect(result).toBeNull();
    });

    test("handles read errors", async () => {
      (AsyncStorage.getItem as jest.Mock).mockRejectedValue(
        new Error("Read error")
      );

      const result = await storageService.getTimerState();

      expect(result).toBeNull();
    });
  });

  describe("clearTimerState", () => {
    test("clears timer state successfully", async () => {
      (AsyncStorage.removeItem as jest.Mock).mockResolvedValue(undefined);

      await storageService.clearTimerState();

      expect(AsyncStorage.removeItem).toHaveBeenCalledWith(
        "@pomodoro/timer_state"
      );
    });

    test("handles clear errors gracefully", async () => {
      (AsyncStorage.removeItem as jest.Mock).mockRejectedValue(
        new Error("Clear error")
      );

      await expect(storageService.clearTimerState()).resolves.not.toThrow();
    });
  });

  describe("saveThemeMode", () => {
    test("saves theme mode", async () => {
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

      await storageService.saveThemeMode("dark");

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        "@pomodoro/theme_mode",
        "dark"
      );
    });

    test("saves light theme", async () => {
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

      await storageService.saveThemeMode("light");

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        "@pomodoro/theme_mode",
        "light"
      );
    });

    test("handles save errors gracefully", async () => {
      (AsyncStorage.setItem as jest.Mock).mockRejectedValue(
        new Error("Storage error")
      );

      await expect(
        storageService.saveThemeMode("dark")
      ).resolves.not.toThrow();
    });
  });

  describe("getThemeMode", () => {
    test("retrieves saved theme mode", async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue("dark");

      const result = await storageService.getThemeMode();

      expect(result).toBe("dark");
      expect(AsyncStorage.getItem).toHaveBeenCalledWith(
        "@pomodoro/theme_mode"
      );
    });

    test("returns null when no theme exists", async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const result = await storageService.getThemeMode();

      expect(result).toBeNull();
    });

    test("handles read errors", async () => {
      (AsyncStorage.getItem as jest.Mock).mockRejectedValue(
        new Error("Read error")
      );

      const result = await storageService.getThemeMode();

      expect(result).toBeNull();
    });
  });
});

