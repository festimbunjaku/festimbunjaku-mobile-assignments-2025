import React from "react";
import { View, StyleSheet } from "react-native";
import { Button } from "../Common";
import { TimerState } from "../../types";

interface TimerControlsProps {
  timerState: TimerState;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  disabled?: boolean;
}

export const TimerControls: React.FC<TimerControlsProps> = ({
  timerState,
  onStart,
  onPause,
  onResume,
  onStop,
  disabled = false,
}) => {
  const isIdle = timerState.status === "idle";
  const isRunning = timerState.status === "running";
  const isPaused = timerState.status === "paused";

  return (
    <View style={styles.container}>
      {isIdle && (
        <Button
          title="Start"
          onPress={onStart}
          disabled={disabled}
          style={styles.button}
        />
      )}

      {isRunning && (
        <>
          <Button
            title="Pause"
            onPress={onPause}
            disabled={disabled}
            style={styles.button}
          />
        </>
      )}

      {isPaused && (
        <>
          <Button
            title="Resume"
            onPress={onResume}
            disabled={disabled}
            style={styles.button}
          />
          <Button
            title="Stop"
            onPress={onStop}
            variant="outline"
            disabled={disabled}
            style={styles.button}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  button: {
    flex: 1,
    minWidth: 120,
  },
});
