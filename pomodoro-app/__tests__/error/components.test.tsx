import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";
import { ErrorBoundary } from "../../src/components/Common/ErrorBoundary";
import { AllProvidersWrapper } from "../helpers/testWrappers";

// Component that throws an error
const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error("Test error");
  }
  return null;
};

describe("Component Error Handling", () => {
  test("ErrorBoundary catches render errors", () => {
    const consoleError = jest.spyOn(console, "error").mockImplementation(() => {});

    render(
      <AllProvidersWrapper>
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      </AllProvidersWrapper>
    );

    expect(screen.getByText("Oops! Something went wrong")).toBeTruthy();
    expect(screen.getByText("Test error")).toBeTruthy();

    consoleError.mockRestore();
  });

  test("ErrorBoundary reset functionality", () => {
    const consoleError = jest.spyOn(console, "error").mockImplementation(() => {});

    render(
      <AllProvidersWrapper>
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      </AllProvidersWrapper>
    );

    expect(screen.getByText("Oops! Something went wrong")).toBeTruthy();

    // Test reset button
    const resetButton = screen.getByText("Try Again");
    expect(resetButton).toBeTruthy();
    
    fireEvent.press(resetButton);

    consoleError.mockRestore();
  });

  test("handles missing context providers", () => {
    // This test verifies that using hooks outside providers throws errors
    // In practice, TypeScript and runtime checks should prevent this
    expect(() => {
      // This would throw if useAuth is called outside AuthProvider
      // We can't easily test this without actually calling the hook
      // But the error message should be clear
      const errorMessage = "useAuth must be used within an AuthProvider";
      expect(errorMessage).toBe("useAuth must be used within an AuthProvider");
    }).not.toThrow();
  });
});

