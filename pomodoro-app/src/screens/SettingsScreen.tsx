import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  Alert,
  Platform,
} from "react-native";
import Slider from "@react-native-community/slider";
import { useAuth } from "../hooks/useAuth";
import { useSettings } from "../context/SettingsContext";
import { useTheme } from "../context/ThemeContext";
import { Button } from "../components/Common";
import { soundManager } from "../utils";

export const SettingsScreen: React.FC = () => {
  const { signOut, user } = useAuth();
  const { theme } = useTheme();
  const {
    settings,
    updateWorkDuration,
    updateBreakDuration,
    updateAlarmEnabled,
    updateDarkMode,
  } = useSettings();

  const handleTestSound = async () => {
    try {
      await soundManager.playAlarm();
      // Stop after 2 seconds
      setTimeout(() => {
        soundManager.stopAlarm();
      }, 2000);
    } catch (error) {
      console.error("Error playing test sound:", error);
      Alert.alert("Error", "Could not play test sound. Please ensure alarm sound file exists.");
    }
  };

  const handleLogout = () => {
    console.log("🟡 [SETTINGS] Logout button pressed - handleLogout called");
    console.log("🟡 [SETTINGS] Platform:", Platform.OS);

    // Use window.confirm on web, Alert.alert on native platforms
    if (Platform.OS === "web") {
      const confirmed = window.confirm("Are you sure you want to logout?");
      if (confirmed) {
        console.log("🟡 [SETTINGS] User confirmed logout (web)");
        handleLogoutConfirmed();
      } else {
        console.log("🟡 [SETTINGS] Logout cancelled (web)");
      }
    } else {
      // iOS and Android use Alert.alert
      Alert.alert(
        "Logout",
        "Are you sure you want to logout?",
        [
          {
            text: "Cancel",
            style: "cancel",
            onPress: () =>
              console.log("🟡 [SETTINGS] Logout cancelled (native)"),
          },
          {
            text: "Logout",
            style: "destructive",
            onPress: () => {
              console.log("🟡 [SETTINGS] User confirmed logout (native)");
              handleLogoutConfirmed();
            },
          },
        ],
        { cancelable: false }
      );
    }
  };

  const handleLogoutConfirmed = async () => {
    try {
      console.log("🟡 [SETTINGS] About to call signOut...");
      await signOut();
      console.log("🟡 [SETTINGS] signOut returned");
    } catch (error) {
      console.error("🟡 [SETTINGS] Error during logout:", error);
      Alert.alert("Failed to logout", "Please try again.");
    }
  };

  console.log(
    "🟡 [SETTINGS] Rendering SettingsScreen, user:",
    user?.email,
    "settings loaded:",
    !!settings
  );

  const dynamicStyles = {
    container: [styles.container, { backgroundColor: theme.background }],
    sectionTitle: [styles.sectionTitle, { color: theme.text.primary }],
    card: [
      styles.card,
      {
        backgroundColor: theme.surface,
        borderColor: theme.border,
      },
    ],
    label: [styles.label, { color: theme.text.primary }],
    value: [styles.value, { color: theme.primary }],
    rangeLabel: [styles.rangeLabel, { color: theme.text.tertiary }],
  };

  return (
    <ScrollView style={dynamicStyles.container}>
      {/* Account Section */}
      <View style={styles.section}>
        <Text style={dynamicStyles.sectionTitle}>Account</Text>
        <View style={dynamicStyles.card}>
          <Text style={dynamicStyles.label}>Email</Text>
          <Text style={dynamicStyles.value}>{user?.email}</Text>
        </View>
      </View>

      {/* Timer Settings */}
      {settings ? (
        <>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>⏱️ Timer Settings</Text>

            {/* Work Duration */}
            <View style={dynamicStyles.card}>
              <View style={styles.settingHeader}>
                <Text style={dynamicStyles.label}>Work Duration</Text>
                <Text style={dynamicStyles.value}>
                  {settings.work_duration} min
                </Text>
              </View>
              <Slider
                style={styles.slider}
                minimumValue={1}
                maximumValue={60}
                step={1}
                value={settings.work_duration}
                onValueChange={updateWorkDuration}
                minimumTrackTintColor={theme.accent.work}
                maximumTrackTintColor={theme.border}
              />
              <View style={styles.rangeLabels}>
                <Text style={dynamicStyles.rangeLabel}>1 min</Text>
                <Text style={dynamicStyles.rangeLabel}>60 min</Text>
              </View>
            </View>

            {/* Break Duration */}
            <View style={dynamicStyles.card}>
              <View style={styles.settingHeader}>
                <Text style={dynamicStyles.label}>Break Duration</Text>
                <Text style={dynamicStyles.value}>
                  {settings.break_duration} min
                </Text>
              </View>
              <Slider
                style={styles.slider}
                minimumValue={1}
                maximumValue={30}
                step={1}
                value={settings.break_duration}
                onValueChange={updateBreakDuration}
                minimumTrackTintColor={theme.accent.break}
                maximumTrackTintColor={theme.border}
              />
              <View style={styles.rangeLabels}>
                <Text style={dynamicStyles.rangeLabel}>1 min</Text>
                <Text style={dynamicStyles.rangeLabel}>30 min</Text>
              </View>
            </View>
          </View>

          {/* Sound Settings */}
          <View style={styles.section}>
            <Text style={dynamicStyles.sectionTitle}>🔔 Sound</Text>
            <View style={dynamicStyles.card}>
              <View style={styles.toggleRow}>
                <Text style={dynamicStyles.label}>Alarm Sound</Text>
                <Switch
                  value={settings.alarm_sound_enabled}
                  onValueChange={updateAlarmEnabled}
                  trackColor={{
                    false: theme.border,
                    true: theme.accent.work,
                  }}
                  thumbColor={theme.surface}
                />
              </View>
              <View style={styles.buttonContainer}>
                <Button
                  title="Test Sound"
                  onPress={handleTestSound}
                  variant="outline"
                  style={styles.testButton}
                />
              </View>
            </View>
          </View>

          {/* Appearance Settings */}
          <View style={styles.section}>
            <Text style={dynamicStyles.sectionTitle}>🎨 Appearance</Text>
            <View style={dynamicStyles.card}>
              <View style={styles.toggleRow}>
                <Text style={dynamicStyles.label}>Dark Mode</Text>
                <Switch
                  value={settings.dark_mode_enabled}
                  onValueChange={updateDarkMode}
                  trackColor={{
                    false: theme.border,
                    true: theme.accent.work,
                  }}
                  thumbColor={theme.surface}
                />
              </View>
            </View>
          </View>
        </>
      ) : (
        <View style={styles.section}>
          <Text
            style={[
              { textAlign: "center" },
              { color: theme.text.secondary },
            ]}
          >
            Loading settings...
          </Text>
        </View>
      )}

      {/* Logout - Always visible */}
      <View style={styles.section}>
        <Button title="Logout" onPress={handleLogout} variant="outline" />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
  },
  value: {
    fontSize: 16,
    fontWeight: "700",
  },
  settingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  rangeLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  rangeLabel: {
    fontSize: 11,
  },
  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  buttonContainer: {
    marginTop: 8,
  },
  testButton: {
    marginTop: 0,
  },
});
