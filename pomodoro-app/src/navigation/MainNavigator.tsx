import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, Platform, StyleSheet } from "react-native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { TimerScreen } from "../screens/TimerScreen";
import { StatsScreen } from "../screens/StatsScreen";
import { HistoryScreen } from "../screens/HistoryScreen";
import { SettingsScreen } from "../screens/SettingsScreen";
import { ProfileScreen } from "../screens/ProfileScreen";
import { useTheme } from "../context/ThemeContext";
import { useProfile } from "../context/ProfileContext";
import { useAuth } from "../hooks/useAuth";
import { Avatar } from "../components/Common";
import { typography } from "../constants/typography";

export type MainTabParamList = {
  Timer: undefined;
  Stats: undefined;
  History: undefined;
  Settings: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

export const MainNavigator: React.FC = () => {
  const { theme } = useTheme();
  const { profile } = useProfile();
  const { user } = useAuth();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: theme.surface,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: theme.border,
        },
        headerTintColor: theme.text.primary,
        headerTitleStyle: {
          fontFamily: typography.fontFamily.bold,
          fontSize: 18,
          color: theme.text.primary,
        },
        tabBarStyle: {
          backgroundColor: theme.surface,
          borderTopColor: theme.border,
          borderTopWidth: 1,
          height: Platform.OS === "ios" ? 88 : 65,
          paddingBottom: Platform.OS === "ios" ? 25 : 8,
          paddingTop: 8,
          elevation: 8,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.text.tertiary,
        tabBarLabelStyle: {
          fontSize: 11,
          fontFamily: typography.fontFamily.semibold,
          marginTop: 4,
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
        tabBarItemStyle: {
          paddingVertical: 4,
        },
        tabBarShowLabel: true,
      }}
    >
      <Tab.Screen
        name="Timer"
        component={TimerScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <View style={styles.iconContainer}>
              {focused && (
                <View
                  style={[
                    styles.activeIndicator,
                    {
                      backgroundColor: theme.primary + "20",
                    },
                  ]}
                />
              )}
              <MaterialIcons
                name="timer"
                size={focused ? 28 : 24}
                color={color}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Stats"
        component={StatsScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <View style={styles.iconContainer}>
              {focused && (
                <View
                  style={[
                    styles.activeIndicator,
                    {
                      backgroundColor: theme.primary + "20",
                    },
                  ]}
                />
              )}
              <MaterialIcons
                name="bar-chart"
                size={focused ? 28 : 24}
                color={color}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <View style={styles.iconContainer}>
              {focused && (
                <View
                  style={[
                    styles.activeIndicator,
                    {
                      backgroundColor: theme.primary + "20",
                    },
                  ]}
                />
              )}
              <MaterialIcons
                name="history"
                size={focused ? 28 : 24}
                color={color}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <View style={styles.iconContainer}>
              {focused && (
                <View
                  style={[
                    styles.activeIndicator,
                    {
                      backgroundColor: theme.primary + "20",
                    },
                  ]}
                />
              )}
              <Ionicons
                name="settings"
                size={focused ? 28 : 24}
                color={color}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.iconContainer}>
              {focused && (
                <View
                  style={[
                    styles.activeIndicator,
                    {
                      backgroundColor: theme.primary + "20",
                    },
                  ]}
                />
              )}
              <Avatar
                profilePictureUrl={profile?.profile_picture_url}
                email={user?.email || ""}
                size={focused ? 28 : 24}
                style={styles.avatarIcon}
              />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 40,
  },
  activeIndicator: {
    position: "absolute",
    width: 40,
    height: 40,
    borderRadius: 20,
    top: 0,
    left: 0,
  },
  avatarIcon: {
    borderWidth: 0,
  },
});
