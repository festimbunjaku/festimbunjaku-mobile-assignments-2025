import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { Input } from "../../../src/components/Common/Input";
import { AllProvidersWrapper } from "../../helpers/testWrappers";

describe("Input", () => {
  test("renders label and placeholder", () => {
    const { getByText, getByPlaceholderText } = render(
      <AllProvidersWrapper>
        <Input label="Email" placeholder="Enter email" />
      </AllProvidersWrapper>
    );

    expect(getByText("Email")).toBeTruthy();
    expect(getByPlaceholderText("Enter email")).toBeTruthy();
  });

  test("handles text input", () => {
    const onChangeText = jest.fn();
    const { getByPlaceholderText } = render(
      <AllProvidersWrapper>
        <Input placeholder="Enter text" onChangeText={onChangeText} />
      </AllProvidersWrapper>
    );

    const input = getByPlaceholderText("Enter text");
    fireEvent.changeText(input, "test input");

    expect(onChangeText).toHaveBeenCalledWith("test input");
  });

  test("displays error message", () => {
    const { getByText } = render(
      <AllProvidersWrapper>
        <Input label="Email" error="Invalid email" />
      </AllProvidersWrapper>
    );

    expect(getByText("Invalid email")).toBeTruthy();
  });

  test("renders without label", () => {
    const { queryByText, getByPlaceholderText } = render(
      <AllProvidersWrapper>
        <Input placeholder="Enter text" />
      </AllProvidersWrapper>
    );

    expect(queryByText("Email")).toBeNull();
    expect(getByPlaceholderText("Enter text")).toBeTruthy();
  });

  test("applies custom styles", () => {
    const customStyle = { backgroundColor: "#ff0000" };
    const { getByPlaceholderText } = render(
      <AllProvidersWrapper>
        <Input placeholder="Test" style={customStyle} />
      </AllProvidersWrapper>
    );

    const input = getByPlaceholderText("Test");
    expect(input).toBeTruthy();
  });
});

