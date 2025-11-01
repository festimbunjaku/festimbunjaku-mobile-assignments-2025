import React from "react";
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  Platform,
} from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { typography } from "../../constants/typography";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  containerStyle,
  style,
  ...textInputProps
}) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[styles.label, { color: theme.text.primary }]}>
          {label}
        </Text>
      )}
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.surface,
            borderColor: error ? "#E74C3C" : theme.border,
            color: theme.text.primary,
          },
          style,
        ]}
        placeholderTextColor={theme.text.tertiary}
        {...textInputProps}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    ...typography.styles.label,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.base,
    fontWeight: "400",
    minHeight: 60,
    margin: 0,
    ...Platform.select({
      ios: {
        paddingTop: 12,
        paddingBottom: 12,
        lineHeight: 20,
      },
      android: {
        paddingVertical: 0,
        paddingTop: 0,
        paddingBottom: 0,
        lineHeight: undefined,
        textAlignVertical: "center",
        includeFontPadding: false,
      },
    }),
  },
  errorText: {
    ...typography.styles.caption,
    color: "#E74C3C",
    marginTop: 4,
  },
});
