import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../services/supabase";
import { useAuth } from "../hooks/useAuth";
import { Settings, SettingsUpdate } from "../types";
import { DEFAULT_SETTINGS } from "../constants/defaults";

interface SettingsContextType {
  settings: Settings | null;
  loading: boolean;
  updateWorkDuration: (minutes: number) => Promise<void>;
  updateBreakDuration: (minutes: number) => Promise<void>;
  updateAlarmEnabled: (enabled: boolean) => Promise<void>;
  updateDarkMode: (enabled: boolean) => Promise<void>;
  updateMeditationEnabled: (enabled: boolean) => Promise<void>;
  updateMeditationInterval: (minutes: number) => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);

  // Helper function to create default settings
  const createDefaultSettings = async (userId: string) => {
    try {
      const defaultSettings = {
        user_id: userId,
        work_duration: DEFAULT_SETTINGS.WORK_DURATION,
        break_duration: DEFAULT_SETTINGS.BREAK_DURATION,
        alarm_sound_enabled: DEFAULT_SETTINGS.ALARM_SOUND_ENABLED,
        dark_mode_enabled: DEFAULT_SETTINGS.DARK_MODE_ENABLED,
        meditation_enabled: false,
        meditation_interval_minutes: 5,
      };

      const { data: newSettings, error: insertError } = await supabase
        .from("settings")
        .insert(defaultSettings)
        .select()
        .single();

      if (insertError) {
        console.error("Error creating default settings:", insertError);
        setSettings(null);
      } else {
        setSettings(newSettings);
      }
    } catch (createError) {
      console.error("Error creating default settings:", createError);
      setSettings(null);
    }
  };

  // Load settings on mount and when user changes
  useEffect(() => {
    const loadSettings = async () => {
      if (!user) {
        // Clear settings when user logs out
        setSettings(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // Use regular select instead of maybeSingle to avoid 406 errors
        const { data, error } = await supabase
          .from("settings")
          .select("*")
          .eq("user_id", user.id)
          .limit(1);

        if (error) {
          console.error("Error loading settings:", error);
          setSettings(null);
        } else if (!data || data.length === 0) {
          // No settings exist, create default settings
          await createDefaultSettings(user.id);
        } else {
          setSettings(data[0]);
        }
      } catch (error) {
        console.error("Error loading settings:", error);
        setSettings(null);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, [user]);

  const updateWorkDuration = async (minutes: number) => {
    if (!user || !settings) return;

    try {
      const { error } = await supabase
        .from("settings")
        .update({ work_duration: minutes })
        .eq("user_id", user.id);

      if (error) throw error;

      setSettings({ ...settings, work_duration: minutes });
    } catch (error) {
      console.error("Error updating work duration:", error);
      // Optionally: Send to error tracking service
    }
  };

  const updateBreakDuration = async (minutes: number) => {
    if (!user || !settings) return;

    try {
      const { error } = await supabase
        .from("settings")
        .update({ break_duration: minutes })
        .eq("user_id", user.id);

      if (error) throw error;

      setSettings({ ...settings, break_duration: minutes });
    } catch (error) {
      console.error("Error updating break duration:", error);
      // Optionally: Send to error tracking service
    }
  };

  const updateAlarmEnabled = async (enabled: boolean) => {
    if (!user || !settings) return;

    try {
      const { error } = await supabase
        .from("settings")
        .update({ alarm_sound_enabled: enabled })
        .eq("user_id", user.id);

      if (error) throw error;

      setSettings({ ...settings, alarm_sound_enabled: enabled });
    } catch (error) {
      console.error("Error updating alarm setting:", error);
      // Optionally: Send to error tracking service
    }
  };

  const updateDarkMode = async (enabled: boolean) => {
    if (!user || !settings) return;

    try {
      const { error } = await supabase
        .from("settings")
        .update({ dark_mode_enabled: enabled })
        .eq("user_id", user.id);

      if (error) throw error;

      setSettings({ ...settings, dark_mode_enabled: enabled });
    } catch (error) {
      console.error("Error updating dark mode:", error);
      // Optionally: Send to error tracking service
    }
  };

  const updateMeditationEnabled = async (enabled: boolean) => {
    if (!user || !settings) return;

    try {
      const { error } = await supabase
        .from("settings")
        .update({ meditation_enabled: enabled })
        .eq("user_id", user.id);

      if (error) throw error;

      setSettings({ ...settings, meditation_enabled: enabled });
    } catch (error) {
      console.error("Error updating meditation setting:", error);
      // Optionally: Send to error tracking service
    }
  };

  const updateMeditationInterval = async (minutes: number) => {
    if (!user || !settings) return;

    try {
      const { error } = await supabase
        .from("settings")
        .update({ meditation_interval_minutes: minutes })
        .eq("user_id", user.id);

      if (error) throw error;

      setSettings({ ...settings, meditation_interval_minutes: minutes });
    } catch (error) {
      console.error("Error updating meditation interval:", error);
      // Optionally: Send to error tracking service
    }
  };

  const value = {
    settings,
    loading,
    updateWorkDuration,
    updateBreakDuration,
    updateAlarmEnabled,
    updateDarkMode,
    updateMeditationEnabled,
    updateMeditationInterval,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};
