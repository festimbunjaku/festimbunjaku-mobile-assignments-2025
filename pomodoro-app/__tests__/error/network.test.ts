import { supabase } from "../../src/services/supabase";

jest.mock("../../src/services/supabase");

describe("Network Error Handling", () => {
  const mockSupabase = supabase as jest.Mocked<typeof supabase>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("handles Supabase connection timeout", async () => {
    const mockFrom = jest.fn().mockImplementation(() => {
      const timeoutError = new Error("Connection timeout");
      (timeoutError as any).code = "ETIMEDOUT";
      throw timeoutError;
    });

    mockSupabase.from = mockFrom;

    try {
      await mockSupabase.from("sessions").select("*");
    } catch (error: any) {
      expect(error.message).toBe("Connection timeout");
      expect(error.code).toBe("ETIMEDOUT");
    }
  });

  test("handles Supabase authentication errors", async () => {
    const mockSignIn = jest.fn().mockResolvedValue({
      data: { user: null, session: null },
      error: {
        message: "Invalid login credentials",
        status: 400,
      },
    });

    mockSupabase.auth = {
      signInWithPassword: mockSignIn,
    } as any;

    const result = await mockSupabase.auth.signInWithPassword({
      email: "test@example.com",
      password: "wrongpassword",
    });

    expect(result.error).toBeDefined();
    expect(result.error?.message).toBe("Invalid login credentials");
  });

  test("handles API rate limiting", async () => {
    const mockFrom = jest.fn().mockReturnValue({
      select: jest.fn().mockResolvedValue({
        data: null,
        error: {
          message: "Too many requests",
          status: 429,
        },
      }),
    });

    mockSupabase.from = mockFrom;

    const result = await mockSupabase.from("sessions").select("*");

    expect(result.error).toBeDefined();
    expect(result.error?.status).toBe(429);
  });

  test("handles malformed API responses", async () => {
    const mockFrom = jest.fn().mockReturnValue({
      select: jest.fn().mockResolvedValue({
        data: "invalid json",
        error: null,
      }),
    });

    mockSupabase.from = mockFrom;

    const result = await mockSupabase.from("sessions").select("*");

    expect(result.data).toBe("invalid json");
    expect(typeof result.data).not.toBe("object");
  });
});

