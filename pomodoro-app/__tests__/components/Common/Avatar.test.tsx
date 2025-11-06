import React from "react";
import { render } from "@testing-library/react-native";
import { Avatar } from "../../../src/components/Common/Avatar";
import { useTheme } from "../../../src/context/ThemeContext";

jest.mock("../../../src/context/ThemeContext");

const mockTheme = {
  background: "#ffffff",
  surface: "#f5f5f5",
  text: {
    primary: "#000000",
    secondary: "#666666",
    tertiary: "#999999",
  },
  primary: "#007AFF",
  border: "#E0E0E0",
  accent: {
    work: "#FF6B6B",
    break: "#4ECDC4",
  },
};

describe("Avatar", () => {
  beforeEach(() => {
    (useTheme as jest.Mock).mockReturnValue({ theme: mockTheme });
  });

  test("renders profile picture when URL is provided", () => {
    const { getByTestId } = render(
      <Avatar
        profilePictureUrl="https://example.com/profile.jpg"
        email="test@example.com"
      />
    );

    const image = getByTestId("avatar-image");
    expect(image).toBeTruthy();
    expect(image.props.source.uri).toBe("https://example.com/profile.jpg");
  });

  test("renders user initials when no profile picture", () => {
    const { getByTestId } = render(
      <Avatar profilePictureUrl={null} email="test@example.com" />
    );

    const initials = getByTestId("avatar-initials");
    expect(initials).toBeTruthy();
    expect(initials.props.children).toBe("T");
  });

  test("renders question mark when email is empty", () => {
    const { getByTestId } = render(
      <Avatar profilePictureUrl={null} email="" />
    );

    const initials = getByTestId("avatar-initials");
    expect(initials.props.children).toBe("?");
  });

  test("uses custom size", () => {
    const { getByTestId } = render(
      <Avatar
        profilePictureUrl="https://example.com/profile.jpg"
        email="test@example.com"
        size={60}
      />
    );

    const container = getByTestId("avatar-container");
    const styles = container.props.style;
    const flatStyles = Array.isArray(styles) ? styles : [styles];
    const width = flatStyles.find((s: any) => s?.width)?.width;
    expect(width).toBe(60);
  });
});

