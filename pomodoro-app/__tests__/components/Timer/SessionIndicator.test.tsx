import React from "react";
import { render } from "@testing-library/react-native";
import { SessionIndicator } from "../../../src/components/Timer/SessionIndicator";
import { AllProvidersWrapper } from "../../helpers/testWrappers";
import { TimerState } from "../../../src/types";

describe("SessionIndicator", () => {
  const mockTimerState: TimerState = {
    status: "idle",
    sessionType: "work",
    timeRemaining: 1800,
    targetDuration: 1800,
    currentSessionId: null,
    startedAt: null,
    pausedAt: null,
    totalPausedTime: 0,
  };

  test("displays sessions completed count", () => {
    const { getByText } = render(
      <AllProvidersWrapper>
        <SessionIndicator
          timerState={mockTimerState}
          sessionsCompleted={5}
          totalFocusTime={9000}
        />
      </AllProvidersWrapper>
    );

    expect(getByText("5")).toBeTruthy();
    expect(getByText("Sessions")).toBeTruthy();
  });

  test("displays total focus time correctly", () => {
    const { getByText } = render(
      <AllProvidersWrapper>
        <SessionIndicator
          timerState={mockTimerState}
          sessionsCompleted={3}
          totalFocusTime={1800}
        />
      </AllProvidersWrapper>
    );

    expect(getByText("30m")).toBeTruthy();
    expect(getByText("Focus Time")).toBeTruthy();
  });

  test("formats focus time with hours", () => {
    const { getByText } = render(
      <AllProvidersWrapper>
        <SessionIndicator
          timerState={mockTimerState}
          sessionsCompleted={2}
          totalFocusTime={3600}
        />
      </AllProvidersWrapper>
    );

    // 3600 seconds = 1 hour, 0 minutes = "1h 0m"
    expect(getByText("1h 0m")).toBeTruthy();
  });

  test("formats focus time with hours and minutes", () => {
    const { getByText } = render(
      <AllProvidersWrapper>
        <SessionIndicator
          timerState={mockTimerState}
          sessionsCompleted={4}
          totalFocusTime={5400}
        />
      </AllProvidersWrapper>
    );

    expect(getByText("1h 30m")).toBeTruthy();
  });

  test("formats zero focus time", () => {
    const { getByText } = render(
      <AllProvidersWrapper>
        <SessionIndicator
          timerState={mockTimerState}
          sessionsCompleted={0}
          totalFocusTime={0}
        />
      </AllProvidersWrapper>
    );

    expect(getByText("0m")).toBeTruthy();
  });

  test("displays work session type", () => {
    const { getByText } = render(
      <AllProvidersWrapper>
        <SessionIndicator
          timerState={mockTimerState}
          sessionsCompleted={1}
          totalFocusTime={1800}
        />
      </AllProvidersWrapper>
    );

    expect(getByText("Work")).toBeTruthy();
    expect(getByText("Type")).toBeTruthy();
  });

  test("displays break session type", () => {
    const breakState: TimerState = {
      ...mockTimerState,
      sessionType: "break",
    };

    const { getByText } = render(
      <AllProvidersWrapper>
        <SessionIndicator
          timerState={breakState}
          sessionsCompleted={1}
          totalFocusTime={600}
        />
      </AllProvidersWrapper>
    );

    expect(getByText("Break")).toBeTruthy();
    expect(getByText("Type")).toBeTruthy();
  });

  test("displays all three stats", () => {
    const { getByText } = render(
      <AllProvidersWrapper>
        <SessionIndicator
          timerState={mockTimerState}
          sessionsCompleted={10}
          totalFocusTime={7200}
        />
      </AllProvidersWrapper>
    );

    expect(getByText("10")).toBeTruthy();
    expect(getByText("Sessions")).toBeTruthy();
    // 7200 seconds = 2 hours, 0 minutes = "2h 0m"
    expect(getByText("2h 0m")).toBeTruthy();
    expect(getByText("Focus Time")).toBeTruthy();
    expect(getByText("Work")).toBeTruthy();
    expect(getByText("Type")).toBeTruthy();
  });
});

