import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { SettingsScreen } from "../../src/screens/SettingsScreen";
import { useSettings } from "../../src/context/SettingsContext";
import { useAuth } from "../../src/hooks/useAuth";
import { useTheme } from "../../src/context/ThemeContext";

jest.mock("../../src/context/SettingsContext");
jest.mock("../../src/hooks/useAuth");
jest.mock("../../src/context/ThemeContext");
jest.mock("../../src/utils/soundManager", () => ({
  soundManager: {
    playAlarm: jest.fn().mockResolvedValue(undefined),
    stopAlarm: jest.fn().mockResolvedValue(undefined),
  },
}));

const mockUpdateMeditationEnabled = jest.fn();
const mockUpdateMeditationInterval = jest.fn();

const mockSettings = {
  id: "1",
  user_id: "user-1",
  work_duration: 25,
  break_duration: 5,
  alarm_sound_enabled: true,
  dark_mode_enabled: false,
  meditation_enabled: false,
  meditation_interval_minutes: 5,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

describe("SettingsScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    (useAuth as jest.Mock).mockReturnValue({
      user: { id: "user-1", email: "test@example.com" },
      signOut: jest.fn(),
    });

    (useTheme as jest.Mock).mockReturnValue({
      theme: {
        background: "#ffffff",
        surface: "#f5f5f5",
        text: {
          primary: "#000000",
          secondary: "#666666",
          tertiary: "#999999",
        },
        primary: "#007AFF",
        border: "#E0E0E0",
        accent: {
          work: "#FF6B6B",
          break: "#4ECDC4",
        },
      },
    });

    (useSettings as jest.Mock).mockReturnValue({
      settings: mockSettings,
      loading: false,
      updateWorkDuration: jest.fn(),
      updateBreakDuration: jest.fn(),
      updateAlarmEnabled: jest.fn(),
      updateDarkMode: jest.fn(),
      updateMeditationEnabled: mockUpdateMeditationEnabled,
      updateMeditationInterval: mockUpdateMeditationInterval,
    });
  });

  test("renders settings screen without crashing", () => {
    expect(() => {
      render(<SettingsScreen />);
    }).not.toThrow();
  });

  test("renders meditation settings section", () => {
    const { getByText } = render(<SettingsScreen />);

    expect(getByText("Meditation")).toBeTruthy();
    expect(getByText("Meditation Reminders")).toBeTruthy();
  });

  test("shows meditation interval slider when meditation is enabled", () => {
    (useSettings as jest.Mock).mockReturnValue({
      settings: { ...mockSettings, meditation_enabled: true },
      loading: false,
      updateWorkDuration: jest.fn(),
      updateBreakDuration: jest.fn(),
      updateAlarmEnabled: jest.fn(),
      updateDarkMode: jest.fn(),
      updateMeditationEnabled: mockUpdateMeditationEnabled,
      updateMeditationInterval: mockUpdateMeditationInterval,
    });

    const { getByText, getAllByText } = render(<SettingsScreen />);

    expect(getByText("Reminder Interval")).toBeTruthy();
    // "5 min" appears multiple times (work duration, break duration, meditation interval)
    // So we check that it exists at least once
    const fiveMinTexts = getAllByText("5 min");
    expect(fiveMinTexts.length).toBeGreaterThan(0);
  });

  test("hides meditation interval slider when meditation is disabled", () => {
    const { queryByText } = render(<SettingsScreen />);

    expect(queryByText("Reminder Interval")).toBeNull();
  });

  test("calls updateMeditationEnabled when toggle is pressed", async () => {
    const { getByTestId } = render(<SettingsScreen />);

    // Find the meditation toggle switch
    const toggle = getByTestId("meditation-toggle");
    fireEvent(toggle, "valueChange", true);

    await waitFor(() => {
      expect(mockUpdateMeditationEnabled).toHaveBeenCalledWith(true);
    });
  });
});

