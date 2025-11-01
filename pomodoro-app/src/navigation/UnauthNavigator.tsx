import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { HomeScreen } from "../screens/HomeScreen";
import { LoginScreen } from "../screens/Auth/LoginScreen";
import { RegisterScreen } from "../screens/Auth/RegisterScreen";

export type UnauthStackParamList = {
  Home: undefined;
  Login: undefined;
  Register: undefined;
};

const Stack = createStackNavigator<UnauthStackParamList>();

export const UnauthNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animationEnabled: true,
        gestureEnabled: false,
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
};
