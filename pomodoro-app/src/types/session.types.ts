export interface Session {
  id: string;
  user_id: string;
  type: "work" | "break";
  duration: number; // seconds actually focused
  target_duration: number; // target duration in seconds
  started_at: string;
  completed_at: string | null;
  is_completed: boolean;
  paused_time: number; // total paused time in seconds
  created_at: string;
  updated_at: string;
}

export interface SessionCreate {
  user_id: string;
  type: "work" | "break";
  duration: number;
  target_duration: number;
  started_at: string;
  is_completed: boolean;
  paused_time?: number;
}

export interface SessionUpdate {
  duration?: number;
  completed_at?: string;
  is_completed?: boolean;
  paused_time?: number;
}
