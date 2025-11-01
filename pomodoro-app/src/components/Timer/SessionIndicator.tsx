import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { TimerState } from "../../types";
import { useTheme } from "../../context/ThemeContext";

interface SessionIndicatorProps {
  timerState: TimerState;
  sessionsCompleted: number;
  totalFocusTime: number; // in seconds
}

export const SessionIndicator: React.FC<SessionIndicatorProps> = ({
  timerState,
  sessionsCompleted,
  totalFocusTime,
}) => {
  const { theme } = useTheme();
  const formatFocusTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.surface,
          borderColor: theme.border,
        },
      ]}
    >
      <View style={styles.stat}>
        <Text style={[styles.statValue, { color: theme.text.primary }]}>
          {sessionsCompleted}
        </Text>
        <Text style={[styles.statLabel, { color: theme.text.secondary }]}>
          Sessions
        </Text>
      </View>

      <View style={[styles.divider, { backgroundColor: theme.border }]} />

      <View style={styles.stat}>
        <Text style={[styles.statValue, { color: theme.text.primary }]}>
          {formatFocusTime(totalFocusTime)}
        </Text>
        <Text style={[styles.statLabel, { color: theme.text.secondary }]}>
          Focus Time
        </Text>
      </View>

      <View style={[styles.divider, { backgroundColor: theme.border }]} />

      <View style={styles.stat}>
        <Text
          style={[
            styles.statValue,
            {
              color:
                timerState.sessionType === "work"
                  ? theme.accent.work
                  : theme.accent.break,
            },
          ]}
        >
          {timerState.sessionType === "work" ? "Work" : "Break"}
        </Text>
        <Text style={[styles.statLabel, { color: theme.text.secondary }]}>
          Type
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 24,
    marginBottom: 24,
    alignItems: "center",
    justifyContent: "space-around",
    borderWidth: 1,
  },
  stat: {
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "700",
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  divider: {
    width: 1,
    height: 30,
  },
});
