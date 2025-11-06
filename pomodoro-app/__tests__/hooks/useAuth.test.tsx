import React from "react";
import { render, act, waitFor } from "@testing-library/react-native";
import { AuthProvider, useAuth } from "../../src/context/AuthContext";
import { supabase } from "../../src/services/supabase";

jest.mock("../../src/services/supabase");

// Test component that uses the hook
const TestComponent = ({
  onAuthState,
}: {
  onAuthState?: (auth: any) => void;
}) => {
  const auth = useAuth();
  React.useEffect(() => {
    onAuthState?.(auth);
  }, [auth, onAuthState]);
  return null;
};

describe("useAuth", () => {
  const mockSupabase = supabase as jest.Mocked<typeof supabase>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("loads initial session", async () => {
    const mockSession = {
      user: { id: "user-123", email: "test@example.com" },
      access_token: "token",
    };

    (mockSupabase.auth.getSession as jest.Mock).mockResolvedValue({
      data: { session: mockSession },
      error: null,
    });

    (mockSupabase.auth.onAuthStateChange as jest.Mock).mockReturnValue({
      data: { subscription: { unsubscribe: jest.fn() } },
    });

    let authResult: any;
    render(
      <AuthProvider>
        <TestComponent
          onAuthState={(auth) => {
            authResult = auth;
          }}
        />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(authResult).toBeDefined();
    });
  });

  test("signs up successfully", async () => {
    const mockUser = { id: "user-123", email: "test@example.com" };

    (mockSupabase.auth.signUp as jest.Mock).mockResolvedValue({
      data: { user: mockUser, session: null },
      error: null,
    });

    (mockSupabase.auth.getSession as jest.Mock).mockResolvedValue({
      data: { session: null },
      error: null,
    });

    (mockSupabase.auth.onAuthStateChange as jest.Mock).mockReturnValue({
      data: { subscription: { unsubscribe: jest.fn() } },
    });

    let authResult: any;
    render(
      <AuthProvider>
        <TestComponent
          onAuthState={(auth) => {
            authResult = auth;
          }}
        />
      </AuthProvider>
    );

    await act(async () => {
      const result = await authResult.signUp("test@example.com", "password123");
      expect(result.error).toBeNull();
    });
  });

  test("validates email format", async () => {
    (mockSupabase.auth.getSession as jest.Mock).mockResolvedValue({
      data: { session: null },
      error: null,
    });

    (mockSupabase.auth.onAuthStateChange as jest.Mock).mockReturnValue({
      data: { subscription: { unsubscribe: jest.fn() } },
    });

    let authResult: any;
    render(
      <AuthProvider>
        <TestComponent
          onAuthState={(auth) => {
            authResult = auth;
          }}
        />
      </AuthProvider>
    );

    await act(async () => {
      const result = await authResult.signUp("invalid-email", "password123");
      expect(result.error).toBeDefined();
      expect(result.error.message).toContain("valid email");
    });
  });

  test("validates password length", async () => {
    (mockSupabase.auth.getSession as jest.Mock).mockResolvedValue({
      data: { session: null },
      error: null,
    });

    (mockSupabase.auth.onAuthStateChange as jest.Mock).mockReturnValue({
      data: { subscription: { unsubscribe: jest.fn() } },
    });

    let authResult: any;
    render(
      <AuthProvider>
        <TestComponent
          onAuthState={(auth) => {
            authResult = auth;
          }}
        />
      </AuthProvider>
    );

    await act(async () => {
      const result = await authResult.signUp("test@example.com", "short");
      expect(result.error).toBeDefined();
      expect(result.error.message).toContain("6 characters");
    });
  });

  test("signs in successfully", async () => {
    const mockSession = {
      user: { id: "user-123", email: "test@example.com" },
      access_token: "token",
    };

    (mockSupabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
      data: { user: mockSession.user, session: mockSession },
      error: null,
    });

    (mockSupabase.auth.getSession as jest.Mock).mockResolvedValue({
      data: { session: null },
      error: null,
    });

    (mockSupabase.auth.onAuthStateChange as jest.Mock).mockReturnValue({
      data: { subscription: { unsubscribe: jest.fn() } },
    });

    let authResult: any;
    render(
      <AuthProvider>
        <TestComponent
          onAuthState={(auth) => {
            authResult = auth;
          }}
        />
      </AuthProvider>
    );

    await act(async () => {
      const result = await authResult.signIn("test@example.com", "password123");
      expect(result.error).toBeNull();
    });
  });

  test("handles invalid credentials", async () => {
    (mockSupabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
      data: { user: null, session: null },
      error: { message: "Invalid login credentials", status: 400 },
    });

    (mockSupabase.auth.getSession as jest.Mock).mockResolvedValue({
      data: { session: null },
      error: null,
    });

    (mockSupabase.auth.onAuthStateChange as jest.Mock).mockReturnValue({
      data: { subscription: { unsubscribe: jest.fn() } },
    });

    let authResult: any;
    render(
      <AuthProvider>
        <TestComponent
          onAuthState={(auth) => {
            authResult = auth;
          }}
        />
      </AuthProvider>
    );

    await act(async () => {
      const result = await authResult.signIn("test@example.com", "wrongpass");
      expect(result.error).toBeDefined();
      expect(result.error.message).toBe("Invalid login credentials");
    });
  });

  test("signs out successfully", async () => {
    const mockSession = {
      user: { id: "user-123", email: "test@example.com" },
      access_token: "token",
    };

    (mockSupabase.auth.getSession as jest.Mock).mockResolvedValue({
      data: { session: mockSession },
      error: null,
    });

    (mockSupabase.auth.signOut as jest.Mock).mockResolvedValue({
      error: null,
    });

    (mockSupabase.auth.onAuthStateChange as jest.Mock).mockReturnValue({
      data: { subscription: { unsubscribe: jest.fn() } },
    });

    let authResult: any;
    render(
      <AuthProvider>
        <TestComponent
          onAuthState={(auth) => {
            authResult = auth;
          }}
        />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(authResult.user).toBeDefined();
    });

    await act(async () => {
      await authResult.signOut();
    });

    expect(mockSupabase.auth.signOut).toHaveBeenCalled();
  });
});

