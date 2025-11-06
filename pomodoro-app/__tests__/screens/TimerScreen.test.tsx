import React from "react";
import { render } from "@testing-library/react-native";
import { TimerScreen } from "../../src/screens/TimerScreen";
import { timerService } from "../../src/services/timer.service";
import { AllProvidersWrapper } from "../helpers/testWrappers";

jest.mock("../../src/services/timer.service");

// Mock useFocusEffect - don't call callback to avoid re-render loops
jest.mock("@react-navigation/native", () => ({
  useFocusEffect: jest.fn(() => {
    // Empty effect - don't call callback
  }),
}));

describe("TimerScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (timerService.getTodaysSessionCount as jest.Mock).mockResolvedValue(5);
    (timerService.getTodaysFocusTime as jest.Mock).mockResolvedValue(9000);
  });

  test("renders timer screen without crashing", () => {
    expect(() => {
      render(
        <AllProvidersWrapper>
          <TimerScreen />
        </AllProvidersWrapper>
      );
    }).not.toThrow();
  });
});
