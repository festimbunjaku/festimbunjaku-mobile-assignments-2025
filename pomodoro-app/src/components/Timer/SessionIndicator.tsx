import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { TimerState } from "../../types";

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
  const formatFocusTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.stat}>
        <Text style={styles.statValue}>{sessionsCompleted}</Text>
        <Text style={styles.statLabel}>Sessions</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.stat}>
        <Text style={styles.statValue}>{formatFocusTime(totalFocusTime)}</Text>
        <Text style={styles.statLabel}>Focus Time</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.stat}>
        <Text
          style={[
            styles.statValue,
            {
              color: timerState.sessionType === "work" ? "#8FA89E" : "#D4A373",
            },
          ]}
        >
          {timerState.sessionType === "work" ? "Work" : "Break"}
        </Text>
        <Text style={styles.statLabel}>Type</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 24,
    marginBottom: 24,
    alignItems: "center",
    justifyContent: "space-around",
    borderWidth: 1,
    borderColor: "#E8E8E6",
  },
  stat: {
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2D3436",
  },
  statLabel: {
    fontSize: 12,
    color: "#636E72",
    marginTop: 4,
  },
  divider: {
    width: 1,
    height: 30,
    backgroundColor: "#E8E8E6",
  },
});
