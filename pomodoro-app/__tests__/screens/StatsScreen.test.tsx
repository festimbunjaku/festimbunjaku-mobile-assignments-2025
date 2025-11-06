import React from "react";
import { render } from "@testing-library/react-native";
import { StatsScreen } from "../../src/screens/StatsScreen";
import { useStats } from "../../src/hooks/useStats";
import { AllProvidersWrapper } from "../helpers/testWrappers";

jest.mock("../../src/hooks/useStats");

// Mock react-native-chart-kit
jest.mock("react-native-chart-kit", () => ({
  LineChart: () => null,
  BarChart: () => null,
}));

describe("StatsScreen", () => {
  const mockStats = {
    todayFocusTime: 3600,
    todaySessionCount: 5,
    last7DaysStats: [
      { date: "2024-01-15", totalTime: 1800, sessionCount: 2 },
      { date: "2024-01-16", totalTime: 3600, sessionCount: 4 },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useStats as jest.Mock).mockReturnValue({
      stats: mockStats,
      loading: false,
      refetch: jest.fn(),
    });
  });

  test("renders stats screen without crashing", () => {
    expect(() => {
      render(
        <AllProvidersWrapper>
          <StatsScreen />
        </AllProvidersWrapper>
      );
    }).not.toThrow();
  });
});
