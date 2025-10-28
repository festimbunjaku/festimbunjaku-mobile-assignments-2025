import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { TimerState } from "../../types";
import { formatTime } from "../../utils";

interface TimerDisplayProps {
  timerState: TimerState;
}

const CIRCLE_RADIUS = 90;
const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS;

export const TimerDisplay: React.FC<TimerDisplayProps> = ({ timerState }) => {
  const progress =
    timerState.targetDuration > 0
      ? timerState.timeRemaining / timerState.targetDuration
      : 0;
  const strokeDashoffset = CIRCLE_CIRCUMFERENCE * (1 - progress);

  const getSessionColor = () => {
    return timerState.sessionType === "work" ? "#8FA89E" : "#D4A373";
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
            stroke="#E8E8E6"
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
          <Text style={styles.timeText}>
            {formatTime(timerState.timeRemaining)}
          </Text>
          <Text style={styles.sessionLabel}>{getSessionLabel()}</Text>
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
                  ? "#7FB685"
                  : timerState.status === "paused"
                  ? "#C9A67A"
                  : "#7C8B9E",
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
    fontSize: 56,
    fontWeight: "700",
    color: "#2D3436",
  },
  sessionLabel: {
    fontSize: 14,
    color: "#636E72",
    marginTop: 8,
    fontWeight: "600",
  },
  statusContainer: {
    marginTop: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
});
