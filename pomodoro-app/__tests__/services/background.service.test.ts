import { backgroundService } from "../../src/services/background.service";
import { storageService } from "../../src/services/storage.service";
import { timerService } from "../../src/services/timer.service";
import * as BackgroundFetch from "expo-background-fetch";

jest.mock("../../src/services/storage.service");
jest.mock("../../src/services/timer.service");
jest.mock("expo-background-fetch");

describe("backgroundService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("registerBackgroundTask", () => {
    test("registers task successfully", async () => {
      (BackgroundFetch.registerTaskAsync as jest.Mock).mockResolvedValue(
        undefined
      );

      await backgroundService.registerBackgroundTask();

      expect(BackgroundFetch.registerTaskAsync).toHaveBeenCalledWith(
        "pomodoro-background-timer",
        {
          minimumInterval: 1,
          stopOnTerminate: false,
          startOnBoot: true,
        }
      );
    });

    test("handles registration failures", async () => {
      (BackgroundFetch.registerTaskAsync as jest.Mock).mockRejectedValue(
        new Error("Registration failed")
      );

      await expect(
        backgroundService.registerBackgroundTask()
      ).resolves.not.toThrow();
    });
  });

  describe("unregisterBackgroundTask", () => {
    test("unregisters task successfully", async () => {
      (BackgroundFetch.unregisterTaskAsync as jest.Mock).mockResolvedValue(
        undefined
      );

      await backgroundService.unregisterBackgroundTask();

      expect(BackgroundFetch.unregisterTaskAsync).toHaveBeenCalledWith(
        "pomodoro-background-timer"
      );
    });

    test("handles unregistration failures", async () => {
      (BackgroundFetch.unregisterTaskAsync as jest.Mock).mockRejectedValue(
        new Error("Unregistration failed")
      );

      await expect(
        backgroundService.unregisterBackgroundTask()
      ).resolves.not.toThrow();
    });
  });

  describe("handleBackgroundTask", () => {
    test("returns NoData when timer not running", async () => {
      (storageService.getTimerState as jest.Mock).mockResolvedValue(null);

      const result = await backgroundService.handleBackgroundTask();

      expect(result).toBe(BackgroundFetch.BackgroundFetchResult.NoData);
    });

    test("returns NoData when timer status is not running", async () => {
      (storageService.getTimerState as jest.Mock).mockResolvedValue({
        status: "idle",
      });

      const result = await backgroundService.handleBackgroundTask();

      expect(result).toBe(BackgroundFetch.BackgroundFetchResult.NoData);
    });

    test("updates timer state when running", async () => {
      const timerState = {
        status: "running",
        startedAt: new Date(Date.now() - 60000).toISOString(),
        targetDuration: 1800,
        totalPausedTime: 0,
        currentSessionId: "session-123",
      };

      (storageService.getTimerState as jest.Mock).mockResolvedValue(timerState);
      (storageService.saveTimerState as jest.Mock).mockResolvedValue(undefined);

      const result = await backgroundService.handleBackgroundTask();

      expect(result).toBe(BackgroundFetch.BackgroundFetchResult.NewData);
      expect(storageService.saveTimerState).toHaveBeenCalled();
    });

    test("marks session complete when timer finished", async () => {
      const timerState = {
        status: "running",
        startedAt: new Date(Date.now() - 2000000).toISOString(),
        targetDuration: 1800,
        totalPausedTime: 0,
        currentSessionId: "session-123",
      };

      (storageService.getTimerState as jest.Mock).mockResolvedValue(timerState);
      (timerService.updateSession as jest.Mock).mockResolvedValue({});

      const result = await backgroundService.handleBackgroundTask();

      expect(result).toBe(BackgroundFetch.BackgroundFetchResult.NewData);
      expect(timerService.updateSession).toHaveBeenCalledWith(
        "session-123",
        expect.objectContaining({
          is_completed: true,
        })
      );
    });

    test("returns Failed on error", async () => {
      (storageService.getTimerState as jest.Mock).mockRejectedValue(
        new Error("Error")
      );

      const result = await backgroundService.handleBackgroundTask();

      expect(result).toBe(BackgroundFetch.BackgroundFetchResult.Failed);
    });
  });
});

