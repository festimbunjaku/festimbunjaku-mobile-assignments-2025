import React from "react";
import { render } from "@testing-library/react-native";
import { RegisterScreen } from "../../../src/screens/Auth/RegisterScreen";
import { useAuth } from "../../../src/hooks/useAuth";
import { AllProvidersWrapper } from "../../helpers/testWrappers";

jest.mock("../../../src/hooks/useAuth");

const mockNavigation = {
  navigate: jest.fn(),
};

describe("RegisterScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({
      signUp: jest.fn(),
    });
  });

  test("renders register screen without crashing", () => {
    expect(() => {
      render(
        <AllProvidersWrapper>
          <RegisterScreen navigation={mockNavigation} />
        </AllProvidersWrapper>
      );
    }).not.toThrow();
  });
});

