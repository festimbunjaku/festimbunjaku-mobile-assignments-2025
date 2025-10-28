import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from "react-native";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline";
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  disabled = false,
  loading = false,
  style,
  textStyle,
}) => {
  const getButtonStyle = () => {
    if (disabled || loading) {
      return [styles.button, styles.buttonDisabled, style];
    }

    switch (variant) {
      case "secondary":
        return [styles.button, styles.buttonSecondary, style];
      case "outline":
        return [styles.button, styles.buttonOutline, style];
      default:
        return [styles.button, styles.buttonPrimary, style];
    }
  };

  const getTextStyle = () => {
    if (variant === "outline") {
      return [styles.text, styles.textOutline, textStyle];
    }
    return [styles.text, textStyle];
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={Boolean(disabled || loading)}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color="#FFFFFF" />
      ) : (
        <Text style={getTextStyle()}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 50,
  },
  buttonPrimary: {
    backgroundColor: "#7C8B9E",
  },
  buttonSecondary: {
    backgroundColor: "#A8B5C4",
  },
  buttonOutline: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#7C8B9E",
  },
  buttonDisabled: {
    backgroundColor: "#E8E8E6",
    opacity: 0.6,
  },
  text: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  textOutline: {
    color: "#7C8B9E",
  },
});
