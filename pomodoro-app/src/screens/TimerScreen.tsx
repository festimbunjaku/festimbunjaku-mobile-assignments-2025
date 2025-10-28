import React, { useEffect, useState } from "react";
import { View, ScrollView, StyleSheet, Alert } from "react-native";
import { useAuth } from "../hooks/useAuth";
import { useSettings } from "../context/SettingsContext";
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

  // Load today's stats
  useEffect(() => {
    const loadStats = async () => {
      if (!user) return;

      try {
        const completed = await timerService.getTodaysSessionCount(user.id);
        const focusTime = await timerService.getTodaysFocusTime(user.id);

        setSessionsCompleted(completed);
        setTotalFocusTime(focusTime);
      } catch (error) {
        console.error("Error loading stats:", error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [user]);

  // Refresh stats when timer completes a session
  useEffect(() => {
    if (timerState.status === "completed") {
      // Show completion alert
      const sessionType = timerState.sessionType === "work" ? "Focus" : "Break";
      Alert.alert("Great Work!", `${sessionType} session completed!`, [
        {
          text: "OK",
          onPress: async () => {
            // Update stats
            if (user) {
              const completed = await timerService.getTodaysSessionCount(
                user.id
              );
              const focusTime = await timerService.getTodaysFocusTime(user.id);
              setSessionsCompleted(completed);
              setTotalFocusTime(focusTime);
            }

            // Auto stop and reset
            await stopTimer();
          },
        },
      ]);
    }
  }, [timerState.status]);

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
      style={styles.container}
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
    backgroundColor: "#F7F7F5",
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
