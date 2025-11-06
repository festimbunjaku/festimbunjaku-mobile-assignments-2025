import React from "react";
import { render } from "@testing-library/react-native";
import { LoadingSpinner } from "../../../src/components/Common/LoadingSpinner";
import { AllProvidersWrapper } from "../../helpers/testWrappers";

describe("LoadingSpinner", () => {
  test("renders with default message", () => {
    const { getByText } = render(
      <AllProvidersWrapper>
        <LoadingSpinner />
      </AllProvidersWrapper>
    );

    expect(getByText("Loading...")).toBeTruthy();
  });

  test("renders with custom message", () => {
    const { getByText } = render(
      <AllProvidersWrapper>
        <LoadingSpinner message="Please wait..." />
      </AllProvidersWrapper>
    );

    expect(getByText("Please wait...")).toBeTruthy();
  });

  test("displays loading icon", () => {
    const { getByTestId } = render(
      <AllProvidersWrapper>
        <LoadingSpinner />
      </AllProvidersWrapper>
    );

    // The icon should be rendered (MaterialIcons hourglass-empty)
    // Since we mock @expo/vector-icons, it renders as Text with testID
    expect(getByTestId("icon-hourglass-empty")).toBeTruthy();
  });

  test("renders with empty message", () => {
    const { getByText } = render(
      <AllProvidersWrapper>
        <LoadingSpinner message="" />
      </AllProvidersWrapper>
    );

    expect(getByText("")).toBeTruthy();
  });
});

