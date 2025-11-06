import { meditationService } from "../../src/services/meditation.service";
import { soundManager } from "../../src/utils/soundManager";

jest.mock("../../src/utils/soundManager");

describe("meditationService", () => {
  beforeEach(() => {
    meditationService.resetForTesting();
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe("start", () => {
    test("starts meditation service with given interval", () => {
      meditationService.start(5);

      const state = meditationService.getState();
      expect(state.isActive).toBe(true);
      expect(state.intervalMinutes).toBe(5);
      expect(state.lastReminderTime).not.toBeNull();
    });

    test("stops previous instance if already running", () => {
      meditationService.start(3);
      meditationService.start(5);

      const state = meditationService.getState();
      expect(state.intervalMinutes).toBe(5);
    });
  });

  describe("pause", () => {
    test("pauses meditation service when active", () => {
      meditationService.start(5);
      meditationService.pause();

      const state = meditationService.getState();
      expect(state.isPaused).toBe(true);
      expect(state.pausedAt).not.toBeNull();
    });

    test("does nothing if not active", () => {
      meditationService.pause();

      const state = meditationService.getState();
      expect(state.isPaused).toBe(false);
    });

    test("does nothing if already paused", () => {
      meditationService.start(5);
      meditationService.pause();
      const firstPausedAt = meditationService.getState().pausedAt;

      meditationService.pause();
      const state = meditationService.getState();
      expect(state.pausedAt).toBe(firstPausedAt);
    });
  });

  describe("resume", () => {
    test("resumes meditation service when paused", () => {
      meditationService.start(5);
      meditationService.pause();
      meditationService.resume();

      const state = meditationService.getState();
      expect(state.isPaused).toBe(false);
      expect(state.pausedAt).toBeNull();
    });

    test("tracks paused time correctly", () => {
      meditationService.start(5);
      meditationService.pause();

      // Advance time by 10 seconds
      jest.advanceTimersByTime(10000);

      meditationService.resume();
      const state = meditationService.getState();
      expect(state.totalPausedTime).toBeGreaterThan(0);
    });

    test("does nothing if not paused", () => {
      meditationService.start(5);
      meditationService.resume();

      const state = meditationService.getState();
      expect(state.isPaused).toBe(false);
    });
  });

  describe("stop", () => {
    test("stops and resets meditation service", () => {
      meditationService.start(5);
      meditationService.stop();

      const state = meditationService.getState();
      expect(state.isActive).toBe(false);
      expect(state.lastReminderTime).toBeNull();
      expect(state.totalElapsedSinceLastReminder).toBe(0);
    });

    test("clears interval when stopped", () => {
      meditationService.start(5);
      meditationService.stop();

      // Advance time - should not trigger reminder
      jest.advanceTimersByTime(300000); // 5 minutes

      expect(soundManager.playAlarm).not.toHaveBeenCalled();
    });
  });

  describe("reset", () => {
    test("resets meditation service", () => {
      meditationService.start(5);
      meditationService.reset();

      const state = meditationService.getState();
      expect(state.isActive).toBe(false);
    });
  });

  describe("updateInterval", () => {
    test("updates interval without restarting", () => {
      meditationService.start(5);
      meditationService.updateInterval(10);

      const state = meditationService.getState();
      expect(state.intervalMinutes).toBe(10);
      expect(state.isActive).toBe(true);
    });

    test("resets timer state when updating interval", () => {
      meditationService.start(5);
      meditationService.updateInterval(10);

      const state = meditationService.getState();
      expect(state.totalElapsedSinceLastReminder).toBe(0);
      expect(state.totalPausedTime).toBe(0);
    });
  });

  describe("reminder triggering", () => {
    test("triggers reminder after interval", async () => {
      (soundManager.playAlarm as jest.Mock).mockResolvedValue(undefined);
      (soundManager.stopAlarm as jest.Mock).mockResolvedValue(undefined);

      meditationService.start(1); // 1 minute interval

      // Advance time by 1 minute
      jest.advanceTimersByTime(60000);

      // Wait for async operations
      await Promise.resolve();

      expect(soundManager.playAlarm).toHaveBeenCalled();
    });

    test("does not trigger reminder before interval", async () => {
      meditationService.start(5); // 5 minute interval

      // Advance time by 2 minutes (less than interval)
      jest.advanceTimersByTime(120000);

      await Promise.resolve();

      expect(soundManager.playAlarm).not.toHaveBeenCalled();
    });

    test("does not trigger reminder when paused", async () => {
      meditationService.start(1);
      meditationService.pause();

      // Advance time by 1 minute
      jest.advanceTimersByTime(60000);

      await Promise.resolve();

      expect(soundManager.playAlarm).not.toHaveBeenCalled();
    });

    test("resets timer after triggering reminder", async () => {
      (soundManager.playAlarm as jest.Mock).mockResolvedValue(undefined);
      (soundManager.stopAlarm as jest.Mock).mockResolvedValue(undefined);

      meditationService.start(1);

      // Advance time by 1 minute to trigger first reminder
      jest.advanceTimersByTime(60000);
      await Promise.resolve();

      // Verify first reminder was triggered
      expect(soundManager.playAlarm).toHaveBeenCalledTimes(1);

      // Clear mocks to test second reminder
      jest.clearAllMocks();

      // Advance time by another minute to trigger second reminder
      jest.advanceTimersByTime(60000);
      await Promise.resolve();

      // Verify second reminder was triggered
      expect(soundManager.playAlarm).toHaveBeenCalledTimes(1);
    });

    test("accounts for paused time when calculating interval", async () => {
      (soundManager.playAlarm as jest.Mock).mockResolvedValue(undefined);
      (soundManager.stopAlarm as jest.Mock).mockResolvedValue(undefined);

      meditationService.start(1); // 1 minute interval

      // Advance 30 seconds
      jest.advanceTimersByTime(30000);

      // Pause for 30 seconds
      meditationService.pause();
      jest.advanceTimersByTime(30000);
      meditationService.resume();

      // Advance another 30 seconds (total active time: 60 seconds)
      jest.advanceTimersByTime(30000);

      await Promise.resolve();

      expect(soundManager.playAlarm).toHaveBeenCalled();
    });
  });

  describe("getState", () => {
    test("returns current state", () => {
      meditationService.start(5);
      const state = meditationService.getState();

      expect(state).toHaveProperty("isActive");
      expect(state).toHaveProperty("intervalMinutes");
      expect(state).toHaveProperty("lastReminderTime");
    });

    test("returns a copy of state", () => {
      meditationService.start(5);
      const state1 = meditationService.getState();
      const state2 = meditationService.getState();

      expect(state1).not.toBe(state2);
      expect(state1).toEqual(state2);
    });
  });
});

