import React, { createContext, useContext, useMemo } from "react";
import { useSettings } from "../context/SettingsContext";
import { lightTheme, darkTheme, Theme } from "../constants/colors";

interface ThemeContextType {
  isDarkMode: boolean;
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { settings, updateDarkMode } = useSettings();

  const isDarkMode = settings?.dark_mode_enabled ?? false;
  const theme = isDarkMode ? darkTheme : lightTheme;

  const toggleTheme = async () => {
    await updateDarkMode(!isDarkMode);
  };

  const value = useMemo(
    () => ({
      isDarkMode,
      theme,
      toggleTheme,
    }),
    [isDarkMode, theme]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
