import React from "react";
import { render, waitFor } from "@testing-library/react-native";
import { ProfileProvider, useProfile } from "../../src/context/ProfileContext";
import { useAuth } from "../../src/hooks/useAuth";
import { profileService } from "../../src/services/profile.service";
import { supabase } from "../../src/services/supabase";

jest.mock("../../src/hooks/useAuth");
jest.mock("../../src/services/profile.service");
jest.mock("../../src/services/supabase", () => ({
  supabase: {
    channel: jest.fn(),
    removeChannel: jest.fn(),
  },
}));

const TestComponent = () => {
  const { profile, loading } = useProfile();
  return (
    <>
      {loading ? (
        <div testID="loading">Loading...</div>
      ) : (
        <div testID="profile">{profile ? profile.email : "No profile"}</div>
      )}
    </>
  );
};

describe("ProfileContext", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("loads profile on mount", async () => {
    const mockUser = { id: "user-1", email: "test@example.com" };
    const mockProfile = {
      id: "user-1",
      email: "test@example.com",
      profile_picture_url: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const mockChannel = {
      on: jest.fn().mockReturnThis(),
      subscribe: jest.fn().mockReturnValue({ unsubscribe: jest.fn() }),
    };

    (useAuth as jest.Mock).mockReturnValue({ user: mockUser });
    (profileService.getProfile as jest.Mock).mockResolvedValue(mockProfile);
    (supabase.channel as jest.Mock).mockReturnValue(mockChannel);
    (supabase.removeChannel as jest.Mock).mockReturnValue(undefined);

    const { getByTestId } = render(
      <ProfileProvider>
        <TestComponent />
      </ProfileProvider>
    );

    await waitFor(() => {
      expect(profileService.getProfile).toHaveBeenCalledWith("user-1");
    });

    await waitFor(() => {
      const profileElement = getByTestId("profile");
      expect(profileElement.props.children).toBe("test@example.com");
    });
  });

  test("returns null profile when user is not logged in", async () => {
    (useAuth as jest.Mock).mockReturnValue({ user: null });

    const { getByTestId } = render(
      <ProfileProvider>
        <TestComponent />
      </ProfileProvider>
    );

    await waitFor(() => {
      const profileElement = getByTestId("profile");
      expect(profileElement.props.children).toBe("No profile");
    });
  });

  test("handles profile loading error gracefully", async () => {
    const mockUser = { id: "user-1", email: "test@example.com" };
    const mockChannel = {
      on: jest.fn().mockReturnThis(),
      subscribe: jest.fn().mockReturnValue({ unsubscribe: jest.fn() }),
    };

    (useAuth as jest.Mock).mockReturnValue({ user: mockUser });
    (profileService.getProfile as jest.Mock).mockResolvedValue(null);
    (supabase.channel as jest.Mock).mockReturnValue(mockChannel);
    (supabase.removeChannel as jest.Mock).mockReturnValue(undefined);

    const { getByTestId } = render(
      <ProfileProvider>
        <TestComponent />
      </ProfileProvider>
    );

    await waitFor(() => {
      const profileElement = getByTestId("profile");
      expect(profileElement.props.children).toBe("No profile");
    });
  });
});

