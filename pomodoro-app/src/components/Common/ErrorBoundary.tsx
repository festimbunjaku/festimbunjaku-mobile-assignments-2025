import React, { Component, ReactNode } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Button } from "./Button";
import { useTheme } from "../../context/ThemeContext";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

interface ErrorDisplayProps {
  error: Error | null;
  onReset: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, onReset }) => {
  const { theme } = useTheme();

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.errorContainer}>
        <MaterialIcons name="error-outline" size={48} color={theme.accent.warning} />
        <Text style={[styles.title, { color: theme.text.primary }]}>Oops! Something went wrong</Text>
        <Text style={[styles.message, { color: theme.text.secondary }]}>
          {error?.message || "An unexpected error occurred"}
        </Text>
        <Text style={[styles.details, { color: theme.text.tertiary }]}>
          {error?.stack || "No additional details available"}
        </Text>
        <Button
          title="Try Again"
          onPress={onReset}
          style={styles.button}
        />
      </View>
    </ScrollView>
  );
};

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Error caught by boundary
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return <ErrorDisplay error={this.state.error} onReset={this.handleReset} />;
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 12,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: "center",
  },
  details: {
    fontSize: 12,
    marginBottom: 24,
    textAlign: "center",
    fontFamily: "Courier",
  },
  button: {
    minWidth: 120,
  },
});

