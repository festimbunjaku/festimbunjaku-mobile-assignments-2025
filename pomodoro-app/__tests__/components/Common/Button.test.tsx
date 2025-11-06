import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { Button } from "../../../src/components/Common/Button";
import { AllProvidersWrapper } from "../../helpers/testWrappers";

describe("Button", () => {
  test("renders correctly", () => {
    const { getByText } = render(
      <AllProvidersWrapper>
        <Button title="Test Button" onPress={jest.fn()} />
      </AllProvidersWrapper>
    );

    expect(getByText("Test Button")).toBeTruthy();
  });

  test("handles press events", () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <AllProvidersWrapper>
        <Button title="Press Me" onPress={onPress} />
      </AllProvidersWrapper>
    );

    fireEvent.press(getByText("Press Me"));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  test("shows loading state", () => {
    const { queryByText, UNSAFE_getByType } = render(
      <AllProvidersWrapper>
        <Button title="Loading" onPress={jest.fn()} loading={true} />
      </AllProvidersWrapper>
    );

    expect(queryByText("Loading")).toBeNull();
    // ActivityIndicator should be present
    const activityIndicator = UNSAFE_getByType(
      require("react-native").ActivityIndicator
    );
    expect(activityIndicator).toBeTruthy();
  });

  test("applies variants correctly", () => {
    const { rerender, getByText } = render(
      <AllProvidersWrapper>
        <Button title="Primary" onPress={jest.fn()} variant="primary" />
      </AllProvidersWrapper>
    );

    const primaryButton = getByText("Primary");
    expect(primaryButton).toBeTruthy();

    rerender(
      <AllProvidersWrapper>
        <Button title="Secondary" onPress={jest.fn()} variant="secondary" />
      </AllProvidersWrapper>
    );

    const secondaryButton = getByText("Secondary");
    expect(secondaryButton).toBeTruthy();

    rerender(
      <AllProvidersWrapper>
        <Button title="Outline" onPress={jest.fn()} variant="outline" />
      </AllProvidersWrapper>
    );

    const outlineButton = getByText("Outline");
    expect(outlineButton).toBeTruthy();
  });

  test("disables button when disabled prop is true", () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <AllProvidersWrapper>
        <Button title="Disabled" onPress={onPress} disabled={true} />
      </AllProvidersWrapper>
    );

    const button = getByText("Disabled");
    fireEvent.press(button);
    expect(onPress).not.toHaveBeenCalled();
  });

  test("disables button when loading", () => {
    const onPress = jest.fn();
    const { UNSAFE_getByType } = render(
      <AllProvidersWrapper>
        <Button title="Loading" onPress={onPress} loading={true} />
      </AllProvidersWrapper>
    );

    // Button should show ActivityIndicator when loading
    const activityIndicator = UNSAFE_getByType(
      require("react-native").ActivityIndicator
    );
    expect(activityIndicator).toBeTruthy();
  });
});

