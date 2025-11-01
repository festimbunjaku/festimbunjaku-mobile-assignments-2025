import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { TimerState } from "../../types";
import { formatTime } from "../../utils";
import { useTheme } from "../../context/ThemeContext";
import { typography } from "../../constants/typography";

interface TimerDisplayProps {
  timerState: TimerState;
}

const CIRCLE_RADIUS = 90;
const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS;

export const TimerDisplay: React.FC<TimerDisplayProps> = ({ timerState }) => {
  const { theme } = useTheme();
  const progress =
    timerState.targetDuration > 0
      ? timerState.timeRemaining / timerState.targetDuration
      : 0;
  const strokeDashoffset = CIRCLE_CIRCUMFERENCE * (1 - progress);

  const getSessionColor = () => {
    return timerState.sessionType === "work"
      ? theme.accent.work
      : theme.accent.break;
  };

  const getSessionLabel = () => {
    return timerState.sessionType === "work" ? "Focus Time" : "Break Time";
  };

  return (
    <View style={styles.container}>
      <View style={styles.svgContainer}>
        <Svg width={260} height={260} viewBox="0 0 260 260">
          {/* Background circle */}
          <Circle
            cx={130}
            cy={130}
            r={CIRCLE_RADIUS}
            stroke={theme.border}
            strokeWidth={8}
            fill="none"
          />
          {/* Progress circle */}
          <Circle
            cx={130}
            cy={130}
            r={CIRCLE_RADIUS}
            stroke={getSessionColor()}
            strokeWidth={8}
            fill="none"
            strokeDasharray={CIRCLE_CIRCUMFERENCE}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform="rotate(-90 130 130)"
          />
        </Svg>

        {/* Time display */}
        <View style={styles.timeContainer}>
          <Text style={[styles.timeText, { color: theme.text.primary }]}>
            {formatTime(timerState.timeRemaining)}
          </Text>
          <Text style={[styles.sessionLabel, { color: theme.text.secondary }]}>
            {getSessionLabel()}
          </Text>
        </View>
      </View>

      {/* Status indicator */}
      <View style={styles.statusContainer}>
        <Text
          style={[
            styles.statusText,
            {
              color:
                timerState.status === "running"
                  ? theme.accent.success
                  : timerState.status === "paused"
                  ? theme.accent.warning
                  : theme.text.tertiary,
            },
          ]}
        >
          {timerState.status.toUpperCase()}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginBottom: 40,
  },
  svgContainer: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    width: 260,
    height: 260,
  },
  timeContainer: {
    position: "absolute",
    alignItems: "center",
  },
  timeText: {
    ...typography.styles.timerMedium,
    fontSize: 56,
  },
  sessionLabel: {
    ...typography.styles.label,
    marginTop: 8,
  },
  statusContainer: {
    marginTop: 20,
  },
  statusText: {
    ...typography.styles.caption,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
});
