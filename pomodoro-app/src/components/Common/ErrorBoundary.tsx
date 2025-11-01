import React, { Component, ReactNode } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Button } from "./Button";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <ScrollView style={styles.container}>
          <View style={styles.errorContainer}>
            <Text style={styles.emoji}>⚠️</Text>
            <Text style={styles.title}>Oops! Something went wrong</Text>
            <Text style={styles.message}>
              {this.state.error?.message || "An unexpected error occurred"}
            </Text>
            <Text style={styles.details}>
              {this.state.error?.stack || "No additional details available"}
            </Text>
            <Button
              title="Try Again"
              onPress={this.handleReset}
              style={styles.button}
            />
          </View>
        </ScrollView>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7F5",
  },
  errorContainer: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  emoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2D3436",
    marginBottom: 12,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    color: "#636E72",
    marginBottom: 16,
    textAlign: "center",
  },
  details: {
    fontSize: 12,
    color: "#A8B5C4",
    marginBottom: 24,
    textAlign: "center",
    fontFamily: "Courier",
  },
  button: {
    minWidth: 120,
  },
});

