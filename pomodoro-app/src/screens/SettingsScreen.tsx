import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  Alert,
  Platform,
  Linking,
} from "react-native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { useAuth } from "../hooks/useAuth";
import { useSettings } from "../context/SettingsContext";
import { useTheme } from "../context/ThemeContext";
import { Button } from "../components/Common";
import { soundManager } from "../utils";
import { typography } from "../constants/typography";

export const SettingsScreen: React.FC = () => {
  const { signOut } = useAuth();
  const { theme } = useTheme();
  const {
    settings,
    updateWorkDuration,
    updateBreakDuration,
    updateAlarmEnabled,
    updateDarkMode,
    updateMeditationEnabled,
    updateMeditationInterval,
  } = useSettings();

  const handleTestSound = async () => {
    try {
      await soundManager.playAlarm();
      // Stop after 2 seconds
      setTimeout(() => {
        soundManager.stopAlarm();
      }, 2000);
    } catch (error) {
      Alert.alert(
        "Error",
        "Could not play test sound. Please ensure alarm sound file exists."
      );
    }
  };

  const handleLogout = () => {
    // Use window.confirm on web, Alert.alert on native platforms
    if (Platform.OS === "web") {
      const confirmed = window.confirm("Are you sure you want to logout?");
      if (confirmed) {
        handleLogoutConfirmed();
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
          },
          {
            text: "Logout",
            style: "destructive",
            onPress: () => {
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
      await signOut();
    } catch (error) {
      Alert.alert("Failed to logout", "Please try again.");
    }
  };

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
    <ScrollView 
      style={dynamicStyles.container}
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
      nestedScrollEnabled={true}
      bounces={false}
      scrollEnabled={true}
    >
      {/* Timer Settings */}
      {settings ? (
        <>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialIcons
                name="timer"
                size={20}
                color={theme.text.primary}
                style={{ marginRight: 8 }}
              />
              <Text style={dynamicStyles.sectionTitle}>Timer Settings</Text>
            </View>

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
            <View style={styles.sectionHeader}>
              <Ionicons
                name="notifications"
                size={20}
                color={theme.text.primary}
                style={{ marginRight: 8 }}
              />
              <Text style={dynamicStyles.sectionTitle}>Sound</Text>
            </View>
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

          {/* Meditation Settings */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialIcons
                name="self-improvement"
                size={20}
                color={theme.text.primary}
                style={{ marginRight: 8 }}
              />
              <Text style={dynamicStyles.sectionTitle}>Meditation</Text>
            </View>
            <View style={dynamicStyles.card}>
              <View style={styles.toggleRow}>
                <Text style={dynamicStyles.label}>Meditation Reminders</Text>
                <Switch
                  testID="meditation-toggle"
                  value={settings.meditation_enabled ?? false}
                  onValueChange={updateMeditationEnabled}
                  trackColor={{
                    false: theme.border,
                    true: theme.accent.work,
                  }}
                  thumbColor={theme.surface}
                />
              </View>
              {(settings.meditation_enabled ?? false) && (
                <>
                  <View style={styles.settingHeader}>
                    <Text style={dynamicStyles.label}>Reminder Interval</Text>
                    <Text style={dynamicStyles.value}>
                      {settings.meditation_interval_minutes ?? 5} min
                    </Text>
                  </View>
                  <Slider
                    style={styles.slider}
                    minimumValue={1}
                    maximumValue={10}
                    step={1}
                    value={settings.meditation_interval_minutes ?? 5}
                    onValueChange={updateMeditationInterval}
                    minimumTrackTintColor={theme.accent.work}
                    maximumTrackTintColor={theme.border}
                  />
                  <View style={styles.rangeLabels}>
                    <Text style={dynamicStyles.rangeLabel}>1 min</Text>
                    <Text style={dynamicStyles.rangeLabel}>10 min</Text>
                  </View>
                  <Text
                    style={[
                      styles.helpText,
                      { color: theme.text.secondary },
                    ]}
                  >
                    Get meditation reminders during Pomodoro work sessions
                  </Text>
                </>
              )}
            </View>
          </View>

          {/* Appearance Settings */}
          <View style={[styles.section, styles.appearanceSection]}>
            <View style={styles.sectionHeader}>
              <MaterialIcons
                name="palette"
                size={20}
                color={theme.text.primary}
                style={{ marginRight: 8 }}
              />
              <Text style={dynamicStyles.sectionTitle}>Appearance</Text>
            </View>
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

          {/* Footer */}
          <View style={styles.footer}>
            <View style={styles.footerContent}>
              <Text
                style={[styles.footerText, { color: theme.text.secondary }]}
              >
                Built by{" "}
              </Text>
              <Text
                style={[styles.footerLink, { color: theme.primary }]}
                onPress={() => Linking.openURL("https://festimbunjaku.dev")}
              >
                Festim Bunjaku
              </Text>
            </View>
          </View>
        </>
      ) : (
        <View style={styles.section}>
          <Text
            style={[{ textAlign: "center" }, { color: theme.text.secondary }]}
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
  appearanceSection: {
    marginBottom: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
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
  footer: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 24,
    marginTop: 0,
    marginBottom: 0,
  },
  footerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  footerText: {
    ...typography.styles.bodySmall,
    fontSize: 12,
    letterSpacing: 0.1,
    lineHeight: 18,
  },
  footerLink: {
    fontSize: 14,
    fontFamily: typography.fontFamily.bold,
    fontWeight: "700",
    letterSpacing: 0.2,
    lineHeight: 20,
  },
  helpText: {
    fontSize: 12,
    marginTop: 8,
    fontStyle: "italic",
  },
});
