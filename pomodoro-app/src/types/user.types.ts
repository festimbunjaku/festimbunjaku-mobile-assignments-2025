export interface Profile {
  id: string;
  email: string;
  profile_picture_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProfileUpdate {
  profile_picture_url?: string | null;
}

export interface Settings {
  id: string;
  user_id: string;
  work_duration: number; // minutes
  break_duration: number; // minutes
  alarm_sound_enabled: boolean;
  dark_mode_enabled: boolean;
  meditation_enabled: boolean;
  meditation_interval_minutes: number; // minutes between meditation reminders
  created_at: string;
  updated_at: string;
}

export interface SettingsUpdate {
  work_duration?: number;
  break_duration?: number;
  alarm_sound_enabled?: boolean;
  dark_mode_enabled?: boolean;
  meditation_enabled?: boolean;
  meditation_interval_minutes?: number;
}
