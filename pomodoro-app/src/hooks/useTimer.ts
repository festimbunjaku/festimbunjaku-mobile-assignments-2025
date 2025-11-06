import { useState, useEffect, useCallback, useRef } from "react";
import { AppState, AppStateStatus } from "react-native";
import { timerService } from "../services/timer.service";
import { storageService } from "../services/storage.service";
import { meditationService } from "../services/meditation.service";
import { useAuth } from "./useAuth";
import { useSettings } from "../context/SettingsContext";
import { TimerState, SessionType } from "../types";
import { minutesToSeconds } from "../utils";

interface UseTimerOptions {
  workDuration?: number; // minutes
  breakDuration?: number; // minutes
}

export const useTimer = (options: UseTimerOptions = {}) => {
  const { user } = useAuth();
  const { settings } = useSettings();
  const { workDuration = 30, breakDuration = 10 } = options;

  const [timerState, setTimerState] = useState<TimerState>({
    status: "idle",
    sessionType: "work",
    timeRemaining: minutesToSeconds(workDuration),
    targetDuration: minutesToSeconds(workDuration),
    currentSessionId: null,
    startedAt: null,
    pausedAt: null,
    totalPausedTime: 0,
  });

  const appStateRef = useRef<AppStateStatus>("active");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load persisted timer state on mount
  useEffect(() => {
    const loadTimerState = async () => {
      const savedState = await storageService.getTimerState();
      if (savedState) {
        // Recalculate time remaining based on elapsed time
        const elapsedSeconds = Math.floor(
          (Date.now() - new Date(savedState.startedAt).getTime()) / 1000
        );
        const actualElapsed = Math.max(
          0,
          elapsedSeconds - savedState.totalPausedTime
        );
        const timeRemaining = Math.max(
          0,
          savedState.targetDuration - actualElapsed
        );

        setTimerState((prev) => ({
          ...prev,
          ...savedState,
          timeRemaining,
          startedAt: savedState.startedAt
            ? new Date(savedState.startedAt)
            : null,
          pausedAt: savedState.pausedAt ? new Date(savedState.pausedAt) : null,
        }));

        // If timer was running, resume it
        if (savedState.status === "running" && timeRemaining > 0) {
          // startTimer will be called in the next render
        }
      }

      // Register background task
      try {
        const { backgroundService } = await import(
          "../services/background.service"
        );
        await backgroundService.registerBackgroundTask();
      } catch (error) {
        // Background tasks not available
      }
    };

    loadTimerState();

    // Listen to app state changes
    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );
    return () => {
      subscription.remove();
    };
  }, []);

  // Save timer state whenever it changes
  useEffect(() => {
    const saveState = async () => {
      await storageService.saveTimerState({
        ...timerState,
        startedAt: timerState.startedAt?.toISOString(),
        pausedAt: timerState.pausedAt?.toISOString(),
      });
    };

    saveState();
  }, [timerState]);

  // Timer tick effect
  useEffect(() => {
    if (timerState.status === "running" && timerState.timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimerState((prev) => {
          const newTimeRemaining = Math.max(0, prev.timeRemaining - 1);

          // Timer completed
          if (newTimeRemaining === 0) {
            return {
              ...prev,
              status: "completed",
              timeRemaining: newTimeRemaining,
            };
          }

          return { ...prev, timeRemaining: newTimeRemaining };
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timerState.status, timerState.timeRemaining]);

  // Meditation service integration
  useEffect(() => {
    const meditationEnabled = settings?.meditation_enabled ?? false;
    const meditationInterval = settings?.meditation_interval_minutes ?? 5;

    // Only run meditation during work sessions
    if (
      meditationEnabled &&
      timerState.status === "running" &&
      timerState.sessionType === "work"
    ) {
      meditationService.start(meditationInterval);
    } else if (
      timerState.status !== "running" ||
      timerState.sessionType !== "work"
    ) {
      // Stop meditation if timer is not running or not a work session
      meditationService.stop();
    }

    // Update interval if it changes
    if (meditationEnabled) {
      meditationService.updateInterval(meditationInterval);
    }

    return () => {
      // Cleanup on unmount
      meditationService.stop();
    };
  }, [
    timerState.status,
    timerState.sessionType,
    settings?.meditation_enabled,
    settings?.meditation_interval_minutes,
  ]);

  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    appStateRef.current = nextAppState;
  };

  const startTimer = useCallback(async () => {
    if (!user) return;

    const now = new Date();
    const sessionType: SessionType = timerState.sessionType;
    const targetDuration = timerState.targetDuration;

    // Create session in database
    const newSession = await timerService.createSession({
      user_id: user.id,
      type: sessionType,
      duration: 0,
      target_duration: targetDuration,
      started_at: now.toISOString(),
      is_completed: false,
    });

    if (newSession) {
      setTimerState((prev) => ({
        ...prev,
        status: "running",
        startedAt: now,
        currentSessionId: newSession.id,
      }));
    }
  }, [user, timerState.sessionType, timerState.targetDuration]);

  const pauseTimer = useCallback(() => {
    if (timerState.status === "running") {
      const now = new Date();
      setTimerState((prev) => ({
        ...prev,
        status: "paused",
        pausedAt: now,
      }));
      // Pause meditation service when timer pauses
      meditationService.pause();
    }
  }, [timerState.status]);

  const resumeTimer = useCallback(() => {
    if (timerState.status === "paused" && timerState.pausedAt) {
      const now = new Date();
      const pausedDuration = Math.floor(
        (now.getTime() - timerState.pausedAt.getTime()) / 1000
      );

      setTimerState((prev) => ({
        ...prev,
        status: "running",
        totalPausedTime: prev.totalPausedTime + pausedDuration,
        pausedAt: null,
      }));
      // Resume meditation service when timer resumes
      meditationService.resume();
    }
  }, [timerState.status, timerState.pausedAt]);

  const stopTimer = useCallback(async () => {
    if (!timerState.currentSessionId || !user) {
      return;
    }

    const focusedTime = timerState.targetDuration - timerState.timeRemaining;
    const now = new Date();
    const isCompleted = timerState.status === "completed";

    // Update session in database
    const updatedSession = await timerService.updateSession(timerState.currentSessionId, {
      duration: Math.max(0, focusedTime),
      is_completed: isCompleted,
      completed_at: isCompleted ? now.toISOString() : undefined,
    });

    // Session updated or failed

    // Reset meditation service when timer stops
    meditationService.reset();

    // Reset timer
    const nextSessionType: SessionType =
      timerState.sessionType === "work" ? "break" : "work";
    const nextDuration =
      nextSessionType === "work"
        ? minutesToSeconds(workDuration)
        : minutesToSeconds(breakDuration);

    setTimerState({
      status: "idle",
      sessionType: nextSessionType,
      timeRemaining: nextDuration,
      targetDuration: nextDuration,
      currentSessionId: null,
      startedAt: null,
      pausedAt: null,
      totalPausedTime: 0,
    });
  }, [timerState, user, workDuration, breakDuration]);

  const resetTimer = useCallback(() => {
    // Reset meditation service when timer resets
    meditationService.reset();

    const nextSessionType: SessionType =
      timerState.sessionType === "work" ? "break" : "work";
    const nextDuration =
      nextSessionType === "work"
        ? minutesToSeconds(workDuration)
        : minutesToSeconds(breakDuration);

    setTimerState({
      status: "idle",
      sessionType: nextSessionType,
      timeRemaining: nextDuration,
      targetDuration: nextDuration,
      currentSessionId: null,
      startedAt: null,
      pausedAt: null,
      totalPausedTime: 0,
    });
  }, [timerState.sessionType, workDuration, breakDuration]);

  const updateDuration = useCallback(
    (workMin: number, breakMin: number) => {
      const nextDuration =
        timerState.sessionType === "work"
          ? minutesToSeconds(workMin)
          : minutesToSeconds(breakMin);

      setTimerState((prev) => ({
        ...prev,
        targetDuration: nextDuration,
        timeRemaining:
          prev.status === "idle" ? nextDuration : prev.timeRemaining,
      }));
    },
    [timerState.sessionType]
  );

  return {
    timerState,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    resetTimer,
    updateDuration,
  };
};
