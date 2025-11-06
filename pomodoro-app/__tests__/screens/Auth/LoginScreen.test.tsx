import React from "react";
import { render } from "@testing-library/react-native";
import { LoginScreen } from "../../../src/screens/Auth/LoginScreen";
import { useAuth } from "../../../src/hooks/useAuth";
import { AllProvidersWrapper } from "../../helpers/testWrappers";

jest.mock("../../../src/hooks/useAuth");

const mockNavigation = {
  navigate: jest.fn(),
};

describe("LoginScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({
      signIn: jest.fn(),
    });
  });

  test("renders login screen without crashing", () => {
    expect(() => {
      render(
        <AllProvidersWrapper>
          <LoginScreen navigation={mockNavigation} />
        </AllProvidersWrapper>
      );
    }).not.toThrow();
  });
});

