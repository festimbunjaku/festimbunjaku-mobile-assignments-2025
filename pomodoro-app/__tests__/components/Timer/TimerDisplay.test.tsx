import React from "react";
import { render } from "@testing-library/react-native";
import { TimerDisplay } from "../../../src/components/Timer/TimerDisplay";
import { AllProvidersWrapper } from "../../helpers/testWrappers";
import { TimerState } from "../../../src/types";

describe("TimerDisplay", () => {
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

  test("displays time correctly", () => {
    const { getByText } = render(
      <AllProvidersWrapper>
        <TimerDisplay timerState={mockTimerState} />
      </AllProvidersWrapper>
    );

    expect(getByText("30:00")).toBeTruthy();
  });

  test("updates on timer state change", () => {
    const { rerender, getByText } = render(
      <AllProvidersWrapper>
        <TimerDisplay timerState={mockTimerState} />
      </AllProvidersWrapper>
    );

    expect(getByText("30:00")).toBeTruthy();

    const updatedState: TimerState = {
      ...mockTimerState,
      timeRemaining: 900,
    };

    rerender(
      <AllProvidersWrapper>
        <TimerDisplay timerState={updatedState} />
      </AllProvidersWrapper>
    );

    expect(getByText("15:00")).toBeTruthy();
  });

  test("displays work session label", () => {
    const { getByText } = render(
      <AllProvidersWrapper>
        <TimerDisplay timerState={mockTimerState} />
      </AllProvidersWrapper>
    );

    expect(getByText("Focus Time")).toBeTruthy();
  });

  test("displays break session label", () => {
    const breakState: TimerState = {
      ...mockTimerState,
      sessionType: "break",
    };

    const { getByText } = render(
      <AllProvidersWrapper>
        <TimerDisplay timerState={breakState} />
      </AllProvidersWrapper>
    );

    expect(getByText("Break Time")).toBeTruthy();
  });

  test("displays status correctly", () => {
    const { getByText, rerender } = render(
      <AllProvidersWrapper>
        <TimerDisplay timerState={mockTimerState} />
      </AllProvidersWrapper>
    );

    expect(getByText("IDLE")).toBeTruthy();

    const runningState: TimerState = {
      ...mockTimerState,
      status: "running",
    };

    rerender(
      <AllProvidersWrapper>
        <TimerDisplay timerState={runningState} />
      </AllProvidersWrapper>
    );

    expect(getByText("RUNNING")).toBeTruthy();

    const pausedState: TimerState = {
      ...mockTimerState,
      status: "paused",
    };

    rerender(
      <AllProvidersWrapper>
        <TimerDisplay timerState={pausedState} />
      </AllProvidersWrapper>
    );

    expect(getByText("PAUSED")).toBeTruthy();
  });
});

