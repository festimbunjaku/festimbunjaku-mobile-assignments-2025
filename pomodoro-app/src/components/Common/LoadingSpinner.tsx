import React from "react";
import { View, StyleSheet, Text, ActivityIndicator } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";

interface LoadingSpinnerProps {
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = "Loading...",
}) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <MaterialIcons name="hourglass-empty" size={48} color={theme.primary} />
      <Text style={[styles.message, { color: theme.text.secondary }]}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  message: {
    fontSize: 16,
  },
});
