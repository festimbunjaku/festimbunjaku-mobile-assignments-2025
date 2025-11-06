import React from "react";
import { render } from "@testing-library/react-native";
import { HistoryScreen } from "../../src/screens/HistoryScreen";
import { timerService } from "../../src/services/timer.service";
import { AllProvidersWrapper } from "../helpers/testWrappers";

jest.mock("../../src/services/timer.service");

describe("HistoryScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (timerService.getSessionsInRange as jest.Mock).mockResolvedValue([]);
  });

  test("renders history screen without crashing", () => {
    expect(() => {
      render(
        <AllProvidersWrapper>
          <HistoryScreen />
        </AllProvidersWrapper>
      );
    }).not.toThrow();
  });
});

