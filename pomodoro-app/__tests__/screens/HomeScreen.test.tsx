import React from "react";
import { render } from "@testing-library/react-native";
import { HomeScreen } from "../../src/screens/HomeScreen";
import { AllProvidersWrapper } from "../helpers/testWrappers";

const mockNavigation = {
  navigate: jest.fn(),
};

describe("HomeScreen", () => {
  test("renders home screen without crashing", () => {
    expect(() => {
      render(
        <AllProvidersWrapper>
          <HomeScreen navigation={mockNavigation} />
        </AllProvidersWrapper>
      );
    }).not.toThrow();
  });
});

