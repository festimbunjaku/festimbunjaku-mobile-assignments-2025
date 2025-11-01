import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { typography } from "../../constants/typography";

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
  const { theme } = useTheme();

  // Get primary button background color
  const getPrimaryButtonBackground = () => {
    return theme.primary;
  };

  const getButtonStyle = () => {
    const dynamicStyles = {
      buttonPrimary: { backgroundColor: getPrimaryButtonBackground() },
      buttonSecondary: { backgroundColor: theme.secondary },
      buttonOutline: {
        backgroundColor: "transparent",
        borderColor: theme.primary,
      },
      buttonDisabled: {
        backgroundColor: theme.border,
        opacity: 0.6,
      },
    };

    if (disabled || loading) {
      return [styles.button, dynamicStyles.buttonDisabled, style];
    }

    switch (variant) {
      case "secondary":
        return [styles.button, dynamicStyles.buttonSecondary, style];
      case "outline":
        return [styles.button, styles.buttonOutline, dynamicStyles.buttonOutline, style];
      default:
        return [styles.button, dynamicStyles.buttonPrimary, style];
    }
  };

  const getTextStyle = () => {
    // For primary and secondary buttons, use white text for contrast
    // For outline buttons, use primary color
    const dynamicTextStyles = {
      text: { color: "#FFFFFF" }, // White text for colored buttons
      textOutline: { color: theme.primary },
    };

    if (variant === "outline") {
      return [styles.text, dynamicTextStyles.textOutline, textStyle];
    }
    return [styles.text, dynamicTextStyles.text, textStyle];
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
  buttonOutline: {
    borderWidth: 2,
  },
  text: {
    ...typography.styles.button,
  },
});
