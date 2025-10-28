import * as TaskManager from "expo-task-manager";
import * as BackgroundFetch from "expo-background-fetch";
import { storageService } from "./storage.service";
import { timerService } from "./timer.service";

const BACKGROUND_TASK_NAME = "pomodoro-background-timer";

export const backgroundService = {
  // Register background task
  async registerBackgroundTask() {
    try {
      await BackgroundFetch.registerTaskAsync(BACKGROUND_TASK_NAME, {
        minimumInterval: 1, // Check every 1 minute
        stopOnTerminate: false,
        startOnBoot: true,
      });
      console.log("Background task registered");
    } catch (error) {
      console.error("Error registering background task:", error);
    }
  },

  // Unregister background task
  async unregisterBackgroundTask() {
    try {
      await BackgroundFetch.unregisterTaskAsync(BACKGROUND_TASK_NAME);
      console.log("Background task unregistered");
    } catch (error) {
      console.error("Error unregistering background task:", error);
    }
  },

  // Handle background task execution
  async handleBackgroundTask() {
    try {
      const timerState = await storageService.getTimerState();

      if (!timerState || timerState.status !== "running") {
        return BackgroundFetch.BackgroundFetchResult.NoData;
      }

      // Calculate elapsed time
      const now = new Date().getTime();
      const startTime = new Date(timerState.startedAt).getTime();
      const elapsedMs = now - startTime;
      const elapsedSeconds = Math.floor(elapsedMs / 1000);
      const actualElapsed = Math.max(
        0,
        elapsedSeconds - timerState.totalPausedTime
      );

      // Check if timer completed
      if (actualElapsed >= timerState.targetDuration) {
        // Update session as completed
        if (timerState.currentSessionId) {
          await timerService.updateSession(timerState.currentSessionId, {
            duration: timerState.targetDuration,
            is_completed: true,
            completed_at: new Date().toISOString(),
          });
        }

        return BackgroundFetch.BackgroundFetchResult.NewData;
      }

      // Update local timer state
      await storageService.saveTimerState({
        ...timerState,
        timeRemaining: Math.max(0, timerState.targetDuration - actualElapsed),
      });

      return BackgroundFetch.BackgroundFetchResult.NewData;
    } catch (error) {
      console.error("Error in background task:", error);
      return BackgroundFetch.BackgroundFetchResult.Failed;
    }
  },
};

// Define background task
TaskManager.defineTask(BACKGROUND_TASK_NAME, async () => {
  try {
    const result = await backgroundService.handleBackgroundTask();
    return result;
  } catch (error) {
    console.error("Background task error:", error);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});
