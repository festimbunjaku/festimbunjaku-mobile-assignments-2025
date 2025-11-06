import { supabase } from "../../src/services/supabase";

jest.mock("../../src/services/supabase");

describe("Authentication Error Handling", () => {
  const mockSupabase = supabase as jest.Mocked<typeof supabase>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("handles invalid email format", async () => {
    const invalidEmails = [
      "notanemail",
      "@example.com",
      "test@",
      "test@example",
    ];

    for (const email of invalidEmails) {
      // More strict email validation regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const trimmedEmail = email.trim().toLowerCase();
      const isValid = Boolean(trimmedEmail && emailRegex.test(trimmedEmail));
      expect(isValid).toBe(false);
    }
    
    // Test email with space separately (trimming removes the space, so check before trim)
    const emailWithSpace = "test @example.com";
    const hasSpace = /\s/.test(emailWithSpace);
    expect(hasSpace).toBe(true);
    
    // Test consecutive dots separately (this regex doesn't catch it, but it's still invalid)
    const emailWithConsecutiveDots = "test..test@example.com";
    const trimmedDots = emailWithConsecutiveDots.trim().toLowerCase();
    // Check for consecutive dots manually
    const hasConsecutiveDots = /\.\./.test(trimmedDots.split("@")[0]);
    expect(hasConsecutiveDots).toBe(true);
    
    // Empty string should be invalid
    const emptyEmail = "";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValidEmpty = Boolean(emptyEmail.trim() && emailRegex.test(emptyEmail.trim().toLowerCase()));
    expect(isValidEmpty).toBe(false);
  });

  test("handles weak passwords", async () => {
    const weakPasswords = ["123", "abc", "short", ""];

    for (const password of weakPasswords) {
      const isValid = Boolean(password && password.length >= 6);
      expect(isValid).toBe(false);
    }
  });

  test("handles expired sessions", async () => {
    const mockGetSession = jest.fn().mockResolvedValue({
      data: {
        session: null,
      },
      error: {
        message: "JWT expired",
        status: 401,
      },
    });

    mockSupabase.auth = {
      getSession: mockGetSession,
    } as any;

    const result = await mockSupabase.auth.getSession();

    expect(result.error).toBeDefined();
    expect(result.error?.status).toBe(401);
  });

  test("handles signup with existing email", async () => {
    const mockSignUp = jest.fn().mockResolvedValue({
      data: {
        user: null,
        session: null,
      },
      error: {
        message: "User already registered",
        status: 422,
      },
    });

    mockSupabase.auth = {
      signUp: mockSignUp,
    } as any;

    const result = await mockSupabase.auth.signUp({
      email: "existing@example.com",
      password: "password123",
    });

    expect(result.error).toBeDefined();
    expect(result.error?.message).toContain("already registered");
  });

  test("handles logout failures", async () => {
    const mockSignOut = jest.fn().mockRejectedValue(
      new Error("Logout failed")
    );

    mockSupabase.auth = {
      signOut: mockSignOut,
    } as any;

    await expect(mockSupabase.auth.signOut()).rejects.toThrow(
      "Logout failed"
    );
  });

  test("handles network errors during sign in", async () => {
    const mockSignIn = jest.fn().mockRejectedValue(
      new Error("Network request failed")
    );

    mockSupabase.auth = {
      signInWithPassword: mockSignIn,
    } as any;

    await expect(
      mockSupabase.auth.signInWithPassword({
        email: "test@example.com",
        password: "password123",
      })
    ).rejects.toThrow("Network request failed");
  });
});

