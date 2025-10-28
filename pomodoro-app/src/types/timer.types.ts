export type TimerStatus = "idle" | "running" | "paused" | "completed";
export type SessionType = "work" | "break";

export interface TimerState {
  status: TimerStatus;
  sessionType: SessionType;
  timeRemaining: number; // seconds
  targetDuration: number; // seconds
  currentSessionId: string | null;
  startedAt: Date | null;
  pausedAt: Date | null;
  totalPausedTime: number; // seconds
}
