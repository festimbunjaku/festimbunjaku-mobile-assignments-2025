import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../services/supabase";
import { useAuth } from "../hooks/useAuth";
import { Settings, SettingsUpdate } from "../types";

interface SettingsContextType {
  settings: Settings | null;
  loading: boolean;
  updateWorkDuration: (minutes: number) => Promise<void>;
  updateBreakDuration: (minutes: number) => Promise<void>;
  updateAlarmEnabled: (enabled: boolean) => Promise<void>;
  updateDarkMode: (enabled: boolean) => Promise<void>;
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
        const { data, error } = await supabase
          .from("settings")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (error) {
          console.error("Error loading settings:", error);
          setSettings(null);
        } else {
          setSettings(data);
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
    }
  };

  const value = {
    settings,
    loading,
    updateWorkDuration,
    updateBreakDuration,
    updateAlarmEnabled,
    updateDarkMode,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};
