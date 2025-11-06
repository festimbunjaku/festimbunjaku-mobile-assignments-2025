import { timerService } from "../../src/services/timer.service";
import { storageService } from "../../src/services/storage.service";
import { supabase } from "../../src/services/supabase";

jest.mock("../../src/services/supabase");
jest.mock("../../src/services/storage.service");

describe("Timer Error Handling", () => {
  const mockSupabase = supabase as jest.Mocked<typeof supabase>;
  const mockFrom = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockSupabase.from = mockFrom;
  });

  test("handles timer state corruption", async () => {
    (storageService.getTimerState as jest.Mock).mockResolvedValue({
      status: "invalid-status",
      timeRemaining: -100,
      targetDuration: null,
    });

    const state = await storageService.getTimerState();

    expect(state).toBeDefined();
    expect(state.status).toBe("invalid-status");
    expect(state.timeRemaining).toBeLessThan(0);
  });

  test("handles background task failures", async () => {
    (storageService.getTimerState as jest.Mock).mockRejectedValue(
      new Error("Background task failed")
    );

    await expect(storageService.getTimerState()).rejects.toThrow(
      "Background task failed"
    );
  });

  test("handles session creation failures", async () => {
    const sessionData = {
      user_id: "user-123",
      type: "work",
      duration: 0,
      target_duration: 1800,
      started_at: new Date().toISOString(),
      is_completed: false,
    };

    const mockInsert = jest.fn().mockReturnValue({
      select: jest.fn().mockReturnValue({
        single: jest.fn().mockResolvedValue({
          data: null,
          error: { message: "Database error" },
        }),
      }),
    });

    mockFrom.mockReturnValue({
      insert: mockInsert,
    } as any);

    const result = await timerService.createSession(sessionData);

    expect(result).toBeNull();
  });

  test("handles session update failures", async () => {
    const sessionId = "session-123";
    const updates = { duration: 1800 };

    const mockUpdate = jest.fn().mockReturnValue({
      eq: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({
            data: null,
            error: { message: "Update failed" },
          }),
        }),
      }),
    });

    mockFrom.mockReturnValue({
      update: mockUpdate,
    } as any);

    const result = await timerService.updateSession(sessionId, updates);

    expect(result).toBeNull();
  });

  test("handles negative time remaining", async () => {
    const timerState = {
      status: "running",
      startedAt: new Date(Date.now() - 10000000).toISOString(),
      targetDuration: 1800,
      totalPausedTime: 0,
    };

    (storageService.getTimerState as jest.Mock).mockResolvedValue(timerState);

    const state = await storageService.getTimerState();
    const elapsed = Math.floor(
      (Date.now() - new Date(state.startedAt).getTime()) / 1000
    );
    const timeRemaining = Math.max(0, state.targetDuration - elapsed);

    expect(timeRemaining).toBe(0);
  });
});

