import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import * as Font from "expo-font";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
} from "@expo-google-fonts/inter";
import { AuthProvider, useAuth } from "./src/context/AuthContext";
import { SettingsProvider } from "./src/context/SettingsContext";
import { ThemeProvider } from "./src/context/ThemeContext";
import { UnauthNavigator } from "./src/navigation/UnauthNavigator";
import { MainNavigator } from "./src/navigation/MainNavigator";
import { ErrorBoundary, LoadingSpinner } from "./src/components/Common";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";

// Simple loading component that doesn't require ThemeProvider
function SimpleLoadingSpinner({ message }: { message?: string }) {
  return (
    <View style={simpleLoadingStyles.container}>
      <ActivityIndicator size="large" color="#724e2c" />
      {message && <Text style={simpleLoadingStyles.message}>{message}</Text>}
    </View>
  );
}

const simpleLoadingStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F1EB",
    gap: 16,
  },
  message: {
    fontSize: 16,
    color: "#584d3d",
    fontFamily: "Inter_400Regular",
  },
});

function AppContent() {
  const { user, loading } = useAuth();

  if (loading === true) {
    return <LoadingSpinner message="Loading..." />;
  }

  return user ? <MainNavigator /> : <UnauthNavigator />;
}

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          Inter_400Regular,
          Inter_500Medium,
          Inter_600SemiBold,
          Inter_700Bold,
          Inter_800ExtraBold,
        });
        setFontsLoaded(true);
      } catch (error) {
        setFontsLoaded(true); // Continue even if fonts fail to load
      }
    }

    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return <SimpleLoadingSpinner message="Loading fonts..." />;
  }

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
