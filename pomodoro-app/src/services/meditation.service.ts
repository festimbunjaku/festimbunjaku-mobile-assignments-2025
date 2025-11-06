import { soundManager } from "../utils/soundManager";

interface MeditationState {
  isActive: boolean;
  intervalMinutes: number;
  lastReminderTime: number | null; // timestamp in ms
  totalElapsedSinceLastReminder: number; // seconds
  isPaused: boolean;
  pausedAt: number | null; // timestamp in ms
  totalPausedTime: number; // seconds
}

class MeditationService {
  private state: MeditationState = {
    isActive: false,
    intervalMinutes: 5,
    lastReminderTime: null,
    totalElapsedSinceLastReminder: 0,
    isPaused: false,
    pausedAt: null,
    totalPausedTime: 0,
  };

  private intervalRef: NodeJS.Timeout | null = null;

  /**
   * Start meditation reminders
   * @param intervalMinutes - Minutes between reminders
   */
  start(intervalMinutes: number) {
    if (this.intervalRef) {
      this.stop();
    }

    this.state = {
      isActive: true,
      intervalMinutes,
      lastReminderTime: Date.now(),
      totalElapsedSinceLastReminder: 0,
      isPaused: false,
      pausedAt: null,
      totalPausedTime: 0,
    };

    // Check every second if we need to trigger a reminder
    this.intervalRef = setInterval(() => {
      this.checkAndTriggerReminder();
    }, 1000);
  }

  /**
   * Pause meditation reminders
   */
  pause() {
    if (!this.state.isActive || this.state.isPaused) {
      return;
    }

    this.state.isPaused = true;
    this.state.pausedAt = Date.now();
  }

  /**
   * Resume meditation reminders
   */
  resume() {
    if (!this.state.isActive || !this.state.isPaused) {
      return;
    }

    if (this.state.pausedAt) {
      const pausedDuration = Math.floor(
        (Date.now() - this.state.pausedAt) / 1000
      );
      this.state.totalPausedTime += pausedDuration;
    }

    this.state.isPaused = false;
    this.state.pausedAt = null;
  }

  /**
   * Stop and reset meditation reminders
   */
  stop() {
    if (this.intervalRef) {
      clearInterval(this.intervalRef);
      this.intervalRef = null;
    }

    this.state = {
      isActive: false,
      intervalMinutes: this.state.intervalMinutes,
      lastReminderTime: null,
      totalElapsedSinceLastReminder: 0,
      isPaused: false,
      pausedAt: null,
      totalPausedTime: 0,
    };
  }

  /**
   * Reset meditation timer (when Pomodoro session ends)
   */
  reset() {
    this.stop();
  }

  /**
   * Update interval without restarting
   */
  updateInterval(intervalMinutes: number) {
    this.state.intervalMinutes = intervalMinutes;
    // Reset the timer if active
    if (this.state.isActive) {
      this.state.lastReminderTime = Date.now();
      this.state.totalElapsedSinceLastReminder = 0;
      this.state.totalPausedTime = 0;
    }
  }

  /**
   * Check if reminder should be triggered and trigger it
   */
  private checkAndTriggerReminder() {
    if (!this.state.isActive || this.state.isPaused) {
      return;
    }

    // Calculate elapsed time (excluding paused time)
    const now = Date.now();
    if (this.state.lastReminderTime) {
      const elapsedMs = now - this.state.lastReminderTime;
      const elapsedSeconds = Math.floor(elapsedMs / 1000);
      const actualElapsed = Math.max(
        0,
        elapsedSeconds - this.state.totalPausedTime
      );

      this.state.totalElapsedSinceLastReminder = actualElapsed;

      // Check if interval has passed
      const intervalSeconds = this.state.intervalMinutes * 60;
      if (actualElapsed >= intervalSeconds) {
        this.triggerReminder();
        // Reset for next interval
        this.state.lastReminderTime = now;
        this.state.totalElapsedSinceLastReminder = 0;
        this.state.totalPausedTime = 0;
      }
    }
  }

  /**
   * Trigger meditation reminder (play sound)
   */
  private async triggerReminder() {
    try {
      await soundManager.playAlarm();
      // Stop after 2 seconds
      setTimeout(() => {
        soundManager.stopAlarm();
      }, 2000);
    } catch (error) {
      console.error("Error playing meditation reminder:", error);
    }
  }

  /**
   * Get current state (for debugging/testing)
   */
  getState(): MeditationState {
    return { ...this.state };
  }

  /**
   * Reset for testing
   */
  resetForTesting() {
    this.stop();
    this.state = {
      isActive: false,
      intervalMinutes: 5,
      lastReminderTime: null,
      totalElapsedSinceLastReminder: 0,
      isPaused: false,
      pausedAt: null,
      totalPausedTime: 0,
    };
  }
}

export const meditationService = new MeditationService();

