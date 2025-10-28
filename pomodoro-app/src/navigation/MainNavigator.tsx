import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { TimerScreen } from "../screens/TimerScreen";
import { StatsScreen } from "../screens/StatsScreen";
import { HistoryScreen } from "../screens/HistoryScreen";
import { SettingsScreen } from "../screens/SettingsScreen";

export type MainTabParamList = {
  Timer: undefined;
  Stats: undefined;
  History: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

export const MainNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
      }}
    >
      <Tab.Screen name="Timer" component={TimerScreen} />
      <Tab.Screen name="Stats" component={StatsScreen} />
      <Tab.Screen name="History" component={HistoryScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};
