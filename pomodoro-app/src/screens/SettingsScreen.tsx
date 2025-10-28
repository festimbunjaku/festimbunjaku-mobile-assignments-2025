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
import { Button } from "../components/Common";

export const SettingsScreen: React.FC = () => {
  const { signOut, user } = useAuth();
  const {
    settings,
    updateWorkDuration,
    updateBreakDuration,
    updateAlarmEnabled,
    updateDarkMode,
  } = useSettings();

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

  return (
    <ScrollView style={styles.container}>
      {/* Account Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.card}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{user?.email}</Text>
        </View>
      </View>

      {/* Timer Settings */}
      {settings ? (
        <>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>⏱️ Timer Settings</Text>

            {/* Work Duration */}
            <View style={styles.card}>
              <View style={styles.settingHeader}>
                <Text style={styles.label}>Work Duration</Text>
                <Text style={styles.value}>{settings.work_duration} min</Text>
              </View>
              <Slider
                style={styles.slider}
                minimumValue={1}
                maximumValue={60}
                step={1}
                value={settings.work_duration}
                onValueChange={updateWorkDuration}
                minimumTrackTintColor="#8FA89E"
                maximumTrackTintColor="#E8E8E6"
              />
              <View style={styles.rangeLabels}>
                <Text style={styles.rangeLabel}>1 min</Text>
                <Text style={styles.rangeLabel}>60 min</Text>
              </View>
            </View>

            {/* Break Duration */}
            <View style={styles.card}>
              <View style={styles.settingHeader}>
                <Text style={styles.label}>Break Duration</Text>
                <Text style={styles.value}>{settings.break_duration} min</Text>
              </View>
              <Slider
                style={styles.slider}
                minimumValue={1}
                maximumValue={30}
                step={1}
                value={settings.break_duration}
                onValueChange={updateBreakDuration}
                minimumTrackTintColor="#D4A373"
                maximumTrackTintColor="#E8E8E6"
              />
              <View style={styles.rangeLabels}>
                <Text style={styles.rangeLabel}>1 min</Text>
                <Text style={styles.rangeLabel}>30 min</Text>
              </View>
            </View>
          </View>

          {/* Sound Settings */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🔔 Sound</Text>
            <View style={styles.card}>
              <View style={styles.toggleRow}>
                <Text style={styles.label}>Alarm Sound</Text>
                <Switch
                  value={settings.alarm_sound_enabled}
                  onValueChange={updateAlarmEnabled}
                  trackColor={{ false: "#E8E8E6", true: "#8FA89E" }}
                  thumbColor="#FFFFFF"
                />
              </View>
            </View>
          </View>

          {/* Appearance Settings */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🎨 Appearance</Text>
            <View style={styles.card}>
              <View style={styles.toggleRow}>
                <Text style={styles.label}>Dark Mode</Text>
                <Switch
                  value={settings.dark_mode_enabled}
                  onValueChange={updateDarkMode}
                  trackColor={{ false: "#E8E8E6", true: "#8FA89E" }}
                  thumbColor="#FFFFFF"
                />
              </View>
            </View>
          </View>
        </>
      ) : (
        <View style={styles.section}>
          <Text style={{ textAlign: "center", color: "#7C8B9E" }}>
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
    backgroundColor: "#F7F7F5",
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2D3436",
    marginBottom: 12,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E8E8E6",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2D3436",
  },
  value: {
    fontSize: 16,
    fontWeight: "700",
    color: "#7C8B9E",
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
    color: "#A8B5C4",
  },
  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
