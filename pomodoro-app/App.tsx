import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider, useAuth } from "./src/context/AuthContext";
import { SettingsProvider } from "./src/context/SettingsContext";
import { ThemeProvider, useTheme } from "./src/context/ThemeContext";
import { UnauthNavigator } from "./src/navigation/UnauthNavigator";
import { MainNavigator } from "./src/navigation/MainNavigator";
import { ErrorBoundary } from "./src/components/Common";

function AppContent() {
  const { user, loading } = useAuth();
  const { theme } = useTheme();

  if (loading === true) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.text.primary }}>⏳ Loading...</Text>
      </View>
    );
  }

  return user ? <MainNavigator /> : <UnauthNavigator />;
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <SettingsProvider>
          <ThemeProvider>
            <NavigationContainer>
              <AppContent />
            </NavigationContainer>
          </ThemeProvider>
        </SettingsProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
