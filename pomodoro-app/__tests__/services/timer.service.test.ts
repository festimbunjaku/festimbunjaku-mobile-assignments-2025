import { timerService } from "../../src/services/timer.service";
import { supabase } from "../../src/services/supabase";
import { Session, SessionCreate } from "../../src/types";

jest.mock("../../src/services/supabase");

describe("timerService", () => {
  const mockSupabase = supabase as jest.Mocked<typeof supabase>;
  const mockFrom = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockSupabase.from = mockFrom;
  });

  describe("createSession", () => {
    test("creates session successfully", async () => {
      const sessionData: SessionCreate = {
        user_id: "user-123",
        type: "work",
        duration: 0,
        target_duration: 1800,
        started_at: new Date().toISOString(),
        is_completed: false,
      };

      const mockSession: Session = {
        id: "session-123",
        ...sessionData,
        completed_at: null,
        paused_time: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const mockInsert = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({ data: mockSession, error: null }),
        }),
      });

      mockFrom.mockReturnValue({
        insert: mockInsert,
      } as any);

      const result = await timerService.createSession(sessionData);

      expect(result).toEqual(mockSession);
      expect(mockFrom).toHaveBeenCalledWith("sessions");
      expect(mockInsert).toHaveBeenCalledWith([sessionData]);
    });

    test("handles database errors", async () => {
      const sessionData: SessionCreate = {
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

    test("handles exceptions", async () => {
      const sessionData: SessionCreate = {
        user_id: "user-123",
        type: "work",
        duration: 0,
        target_duration: 1800,
        started_at: new Date().toISOString(),
        is_completed: false,
      };

      mockFrom.mockImplementation(() => {
        throw new Error("Network error");
      });

      const result = await timerService.createSession(sessionData);

      expect(result).toBeNull();
    });

    test("validates required fields", async () => {
      // Test missing user_id
      const sessionDataWithoutUserId = {
        type: "work",
        duration: 0,
        target_duration: 1800,
        started_at: new Date().toISOString(),
        is_completed: false,
      } as any;

      const mockInsert = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({
            data: null,
            error: { message: "user_id is required" },
          }),
        }),
      });

      mockFrom.mockReturnValue({
        insert: mockInsert,
      } as any);

      const result1 = await timerService.createSession(sessionDataWithoutUserId);
      expect(result1).toBeNull();

      // Test missing type
      const sessionDataWithoutType = {
        user_id: "user-123",
        duration: 0,
        target_duration: 1800,
        started_at: new Date().toISOString(),
        is_completed: false,
      } as any;

      const mockInsert2 = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({
            data: null,
            error: { message: "type is required" },
          }),
        }),
      });

      mockFrom.mockReturnValue({
        insert: mockInsert2,
      } as any);

      const result2 = await timerService.createSession(sessionDataWithoutType);
      expect(result2).toBeNull();
    });
  });

  describe("updateSession", () => {
    test("updates session successfully", async () => {
      const sessionId = "session-123";
      const updates = {
        duration: 1800,
        is_completed: true,
        completed_at: new Date().toISOString(),
      };

      const updatedSession: Session = {
        id: sessionId,
        user_id: "user-123",
        type: "work",
        duration: 1800,
        target_duration: 1800,
        started_at: new Date().toISOString(),
        completed_at: new Date().toISOString(),
        is_completed: true,
        paused_time: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const mockUpdate = jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: updatedSession,
              error: null,
            }),
          }),
        }),
      });

      mockFrom.mockReturnValue({
        update: mockUpdate,
      } as any);

      const result = await timerService.updateSession(sessionId, updates);

      expect(result).toEqual(updatedSession);
      expect(mockUpdate).toHaveBeenCalledWith(updates);
    });

    test("handles invalid session ID", async () => {
      const sessionId = "invalid-id";
      const updates = { duration: 1800 };

      const mockUpdate = jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: null,
              error: { message: "Not found" },
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
  });

  describe("getTodaysSessions", () => {
    test("returns sessions for today", async () => {
      const userId = "user-123";
      const mockSessions: Session[] = [
        {
          id: "session-1",
          user_id: userId,
          type: "work",
          duration: 1800,
          target_duration: 1800,
          started_at: new Date().toISOString(),
          completed_at: new Date().toISOString(),
          is_completed: true,
          paused_time: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ];

      const mockSelect = jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          gte: jest.fn().mockReturnValue({
            order: jest.fn().mockResolvedValue({
              data: mockSessions,
              error: null,
            }),
          }),
        }),
      });

      mockFrom.mockReturnValue({
        select: mockSelect,
      } as any);

      const result = await timerService.getTodaysSessions(userId);

      expect(result).toEqual(mockSessions);
    });

    test("returns empty array on error", async () => {
      const userId = "user-123";

      const mockSelect = jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          gte: jest.fn().mockReturnValue({
            order: jest.fn().mockResolvedValue({
              data: null,
              error: { message: "Error" },
            }),
          }),
        }),
      });

      mockFrom.mockReturnValue({
        select: mockSelect,
      } as any);

      const result = await timerService.getTodaysSessions(userId);

      expect(result).toEqual([]);
    });

    test("handles timezone correctly", async () => {
      const userId = "user-123";
      
      // Get current date in local timezone
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayISO = today.toISOString();
      
      // Create a session that should be included (today in local time)
      const mockSessions: Session[] = [
        {
          id: "session-1",
          user_id: userId,
          type: "work",
          duration: 1800,
          target_duration: 1800,
          started_at: new Date().toISOString(), // Current time
          completed_at: new Date().toISOString(),
          is_completed: true,
          paused_time: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ];

      const mockSelect = jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          gte: jest.fn().mockReturnValue({
            order: jest.fn().mockResolvedValue({
              data: mockSessions,
              error: null,
            }),
          }),
        }),
      });

      mockFrom.mockReturnValue({
        select: mockSelect,
      } as any);

      const result = await timerService.getTodaysSessions(userId);

      expect(result).toEqual(mockSessions);
      // Verify that the query uses today's date (midnight local time converted to ISO)
      expect(mockSelect).toHaveBeenCalledWith("*");
      expect(mockSelect().eq).toHaveBeenCalledWith("user_id", userId);
      // The gte should be called with today's date at midnight in ISO format
      expect(mockSelect().eq().gte).toHaveBeenCalledWith("started_at", expect.stringContaining(today.toISOString().split("T")[0]));
    });
  });

  describe("getTodaysFocusTime", () => {
    test("calculates total focus time correctly", async () => {
      const userId = "user-123";
      const mockData = [
        { duration: 1800, type: "work" },
        { duration: 1200, type: "work" },
      ];

      const mockSelect = jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            gte: jest.fn().mockReturnValue({
              lt: jest.fn().mockReturnValue({
                gt: jest.fn().mockResolvedValue({
                  data: mockData,
                  error: null,
                }),
              }),
            }),
          }),
        }),
      });

      mockFrom.mockReturnValue({
        select: mockSelect,
      } as any);

      const result = await timerService.getTodaysFocusTime(userId);

      expect(result).toBe(3000);
    });

    test("only counts work sessions", async () => {
      const userId = "user-123";
      // Only work sessions should be returned since we filter by type="work" in the query
      const mockData = [
        { duration: 1800, type: "work" },
      ];

      const mockSelect = jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            gte: jest.fn().mockReturnValue({
              lt: jest.fn().mockReturnValue({
                gt: jest.fn().mockResolvedValue({
                  data: mockData,
                  error: null,
                }),
              }),
            }),
          }),
        }),
      });

      mockFrom.mockReturnValue({
        select: mockSelect,
      } as any);

      const result = await timerService.getTodaysFocusTime(userId);

      expect(result).toBe(1800);
    });

    test("handles zero duration sessions", async () => {
      const userId = "user-123";
      const mockData = [
        { duration: 1800, type: "work" },
        { duration: 0, type: "work" },
      ];

      const mockSelect = jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            gte: jest.fn().mockReturnValue({
              lt: jest.fn().mockReturnValue({
                gt: jest.fn().mockResolvedValue({
                  data: mockData,
                  error: null,
                }),
              }),
            }),
          }),
        }),
      });

      mockFrom.mockReturnValue({
        select: mockSelect,
      } as any);

      const result = await timerService.getTodaysFocusTime(userId);

      expect(result).toBe(1800);
    });

    test("returns 0 on error", async () => {
      const userId = "user-123";

      const mockSelect = jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            gte: jest.fn().mockReturnValue({
              lt: jest.fn().mockReturnValue({
                gt: jest.fn().mockResolvedValue({
                  data: null,
                  error: { message: "Error" },
                }),
              }),
            }),
          }),
        }),
      });

      mockFrom.mockReturnValue({
        select: mockSelect,
      } as any);

      const result = await timerService.getTodaysFocusTime(userId);

      expect(result).toBe(0);
    });
  });

  describe("getStatsForDays", () => {
    test("groups sessions by date", async () => {
      const userId = "user-123";
      const days = 7;
      const mockData = [
        {
          started_at: "2024-01-15T10:00:00Z",
          duration: 1800,
          type: "work",
        },
        {
          started_at: "2024-01-15T14:00:00Z",
          duration: 1200,
          type: "work",
        },
        {
          started_at: "2024-01-16T10:00:00Z",
          duration: 1800,
          type: "work",
        },
      ];

      const mockSelect = jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            gt: jest.fn().mockReturnValue({
              gte: jest.fn().mockReturnValue({
                order: jest.fn().mockResolvedValue({
                  data: mockData,
                  error: null,
                }),
              }),
            }),
          }),
        }),
      });

      mockFrom.mockReturnValue({
        select: mockSelect,
      } as any);

      const result = await timerService.getStatsForDays(userId, days);

      expect(result).toHaveLength(2);
      expect(result[0].date).toBe("2024-01-15");
      expect(result[0].totalTime).toBe(3000);
      expect(result[0].sessionCount).toBe(2);
      expect(result[1].date).toBe("2024-01-16");
      expect(result[1].totalTime).toBe(1800);
      expect(result[1].sessionCount).toBe(1);
    });

    test("returns empty array on error", async () => {
      const userId = "user-123";
      const days = 7;

      const mockSelect = jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            gt: jest.fn().mockReturnValue({
              gte: jest.fn().mockReturnValue({
                order: jest.fn().mockResolvedValue({
                  data: null,
                  error: { message: "Error" },
                }),
              }),
            }),
          }),
        }),
      });

      mockFrom.mockReturnValue({
        select: mockSelect,
      } as any);

      const result = await timerService.getStatsForDays(userId, days);

      expect(result).toEqual([]);
    });

    test("calculates totals per day", async () => {
      const userId = "user-123";
      const days = 7;
      const mockData = [
        {
          started_at: "2024-01-15T10:00:00Z",
          duration: 1800,
          type: "work",
        },
        {
          started_at: "2024-01-15T14:00:00Z",
          duration: 1200,
          type: "work",
        },
        {
          started_at: "2024-01-15T16:00:00Z",
          duration: 900,
          type: "work",
        },
        {
          started_at: "2024-01-16T10:00:00Z",
          duration: 1800,
          type: "work",
        },
        {
          started_at: "2024-01-16T14:00:00Z",
          duration: 600,
          type: "work",
        },
      ];

      const mockSelect = jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            gt: jest.fn().mockReturnValue({
              gte: jest.fn().mockReturnValue({
                order: jest.fn().mockResolvedValue({
                  data: mockData,
                  error: null,
                }),
              }),
            }),
          }),
        }),
      });

      mockFrom.mockReturnValue({
        select: mockSelect,
      } as any);

      const result = await timerService.getStatsForDays(userId, days);

      // Should group by date and calculate totals
      expect(result).toHaveLength(2);
      
      // 2024-01-15: 3 sessions, total 3900 seconds (1800 + 1200 + 900)
      const day1 = result.find((r) => r.date === "2024-01-15");
      expect(day1).toBeDefined();
      expect(day1?.totalTime).toBe(3900);
      expect(day1?.sessionCount).toBe(3);
      
      // 2024-01-16: 2 sessions, total 2400 seconds (1800 + 600)
      const day2 = result.find((r) => r.date === "2024-01-16");
      expect(day2).toBeDefined();
      expect(day2?.totalTime).toBe(2400);
      expect(day2?.sessionCount).toBe(2);
    });
  });
});

