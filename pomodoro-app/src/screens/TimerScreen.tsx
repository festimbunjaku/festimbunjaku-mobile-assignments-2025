import React, { useEffect, useState, useCallback } from "react";
import { View, ScrollView, StyleSheet, Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useAuth } from "../hooks/useAuth";
import { useSettings } from "../context/SettingsContext";
import { useTheme } from "../context/ThemeContext";
import { useTimer } from "../hooks/useTimer";
import { timerService } from "../services/timer.service";
import {
  TimerDisplay,
  TimerControls,
  SessionIndicator,
} from "../components/Timer";
import { LoadingSpinner } from "../components/Common";
import { soundManager } from "../utils";

export const TimerScreen: React.FC = () => {
  const { user } = useAuth();
  const { settings } = useSettings();
  const { theme } = useTheme();
  const {
    timerState,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    updateDuration,
  } = useTimer({
    workDuration: settings?.work_duration || 30,
    breakDuration: settings?.break_duration || 10,
  });

  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [totalFocusTime, setTotalFocusTime] = useState(0);
  const [loading, setLoading] = useState(true);

  // Function to load stats
  const loadStats = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const completed = await timerService.getTodaysSessionCount(user.id);
      const focusTime = await timerService.getTodaysFocusTime(user.id);

      setSessionsCompleted(completed);
      setTotalFocusTime(focusTime);
    } catch (error) {
      // Error loading stats
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Refresh stats when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadStats();
    }, [loadStats])
  );

  // Update timer duration when settings change
  useEffect(() => {
    if (settings && timerState.status === "idle") {
      updateDuration(settings.work_duration, settings.break_duration);
    }
  }, [
    settings?.work_duration,
    settings?.break_duration,
    updateDuration,
    timerState.status,
  ]);

  // Load stats on mount
  useEffect(() => {
    loadStats();
  }, [loadStats]);

  // Refresh stats when timer completes a session
  useEffect(() => {
    if (timerState.status === "completed") {
      // Play alarm sound if enabled
      if (settings?.alarm_sound_enabled) {
        soundManager.playAlarm();
      }

      // Show completion alert
      const sessionType = timerState.sessionType === "work" ? "Focus" : "Break";
      Alert.alert("Great Work!", `${sessionType} session completed!`, [
        {
          text: "OK",
          onPress: async () => {
            // Stop alarm if still playing
            soundManager.stopAlarm();

            // Auto stop and reset first (this saves the session)
            await stopTimer();

            // Wait a moment for the database to update, then refresh stats
            setTimeout(async () => {
              if (user) {
                const completed = await timerService.getTodaysSessionCount(
                  user.id
                );
                const focusTime = await timerService.getTodaysFocusTime(user.id);
                setSessionsCompleted(completed);
                setTotalFocusTime(focusTime);
              }
            }, 500);
          },
        },
      ]);
    }
  }, [timerState.status, settings?.alarm_sound_enabled, user, stopTimer]);

  // Load sound on mount
  useEffect(() => {
    soundManager.loadSound();
    return () => {
      soundManager.unloadSound();
    };
  }, []);

  if (loading) {
    return <LoadingSpinner message="Loading timer..." />;
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.contentContainer}
      scrollEnabled={false}
    >
      <View style={styles.content}>
        {/* Session Info */}
        <SessionIndicator
          timerState={timerState}
          sessionsCompleted={sessionsCompleted}
          totalFocusTime={totalFocusTime}
        />

        {/* Timer Display */}
        <TimerDisplay timerState={timerState} />

        {/* Controls */}
        <TimerControls
          timerState={timerState}
          onStart={startTimer}
          onPause={pauseTimer}
          onResume={resumeTimer}
          onStop={stopTimer}
          disabled={!user}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingVertical: 24,
    justifyContent: "center",
  },
});
