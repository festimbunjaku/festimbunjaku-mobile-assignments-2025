import React from "react";
import { render, waitFor } from "@testing-library/react-native";
import { useStats } from "../../src/hooks/useStats";
import { timerService } from "../../src/services/timer.service";
import { useAuth } from "../../src/hooks/useAuth";

jest.mock("../../src/services/timer.service");
jest.mock("../../src/hooks/useAuth");

// Test component that uses the hook
const TestComponent = ({
  onStatsState,
}: {
  onStatsState?: (stats: any) => void;
}) => {
  const stats = useStats();
  React.useEffect(() => {
    onStatsState?.(stats);
  }, [stats, onStatsState]);
  return null;
};

describe("useStats", () => {
  const mockUser = { id: "user-123", email: "test@example.com" };

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({ user: mockUser });
  });

  test("loads today stats", async () => {
    const mockStats = {
      todayFocusTime: 3600,
      todaySessionCount: 2,
      last7DaysStats: [
        { date: "2024-01-15", totalTime: 3600, sessionCount: 2 },
      ],
    };

    (timerService.getTodaysFocusTime as jest.Mock).mockResolvedValue(
      mockStats.todayFocusTime
    );
    (timerService.getTodaysSessionCount as jest.Mock).mockResolvedValue(
      mockStats.todaySessionCount
    );
    (timerService.getStatsForDays as jest.Mock).mockResolvedValue(
      mockStats.last7DaysStats
    );

    let statsResult: any;
    render(
      <TestComponent
        onStatsState={(stats) => {
          statsResult = stats;
        }}
      />
    );

    await waitFor(() => {
      expect(statsResult.stats.todayFocusTime).toBe(3600);
      expect(statsResult.stats.todaySessionCount).toBe(2);
    });
  });

  test("refreshes stats on focus", async () => {
    (timerService.getTodaysFocusTime as jest.Mock).mockResolvedValue(0);
    (timerService.getTodaysSessionCount as jest.Mock).mockResolvedValue(0);
    (timerService.getStatsForDays as jest.Mock).mockResolvedValue([]);

    let statsResult: any;
    render(
      <TestComponent
        onStatsState={(stats) => {
          statsResult = stats;
        }}
      />
    );

    await waitFor(() => {
      expect(statsResult).toBeDefined();
    });

    const initialCallCount = (timerService.getTodaysFocusTime as jest.Mock).mock.calls.length;

    await waitFor(async () => {
      await statsResult.refetch();
    });

    expect(timerService.getTodaysFocusTime).toHaveBeenCalledTimes(
      initialCallCount + 1
    );
  });

  test("handles loading states", async () => {
    (timerService.getTodaysFocusTime as jest.Mock).mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve(0), 100))
    );
    (timerService.getTodaysSessionCount as jest.Mock).mockResolvedValue(0);
    (timerService.getStatsForDays as jest.Mock).mockResolvedValue([]);

    let statsResult: any;
    render(
      <TestComponent
        onStatsState={(stats) => {
          statsResult = stats;
        }}
      />
    );

    // Initially should be loading
    expect(statsResult.loading).toBe(true);

    await waitFor(() => {
      expect(statsResult.loading).toBe(false);
    });
  });

  test("handles errors", async () => {
    (timerService.getTodaysFocusTime as jest.Mock).mockRejectedValue(
      new Error("Network error")
    );
    (timerService.getTodaysSessionCount as jest.Mock).mockResolvedValue(0);
    (timerService.getStatsForDays as jest.Mock).mockResolvedValue([]);

    let statsResult: any;
    render(
      <TestComponent
        onStatsState={(stats) => {
          statsResult = stats;
        }}
      />
    );

    await waitFor(() => {
      expect(statsResult.error).toBeDefined();
    });
  });

  test("does not fetch when user is null", async () => {
    (useAuth as jest.Mock).mockReturnValue({ user: null });

    let statsResult: any;
    render(
      <TestComponent
        onStatsState={(stats) => {
          statsResult = stats;
        }}
      />
    );

    await waitFor(() => {
      expect(statsResult).toBeDefined();
    });

    expect(timerService.getTodaysFocusTime).not.toHaveBeenCalled();
  });
});

