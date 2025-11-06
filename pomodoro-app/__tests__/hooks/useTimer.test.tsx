import React from "react";
import { render, act, waitFor } from "@testing-library/react-native";
import { useTimer } from "../../src/hooks/useTimer";
import { timerService } from "../../src/services/timer.service";
import { storageService } from "../../src/services/storage.service";
import { useAuth } from "../../src/hooks/useAuth";
import { useSettings } from "../../src/context/SettingsContext";
import { AppState } from "react-native";

jest.mock("../../src/services/timer.service");
jest.mock("../../src/services/storage.service");
jest.mock("../../src/hooks/useAuth");
jest.mock("../../src/context/SettingsContext");
jest.mock("../../src/services/meditation.service", () => ({
  meditationService: {
    start: jest.fn(),
    stop: jest.fn(),
    pause: jest.fn(),
    resume: jest.fn(),
    reset: jest.fn(),
    updateInterval: jest.fn(),
  },
}));

// Mock I18nManager before mocking react-native
jest.mock("react-native/Libraries/ReactNative/I18nManager", () => ({
  __esModule: true,
  default: {
    getConstants: jest.fn(() => ({
      isRTL: false,
      doLeftAndRightSwapInRTL: true,
      localeIdentifier: "en_US",
    })),
    allowRTL: jest.fn(),
    forceRTL: jest.fn(),
    swapLeftAndRightInRTL: jest.fn(),
  },
}));

// Mock Settings native module
jest.mock("react-native/Libraries/Settings/Settings.ios", () => ({
  __esModule: true,
  default: {
    getConstants: jest.fn(() => ({})),
  },
}));

jest.mock("react-native", () => {
  const RN = jest.requireActual("react-native");
  return {
    ...RN,
    AppState: {
      ...RN.AppState,
      addEventListener: jest.fn(() => ({
        remove: jest.fn(),
      })),
    },
  };
});

// Test component that uses the hook
const TestComponent = ({
  onTimerState,
  options,
}: {
  onTimerState?: (state: any) => void;
  options?: { workDuration?: number; breakDuration?: number };
}) => {
  const timer = useTimer(options);
  React.useEffect(() => {
    onTimerState?.(timer);
  }, [timer, onTimerState]);
  return null;
};

describe("useTimer", () => {
  const mockUser = { id: "user-123", email: "test@example.com" };

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({ user: mockUser });
    (useSettings as jest.Mock).mockReturnValue({
      settings: {
        meditation_enabled: false,
        meditation_interval_minutes: 5,
      },
    });
    (storageService.getTimerState as jest.Mock).mockResolvedValue(null);
    (storageService.saveTimerState as jest.Mock).mockResolvedValue(undefined);
  });

  test("initializes with default durations", () => {
    let timerResult: any;
    render(
      <TestComponent
        onTimerState={(timer) => {
          timerResult = timer;
        }}
      />
    );

    expect(timerResult.timerState.status).toBe("idle");
    expect(timerResult.timerState.sessionType).toBe("work");
    expect(timerResult.timerState.timeRemaining).toBe(1800); // 30 minutes
  });

  test("starts timer successfully", async () => {
    const mockSession = {
      id: "session-123",
      user_id: mockUser.id,
      type: "work",
      duration: 0,
      target_duration: 1800,
      started_at: new Date().toISOString(),
      is_completed: false,
    };

    (timerService.createSession as jest.Mock).mockResolvedValue(mockSession);

    let timerResult: any;
    const { rerender } = render(
      <TestComponent
        onTimerState={(timer) => {
          timerResult = timer;
        }}
      />
    );

    await act(async () => {
      await timerResult.startTimer();
    });

    await waitFor(() => {
      expect(timerResult.timerState.status).toBe("running");
      expect(timerResult.timerState.currentSessionId).toBe("session-123");
    });
  });

  test("pauses running timer", async () => {
    const mockSession = {
      id: "session-123",
      user_id: mockUser.id,
      type: "work",
      duration: 0,
      target_duration: 1800,
      started_at: new Date().toISOString(),
      is_completed: false,
    };

    (timerService.createSession as jest.Mock).mockResolvedValue(mockSession);

    let timerResult: any;
    render(
      <TestComponent
        onTimerState={(timer) => {
          timerResult = timer;
        }}
      />
    );

    await act(async () => {
      await timerResult.startTimer();
    });

    await act(async () => {
      timerResult.pauseTimer();
    });

    expect(timerResult.timerState.status).toBe("paused");
  });

  test("resumes paused timer", async () => {
    const mockSession = {
      id: "session-123",
      user_id: mockUser.id,
      type: "work",
      duration: 0,
      target_duration: 1800,
      started_at: new Date().toISOString(),
      is_completed: false,
    };

    (timerService.createSession as jest.Mock).mockResolvedValue(mockSession);

    let timerResult: any;
    render(
      <TestComponent
        onTimerState={(timer) => {
          timerResult = timer;
        }}
      />
    );

    await act(async () => {
      await timerResult.startTimer();
    });

    await act(async () => {
      timerResult.pauseTimer();
    });

    await act(async () => {
      timerResult.resumeTimer();
    });

    expect(timerResult.timerState.status).toBe("running");
  });

  test("stops timer and saves session", async () => {
    const mockSession = {
      id: "session-123",
      user_id: mockUser.id,
      type: "work",
      duration: 0,
      target_duration: 1800,
      started_at: new Date().toISOString(),
      is_completed: false,
    };

    (timerService.createSession as jest.Mock).mockResolvedValue(mockSession);
    (timerService.updateSession as jest.Mock).mockResolvedValue(mockSession);

    let timerResult: any;
    render(
      <TestComponent
        onTimerState={(timer) => {
          timerResult = timer;
        }}
      />
    );

    await act(async () => {
      await timerResult.startTimer();
    });

    await act(async () => {
      await timerResult.stopTimer();
    });

    await waitFor(() => {
      expect(timerResult.timerState.status).toBe("idle");
      expect(timerResult.timerState.currentSessionId).toBeNull();
      expect(timerService.updateSession).toHaveBeenCalled();
    });
  });

  test("updates duration when settings change", async () => {
    let timerResult: any;
    const { rerender } = render(
      <TestComponent
        onTimerState={(timer) => {
          timerResult = timer;
        }}
        options={{ workDuration: 25, breakDuration: 5 }}
      />
    );

    expect(timerResult.timerState.targetDuration).toBe(1500); // 25 minutes

    await act(async () => {
      timerResult.updateDuration(30, 10);
    });

    expect(timerResult.timerState.targetDuration).toBe(1800); // 30 minutes
  });

  test("restores timer state on mount", async () => {
    const savedState = {
      status: "running",
      sessionType: "work",
      timeRemaining: 900,
      targetDuration: 1800,
      currentSessionId: "session-123",
      startedAt: new Date(Date.now() - 60000).toISOString(),
      pausedAt: null,
      totalPausedTime: 0,
    };

    (storageService.getTimerState as jest.Mock).mockResolvedValue(savedState);

    let timerResult: any;
    render(
      <TestComponent
        onTimerState={(timer) => {
          timerResult = timer;
        }}
      />
    );

    await waitFor(() => {
      expect(timerResult.timerState.currentSessionId).toBe("session-123");
    });
  });

  test("handles timer completion", async () => {
    jest.useFakeTimers();

    const targetSeconds = 5;
    const workDurationMinutes = targetSeconds / 60; // Convert to minutes

    const mockSession = {
      id: "session-123",
      user_id: mockUser.id,
      type: "work",
      duration: 0,
      target_duration: targetSeconds,
      started_at: new Date().toISOString(),
      is_completed: false,
    };

    const updatedSession = {
      ...mockSession,
      duration: targetSeconds,
      is_completed: true,
      completed_at: new Date().toISOString(),
    };

    (timerService.createSession as jest.Mock).mockResolvedValue(mockSession);
    (timerService.updateSession as jest.Mock).mockResolvedValue(updatedSession);

    let timerResult: any;
    render(
      <TestComponent
        onTimerState={(timer) => {
          timerResult = timer;
        }}
        options={{ workDuration: workDurationMinutes }}
      />
    );

    // Start timer
    await act(async () => {
      await timerResult.startTimer();
    });

    await waitFor(() => {
      expect(timerResult.timerState.status).toBe("running");
      // Allow small rounding differences
      expect(timerResult.timerState.timeRemaining).toBeGreaterThanOrEqual(targetSeconds - 1);
      expect(timerResult.timerState.timeRemaining).toBeLessThanOrEqual(targetSeconds + 1);
    });

    const initialTimeRemaining = timerResult.timerState.timeRemaining;

    // Fast-forward time to completion
    await act(async () => {
      jest.advanceTimersByTime(initialTimeRemaining * 1000);
    });

    // Verify completion state
    await waitFor(() => {
      expect(timerResult.timerState.status).toBe("completed");
      expect(timerResult.timerState.timeRemaining).toBe(0);
    });

    // Stop timer to save session
    await act(async () => {
      await timerResult.stopTimer();
    });

    // Verify session was updated with completion
    await waitFor(() => {
      expect(timerService.updateSession).toHaveBeenCalledWith(
        "session-123",
        expect.objectContaining({
          is_completed: true,
        })
      );
    });

    jest.useRealTimers();
  });
});

